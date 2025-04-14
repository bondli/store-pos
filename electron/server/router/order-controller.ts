import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import logger from 'electron-log';
import ExcelJS from 'exceljs';
import { Order } from '../model/order';

import { OrderItems } from '../model/orderItems';
import { Member } from '../model/member';
import { MemberScore } from '../model/memberScore';
import { OrderCoupons } from '../model/orderCoupons';
import { Inventory } from '../model/inventory';
import { User } from '../model/user';
import Decimal from 'decimal.js';

// 定义OrderItems的接口
interface OrderItemAttributes {
  orderSn: string;
  [key: string]: any;
}

// 查询订单中的商品列表
export const queryOrderItemList = async (req: Request, res: Response) => {
  const { orderSn } = req.query;

  const where = {};

  // 处理orderSn查询
  if (orderSn) {
    where['orderSn'] = {
      [Op.eq]: orderSn,
    };
  }

  try {
    const { count, rows } = await OrderItems.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100, // 每个订单中的商品数量上限是100个（约定）
      offset: 0,
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting Order items:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
// 查询订单列表
export const queryOrderList = async (req: Request, res: Response) => {
  const { orderSn, start, end, userPhone, payType, salerId, pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;

  const where = {};

  // 处理orderSn查询
  if (orderSn) {
    where['orderSn'] = {
      [Op.eq]: orderSn,
    };
  }
  if (userPhone) {
    where['userPhone'] = {
      [Op.eq]: userPhone,
    };
  }
  if (payType) {
    where['payType'] = {
      [Op.eq]: payType,
    };
  }
  if (salerId) {
    where['salerId'] = {
      [Op.eq]: salerId,
    };
  }

  if (start && end) {
    const startTime = dayjs(start as string).startOf('day').toDate();
    const endTime = dayjs(end as string).endOf('day').toDate();

    where['createdAt'] = {
      [Op.gte]: startTime,
      [Op.lte]: endTime,
    };
  }

  try {
    const { count, rows } = await Order.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting Orders:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询订单详情
export const queryOrderDetail = async (req: Request, res: Response) => {
  const { orderSn } = req.query;
  try {
    const result = await Order.findOne({
      where: { orderSn }
    });
    if (result) {
      res.json(result.toJSON());
    } else {
      res.json({ error: 'Order not found' });
    }
  } catch (error) {
    logger.error('Error getting Order by ID:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 换货
export const changeOrderItem = async (req: Request, res: Response) => {
  const { orderSn, returnItems, exchangeItems, exchangeAmount, amountType } = req.body;
  if (returnItems.length === 0) {
    return res.json({ error: '请选择退货商品' });
  }
  if (exchangeItems.length === 0) {
    return res.json({ error: '请选择换货商品' });
  }
  try {
    // 1.更新订单表，根据价差更新订单实收金额，根据选择的商品数量差更新orderItems字段
    const order = await Order.findOne({
      where: { orderSn },
    });
    if (!order) {
      return res.json({ error: 'Order not found' });
    }
    const orderData = order.toJSON();
    const finnalChangeAmount = (amountType === 'none') ? 0 : (amountType === 'add' ? exchangeAmount : exchangeAmount * -1);
    const finalAmount = orderData.orderActualAmount + finnalChangeAmount;
    await order.update({
      orderActualAmount: finalAmount, // 换货后，订单实收金额增加
      orderItems: orderData.orderItems - returnItems.reduce((sum, item) => sum + (item.counts || 1), 0) + exchangeItems.reduce((sum, item) => sum + (item.counts || 1), 0), // 换货后，订单中的商品数量减少
    });

    // 2.更新订单商品表，将退回的商品移除，将换货的商品添加
    await OrderItems.destroy({
      where: {
        orderSn,
        id: {
          [Op.in]: returnItems.map(item => item.id),
        },
      },
    });
    const rate = new Decimal(finalAmount).div(orderData.orderAmount); // 这个地方别做toFixed，否则会丢失精度
    const defaultDiscount = 0.6;
    await OrderItems.bulkCreate(
      exchangeItems.map(item => ({
        orderSn: orderData.orderSn,
        sku: item.sku,
        sn: item.sn,
        name: item.name,
        brand: item.brand,
        color: item.color,
        size: item.size,
        originalPrice: item.originalPrice,
        discount: defaultDiscount, // item.discount,先是默认值后续开放可以设置
        counts: 1, // 先写死1个，后续开放设置
        // todo: 这个地方需要根据传入的折扣计算
        actualPrice: new Decimal(item.originalPrice*defaultDiscount).mul(rate).toDecimalPlaces(2),
      }))
    );
    // 3.扣减库存，退回的商品增加库存，换货的商品减少库存
    for (const item of returnItems) {
      await Inventory.update({
        counts: Sequelize.literal(`counts + ${item.counts || 1}`),
      }, {
        where: { sku: item.sku },
      });
    }
    for (const item of exchangeItems) {
      await Inventory.update({
        counts: Sequelize.literal(`counts - ${item.counts || 1}`),
      }, {
        where: { sku: item.sku },
      });
    }
    // 4.更新会员表，因实付金额的变动，需要更新会员表中的实付金额和积分
    if (orderData.userPhone) {
      const member = await Member.findOne({
        where: { phone: orderData.userPhone },
      });
      if (member) {
        const memberData = member.toJSON();
        await member.update({
          actual: memberData.actual + finnalChangeAmount,
          point: memberData.point + Math.floor(finnalChangeAmount),
        });
        // 添加积分记录
        await MemberScore.create({
          phone: orderData.userPhone,
          point: Math.floor(finnalChangeAmount),
          type: 'exchange',
          reason: `订单${orderSn}换货积分变动`,
        });
      }
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Error changing order item:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 退货 
export const refundOrderItem = async (req: Request, res: Response) => {
  const { orderSn, refundAmount, refundItems } = req.body;
  if (refundItems.length === 0) {
    return res.json({ error: '请选择退货商品' });
  }
  try {
    // 1.更新订单表
    const order = await Order.findOne({
      where: { orderSn },
    });
    if (!order) {
      return res.json({ error: 'Order not found' });
    }
    const orderData = order.toJSON();
    await order.update({
      orderStatus: 'refund', // 退货后，订单状态为退货
      orderActualAmount: orderData.orderActualAmount - refundAmount, // 退货后，订单实收金额减少
      orderItems: orderData.orderItems - refundItems.reduce((sum, item) => sum + (item.counts || 1), 0), // 退货后，订单中的商品数量减少
    });

    // 2.更新订单商品表
    await OrderItems.update({
      status: 'refund', // 通过状态可以回溯之前用户购买的是什么商品
    }, {
      where: {
        orderSn,
        id: {
          [Op.in]: refundItems.map(item => item.id),
        },
      },
    });

    // 3.回滚库存 - 对每个退货商品分别处理
    for (const item of refundItems) {
      await Inventory.update({
        counts: Sequelize.literal(`counts + ${item.counts || 1}`),
      }, {
        where: {
          sku: item.sku,
        },
      });
    }
    
    // 4.更新会员表
    if (orderData.userPhone) {
      const member = await Member.findOne({
        where: { phone: orderData.userPhone },
      });
      if (member) {
        const memberData = member.toJSON();
        await member.update({
          point: memberData.point + Math.floor(refundAmount),
          actual: memberData.actual - refundAmount,
        });
        // 添加积分记录（回滚积分）
        await MemberScore.create({
          phone: orderData.userPhone,
          point: Math.floor(refundAmount),
          type: 'refund',
          reason: `订单${orderSn}退货回滚积分`,
        });
      }
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Error refunding order item:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据SKU查询订单
export const queryOrderBySku = async (req: Request, res: Response) => {
  const { sku } = req.query;
  try {
    // 先从订单商品表中找到订单
    const result = await OrderItems.findAll({
      where: { sku },
      limit: 100, 
      offset: 0,
      order: [['createdAt', 'DESC']],
      attributes: ['orderSn'],
    }) as unknown as OrderItemAttributes[];
    
    // 再根据订单ID查询订单详情
    const orderList = await Order.findAndCountAll({
      where: { 
        orderSn: result.map(item => item.orderSn)
      },
      order: [['createdAt', 'DESC']],
      limit: 100,
      offset: 0,
    });
    res.json({
      count: orderList.count || 0,
      data: orderList.rows || [],
    });
  } catch (error) {
    logger.error('Error getting Order by SKU:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 确认订单 对账
export const checkOrderBill = async (req: Request, res: Response) => {
  const { orderSn } = req.query;
  try {
    const result = await Order.findOne({
      where: { orderSn }
    });
    if (!result) {
      return res.json({ error: 'Order not found' });
    }
    await result.update({ orderStatus: 'checked' });
    res.json(result.toJSON());
  } catch (error) {
    logger.error('Error checking order bill:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新订单
export const modifyOrder = async (req: Request, res: Response) => {
  const { orderSn } = req.query;
  const { payType, orderActualAmount, salerId, userPhone, remark } = req.body;
  try {
    const result = await Order.findOne({
      where: { orderSn }
    });
    
    if (!result) {
      return res.json({ error: 'Order not found' });
    }

    const orderData = result.toJSON();
    const originalUserPhone = orderData.userPhone;

    // 之前没有绑定会员，现在需要绑定会员
    if (!originalUserPhone && userPhone) {
      // Check if member exists
      let member = await Member.findOne({
        where: { phone: userPhone }
      });

      if (!member) {
        // 如果会员不存在，则创建会员，加上积分和消费金额
        member = await Member.create({
          phone: userPhone,
          actual: orderActualAmount,
          point: Math.floor(orderActualAmount), // Convert amount to points
        });
      } else {
        // 如果会员存在，则更新积分和消费金额
        const memberData = member.toJSON();
        await member.update({
          actual: Number((memberData.actual + orderActualAmount).toFixed(2)),
          point: memberData.point + Math.floor(orderActualAmount),
        });
      }

      // 添加积分记录
      await MemberScore.create({
        phone: userPhone,
        point: Math.floor(orderActualAmount),
        type: 'earn',
        reason: `订单${orderSn}支付获取积分`
      });
    }

    // 更新订单基本信息（支付方式、实收金额、导购员[id, name]、会员、备注）
    let salerName = null;
    if (salerId) {
      const saler = await User.findOne({
        where: { id: salerId },
      });
      if (saler) {
        const salerData = saler.toJSON();
        salerName = salerData.name;
      }
    }
    await result.update({ payType, orderActualAmount, salerId, salerName, userPhone, remark });
    res.json(result.toJSON());
  } catch (error) {
    logger.error('Error modify Order:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询订单中的优惠券列表
export const queryOrderCouponList = async (req: Request, res: Response) => {
  const { orderSn } = req.query;

  const where = {};

  // 处理orderSn查询
  if (orderSn) {
    where['orderSn'] = {
      [Op.eq]: orderSn,
    };
  }

  try {
    const { count, rows } = await OrderCoupons.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100, // 每个订单中的优惠券数量上限是100个（约定）
      offset: 0,
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting Order coupons:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 导出订单
export const exportOrder = async (req: Request, res: Response) => {
  const { orderSnList } = req.body;
  try {
    const result = await Order.findAll({
      where: { orderSn: { [Op.in]: orderSnList } },
    });
    if (!result) {
      return res.json({ error: 'Order not found' });
    }
    // 将结果写入excel文件
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');
    worksheet.addRow(['orderSn', 'orderActualAmount', 'orderItems', 'payType', 'userPhone', 'salerName', 'createdAt', 'extra']);
    const orderData = result.map(item => item.toJSON());
    orderData.forEach(item => {
      worksheet.addRow([
        item.orderSn, 
        item.orderActualAmount, 
        item.orderItems, 
        item.payType, 
        item.userPhone, 
        item.salerName, 
        dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        item.extra
      ]);
    });
    // 将文件写入响应
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=orders-${dayjs().format('YYYY-MM-DD')}.xlsx`);
    workbook.xlsx.write(res);
  } catch (error) {
    logger.error('Error exporting order:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
