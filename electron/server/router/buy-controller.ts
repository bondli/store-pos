import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import logger from 'electron-log';
import Decimal from 'decimal.js';

import { Order } from '../model/order';
import { OrderItems } from '../model/orderItems';
import { Member } from '../model/member';
import { Inventory } from '../model/inventory';
import { MemberScore } from '../model/memberScore';
import { MemberBalance } from '../model/memberBalance';
import { StoreCoupon } from '../model/storeCoupon';
import { MemberCoupon } from '../model/memberCoupon';
import { OrderCoupons } from '../model/orderCoupons';
import { Marketing } from '../model/marketing';

// 创建订单
export const submitOrder = async (req: Request, res: Response) => {
  const { buyer = {}, storeSaler = {}, waitSales = {}, storeCoupons = [] } = req.body;
  const { counts, totalAmount, payAmount, actualAmount, payType, remark } = waitSales?.brief || {};
  try {
    // 构造订单编号
    const today = dayjs();
    const todayStr = today.format('YYYYMMDD');
    const start = today.startOf('day').toDate();
    const end = today.endOf('day').toDate();
    const where = {};
    where['createdAt'] = {
      [Op.gte]: start,
      [Op.lte]: end,
    };

    const todayOrders = await Order.count({
      where,
    });

    // 计算使用优惠券的金额
    const useStoreCouponAmount = storeCoupons.reduce((acc, coupon) => acc + coupon.couponValue, 0);
    const useUserCouponAmount = buyer?.useCoupon || 0;

    // 1.写入订单表
    const resultOrderCreate = await Order.create({
      orderSn: `${todayStr}${String(todayOrders+1).padStart(3, '0')}`,
      orderStatus: `uncheck`,
      orderItems: counts,
      originalAmount: totalAmount, // 商品吊牌总金额
      orderAmount: payAmount, // 商品折扣之后的应付金额
      orderActualAmount: actualAmount, // 商品折扣之后的实付金额
      payType,
      userPhone: buyer?.phone || '',
      usePoint: buyer?.usePoint || 0,
      useBalance: buyer?.useBalance || 0,
      useCoupon: useStoreCouponAmount + useUserCouponAmount,
      salerId: storeSaler.id,
      salerName: storeSaler.name,
      remark,
      // 获取当前机器的操作系统，如果是 mac 系统，则 source 为 outlet，否则为 inshop
      source: process.platform === 'darwin' ? 'outlet' : 'inshop',
      // 将当前订单的信息全部写入 extra 字段，便于导入导出
      extra: JSON.stringify({
        buyer,
        storeSaler,
        waitSales,
        storeCoupons,
      }),
    });

    if (!resultOrderCreate) {
      throw new Error('Failed to create order: No result returned');
    }

    const orderData = resultOrderCreate.toJSON();
    if (!orderData.orderSn) {
      throw new Error('Failed to create order: Invalid order data');
    }

    // 2.写入订单商品表
    const rate = new Decimal(actualAmount).div(payAmount); // 这个地方别做toFixed，否则会丢失精度
    const orderItems = waitSales.list.map(item => ({
      orderSn: orderData.orderSn,
      sku: item.sku,
      sn: item.sn,
      name: item.name,
      brand: item.brand,
      color: item.color,
      size: item.size,
      originalPrice: item.originalPrice,
      discount: item.discount,
      counts: item.counts,
      actualPrice: item.isGived ? 0 : new Decimal(item.salePrice).mul(rate).mul(item.counts).toDecimalPlaces(2),
    }));

    const resultOrderItemsCreate = await OrderItems.bulkCreate(orderItems);
    if (!resultOrderItemsCreate || resultOrderItemsCreate.length !== waitSales.list.length) {
      throw new Error('Failed to create order items: Invalid data');
    }

    // 3.扣减 SKU 对应的库存
    for (const item of waitSales.list) {
      const inventory = await Inventory.findOne({
        where: { sku: item.sku }
      });

      if (!inventory) {
        throw new Error(`Inventory not found for SKU: ${item.sku}`);
      }

      const inventoryData = inventory.toJSON();
      if (inventoryData.counts < item.counts) {
        // throw new Error(`Insufficient inventory for SKU: ${item.sku}`);
        logger.error(`Insufficient inventory for SKU: ${item.sku}`);
      }

      await inventory.update({
        counts: inventoryData.counts - item.counts
      });
    }

    // 4.更新用户信息（消费金额更新，积分更新，余额更新）
    if (buyer.phone) {
      const member = await Member.findOne({
        where: { phone: buyer.phone }
      });

      if (!member) {
        throw new Error(`Member not found for phone: ${buyer.phone}`);
      }

      const memberData = member.toJSON();
      const updates = {
        // 更新消费金额
        actual: new Decimal(memberData.actual).plus(actualAmount).toDecimalPlaces(2),
        // 更新积分（减去使用的积分，加上新获得的积分）
        point: new Decimal(memberData.point).minus(buyer.usePoint || 0).plus(Math.floor(actualAmount)).toNumber(),
        // 更新余额（减去使用的余额）
        balance: new Decimal(memberData.balance).minus(buyer.useBalance || 0).toDecimalPlaces(2)
      };

      await member.update(updates);

      // 5.写入用户积分流水表
      const pointRecords: Array<{
        phone: string;
        point: number;
        type: string;
        reason: string;
      }> = [];

      // 如果有实际支付金额，记录积分奖励
      if (actualAmount > 0) {
        const earnedPoints = Math.floor(actualAmount);
        pointRecords.push({
          phone: buyer.phone,
          point: earnedPoints,
          type: 'earn',
          reason: `订单 ${orderData.orderSn} 获取积分`,
        });
      }
      
      // 如果有使用积分，记录积分使用
      if (buyer.usePoint > 0) {
        pointRecords.push({
          phone: buyer.phone,
          point: -buyer.usePoint,
          type: 'use',
          reason: `订单 ${orderData.orderSn} 使用积分`,
        });
      }

      // 批量创建积分流水记录
      if (pointRecords.length > 0) {
        await MemberScore.bulkCreate(pointRecords);
      }
      
      // 6.如果有使用余额，记录余额使用
      if (buyer.useBalance > 0) {
        // 写入用户余额流水表
        const balanceRecords: Array<{
          phone: string;
          value: number;
          type: string;
          reason: string;
        }> = [];
        balanceRecords.push({
          phone: buyer.phone,
          value: -buyer.useBalance,
          type: 'use',
          reason: `订单 ${orderData.orderSn} 使用余额`,
        });
        // 批量创建余额流水记录
        await MemberBalance.bulkCreate(balanceRecords);
      }

      // 7.如果用户有使用券，记录券使用
      if (buyer.useCoupon > 0 && buyer.useCouponId) {
        // 获取优惠券信息
        const memberCoupon = await MemberCoupon.findOne({
          where: { id: buyer.useCouponId }
        });

        if (!memberCoupon) {
          throw new Error(`Member coupon not found for id: ${buyer.useCouponId}`);
        }

        const memberCouponData = memberCoupon.toJSON();

        // 更新优惠券使用状态
        await MemberCoupon.update({
          couponStatus: 'used',
        }, {
          where: { id: buyer.useCouponId }
        });
        // 用户的基本信息表中更新优惠券数量
        await Member.increment({
          couponCount: -1,
        }, {
          where: { phone: buyer.phone }
        });
        // 将这个优惠券的信息写到订单优惠券表
        await OrderCoupons.create({
          orderSn: orderData.orderSn,
          couponId: buyer.useCouponId,
          usedValue: buyer.useCoupon,
          couponDesc: memberCouponData.couponDesc || '',
          couponType: 'member',
          usedTime: dayjs().toDate(),
        });
      }
    }

    // 8.如果下单有使用店铺优惠券，需要将这个店铺券写到订单优惠券表
    if (storeCoupons.length > 0) {
      await OrderCoupons.create({
        orderSn: orderData.orderSn,
        couponId: storeCoupons[0].id,
        usedValue: storeCoupons[0].couponValue,
        couponDesc: storeCoupons[0].couponDesc || '',
        couponType: 'store',
        usedTime: dayjs().toDate(),
      });
    }

    // 9.判断*当前*是否有店铺活动，如果有*满送活动*，需要判断*实际支付金额是否达成*，如果达成需要给用户优惠券表发券
    const storeActivity = await Marketing.findOne({
      where: {
        marketingType: 'full_send',
        marketingCondition: { [Op.lte]: actualAmount },
        startTime: { [Op.lte]: dayjs().toDate() },
        endTime: { [Op.gte]: dayjs().toDate() },
      },
    });
    // 如有符合上述条件的活动，则给用户优惠券表发券
    if (storeActivity && buyer.phone) {
      const storeActivityData = storeActivity.toJSON();
      // 根据这个storeActivityData.id，去店铺优惠券表中查询优惠券列表
      const storeActivityCoupons = await StoreCoupon.findAll({
        where: {
          activityId: storeActivityData.id
        }
      }); 
      // 给用户优惠券表发券（实例化）
      const memberCoupons = storeActivityCoupons.flatMap(coupon => {
        const couponData = coupon.toJSON();
        const counts = couponData.couponCount || 1;
        // 根据counts生成多条记录
        return Array(counts).fill(null).map(() => ({
          phone: buyer.phone,
          couponId: uuidv4(),
          couponCondition: couponData.couponCondition,
          couponDesc: couponData.couponDesc,
          couponValue: couponData.couponValue,
          couponCount: 1,
          couponStatus: 'active',
          couponExpiredTime: couponData.couponExpiredTime,
        }));
      });
      
      if (memberCoupons.length > 0) {
        // 写入会员优惠券表
        await MemberCoupon.bulkCreate(memberCoupons);
        const member2 = await Member.findOne({
          where: { phone: buyer.phone }
        });
  
        if (!member2) {
          throw new Error(`Member2 not found for phone: ${buyer.phone}`);
        }
  
        const memberData2 = member2.toJSON();
        // 更新会员表中券字段
        await Member.update({
          coupon: new Decimal(memberData2.coupon).plus(memberCoupons.length).toNumber(),
        }, {
          where: { phone: buyer.phone }
        });
      }
    }

    res.status(200).json(orderData);
  } catch (error) {
    logger.error('Error creating order:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 通过实付金额获取符合条件的店铺优惠券
export const getStoreCoupon = async (req: Request, res: Response) => {
  const { amount } = req.query;
  const coupon = await StoreCoupon.findAll({
    where: {
      couponStatus: 'active',
      couponExpiredTime: { [Op.gte]: dayjs().toDate() },
      couponCondition: { [Op.lte]: amount }
    },
    order: [['couponCondition', 'ASC']],
  });

  res.status(200).json(coupon);
};

// 导入订单
export const importOrder = async (req: Request, res: Response) => {
  const { dataList } = req.body;
  
  try {
    dataList.forEach(async (item: any) => {
      const { extra, createdAt } = item;
      const { buyer = {}, storeSaler = {}, waitSales = {}, storeCoupons = [] } = JSON.parse(extra);
      const { counts, totalAmount, payAmount, actualAmount, payType, remark } = waitSales?.brief || {};

      // 构造订单编号
      const today = dayjs();
      const todayStr = today.format('YYYYMMDD');
      const start = today.startOf('day').toDate();
      const end = today.endOf('day').toDate();
      const where = {};
      where['createdAt'] = {
        [Op.gte]: start,
        [Op.lte]: end,
      };

      const todayOrders = await Order.count({
        where,
      });

      // 计算使用优惠券的金额
      const useStoreCouponAmount = storeCoupons.reduce((acc, coupon) => acc + coupon.couponValue, 0);
      const useUserCouponAmount = buyer?.useCoupon || 0;

      // 1.写入订单表
      const resultOrderCreate = await Order.create({
        orderSn: `${todayStr}${String(todayOrders+1).padStart(3, '0')}`,
        orderStatus: `uncheck`,
        orderItems: counts,
        originalAmount: totalAmount, // 商品吊牌总金额
        orderAmount: payAmount, // 商品折扣之后的应付金额
        orderActualAmount: actualAmount, // 商品折扣之后的实付金额
        payType,
        userPhone: buyer?.phone || '',
        usePoint: buyer?.usePoint || 0,
        useBalance: buyer?.useBalance || 0,
        useCoupon: useStoreCouponAmount + useUserCouponAmount,
        salerId: storeSaler.id,
        salerName: storeSaler.name,
        remark,
        // 导入订单的时候全部设置从 outtlet
        source: 'outlet',
        // 将当前订单的信息全部写入 extra 字段，便于导入导出
        extra: JSON.stringify({
          buyer,
          storeSaler,
          waitSales,
          storeCoupons,
        }),
        // 订单的时间需要已实际的时间为准
        createdAt,
      });

      if (!resultOrderCreate) {
        throw new Error('Failed to create order: No result returned');
      }

      const orderData = resultOrderCreate.toJSON();
      if (!orderData.orderSn) {
        throw new Error('Failed to create order: Invalid order data');
      }

      // 2.写入订单商品表
      const rate = new Decimal(actualAmount).div(payAmount); // 这个地方别做toFixed，否则会丢失精度
      const orderItems = waitSales.list.map(item => ({
        orderSn: orderData.orderSn,
        sku: item.sku,
        sn: item.sn,
        name: item.name,
        brand: item.brand,
        color: item.color,
        size: item.size,
        originalPrice: item.originalPrice,
        discount: item.discount,
        counts: item.counts,
        actualPrice: item.isGived ? 0 : new Decimal(item.salePrice).mul(rate).mul(item.counts).toDecimalPlaces(2),
      }));

      const resultOrderItemsCreate = await OrderItems.bulkCreate(orderItems);
      if (!resultOrderItemsCreate || resultOrderItemsCreate.length !== waitSales.list.length) {
        throw new Error('Failed to create order items: Invalid data');
      }

      // 3.扣减 SKU 对应的库存
      for (const item of waitSales.list) {
        const inventory = await Inventory.findOne({
          where: { sku: item.sku }
        });

        if (!inventory) {
          throw new Error(`Inventory not found for SKU: ${item.sku}`);
        }

        const inventoryData = inventory.toJSON();
        if (inventoryData.counts < item.counts) {
          // throw new Error(`Insufficient inventory for SKU: ${item.sku}`);
          logger.error(`Insufficient inventory for SKU: ${item.sku}`);
        }

        await inventory.update({
          counts: inventoryData.counts - item.counts
        });
      }

      // 4.更新用户信息（消费金额更新，积分更新，余额更新）
      if (buyer.phone) {
        const member = await Member.findOne({
          where: { phone: buyer.phone }
        });

        if (!member) {
          throw new Error(`Member not found for phone: ${buyer.phone}`);
        }

        const memberData = member.toJSON();
        const updates = {
          // 更新消费金额
          actual: new Decimal(memberData.actual).plus(actualAmount).toDecimalPlaces(2),
          // 更新积分（减去使用的积分，加上新获得的积分）
          point: new Decimal(memberData.point).minus(buyer.usePoint || 0).plus(Math.floor(actualAmount)).toNumber(),
          // 更新余额（减去使用的余额）
          balance: new Decimal(memberData.balance).minus(buyer.useBalance || 0).toDecimalPlaces(2)
        };

        await member.update(updates);

        // 5.写入用户积分流水表
        const pointRecords: Array<{
          phone: string;
          point: number;
          type: string;
          reason: string;
        }> = [];

        // 如果有实际支付金额，记录积分奖励
        if (actualAmount > 0) {
          const earnedPoints = Math.floor(actualAmount);
          pointRecords.push({
            phone: buyer.phone,
            point: earnedPoints,
            type: 'earn',
            reason: `订单 ${orderData.orderSn} 获取积分`,
          });
        }
        
        // 如果有使用积分，记录积分使用
        if (buyer.usePoint > 0) {
          pointRecords.push({
            phone: buyer.phone,
            point: -buyer.usePoint,
            type: 'use',
            reason: `订单 ${orderData.orderSn} 使用积分`,
          });
        }

        // 批量创建积分流水记录
        if (pointRecords.length > 0) {
          await MemberScore.bulkCreate(pointRecords);
        }
        
        // 6.如果有使用余额，记录余额使用
        if (buyer.useBalance > 0) {
          // 写入用户余额流水表
          const balanceRecords: Array<{
            phone: string;
            value: number;
            type: string;
            reason: string;
          }> = [];
          balanceRecords.push({
            phone: buyer.phone,
            value: -buyer.useBalance,
            type: 'use',
            reason: `订单 ${orderData.orderSn} 使用余额`,
          });
          // 批量创建余额流水记录
          await MemberBalance.bulkCreate(balanceRecords);
        }

        // 7.如果用户有使用券，记录券使用
        if (buyer.useCoupon > 0 && buyer.useCouponId) {
          // 获取优惠券信息
          const memberCoupon = await MemberCoupon.findOne({
            where: { id: buyer.useCouponId }
          });

          if (!memberCoupon) {
            throw new Error(`Member coupon not found for id: ${buyer.useCouponId}`);
          }

          const memberCouponData = memberCoupon.toJSON();

          // 更新优惠券使用状态
          await MemberCoupon.update({
            couponStatus: 'used',
          }, {
            where: { id: buyer.useCouponId }
          });
          // 用户的基本信息表中更新优惠券数量
          await Member.increment({
            couponCount: -1,
          }, {
            where: { phone: buyer.phone }
          });
          // 将这个优惠券的信息写到订单优惠券表
          await OrderCoupons.create({
            orderSn: orderData.orderSn,
            couponId: buyer.useCouponId,
            usedValue: buyer.useCoupon,
            couponDesc: memberCouponData.couponDesc || '',
            couponType: 'member',
            usedTime: dayjs().toDate(),
          });
        }
      }

      // 8.如果下单有使用店铺优惠券，需要将这个店铺券写到订单优惠券表
      if (storeCoupons.length > 0) {
        await OrderCoupons.create({
          orderSn: orderData.orderSn,
          couponId: storeCoupons[0].id,
          usedValue: storeCoupons[0].couponValue,
          couponDesc: storeCoupons[0].couponDesc || '',
          couponType: 'store',
          usedTime: dayjs().toDate(),
        });
      }

      // 9.判断*当前*是否有店铺活动，如果有*满送活动*，需要判断*实际支付金额是否达成*，如果达成需要给用户优惠券表发券
      const storeActivity = await Marketing.findOne({
        where: {
          marketingType: 'full_send',
          marketingCondition: { [Op.lte]: actualAmount },
          startTime: { [Op.lte]: dayjs().toDate() },
          endTime: { [Op.gte]: dayjs().toDate() },
        },
      });
      // 如有符合上述条件的活动，则给用户优惠券表发券
      if (storeActivity && buyer.phone) {
        const storeActivityData = storeActivity.toJSON();
        // 根据这个storeActivityData.id，去店铺优惠券表中查询优惠券列表
        const storeActivityCoupons = await StoreCoupon.findAll({
          where: {
            activityId: storeActivityData.id
          }
        }); 
        // 给用户优惠券表发券（实例化）
        const memberCoupons = storeActivityCoupons.flatMap(coupon => {
          const couponData = coupon.toJSON();
          const counts = couponData.couponCount || 1;
          // 根据counts生成多条记录
          return Array(counts).fill(null).map(() => ({
            phone: buyer.phone,
            couponId: uuidv4(),
            couponCondition: couponData.couponCondition,
            couponDesc: couponData.couponDesc,
            couponValue: couponData.couponValue,
            couponCount: 1,
            couponStatus: 'active',
            couponExpiredTime: couponData.couponExpiredTime,
          }));
        });
        
        if (memberCoupons.length > 0) {
          // 写入会员优惠券表
          await MemberCoupon.bulkCreate(memberCoupons);
          const member2 = await Member.findOne({
            where: { phone: buyer.phone }
          });
    
          if (!member2) {
            throw new Error(`Member2 not found for phone: ${buyer.phone}`);
          }
    
          const memberData2 = member2.toJSON();
          // 更新会员表中券字段
          await Member.update({
            coupon: new Decimal(memberData2.coupon).plus(memberCoupons.length).toNumber(),
          }, {
            where: { phone: buyer.phone }
          });
        }
      }

    });

    res.status(200).json({ success: true, totalCount: dataList.length });
  } catch (error) {
    logger.error('Error importing order:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
