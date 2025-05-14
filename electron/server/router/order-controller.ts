import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import logger from 'electron-log';
import ExcelJS from 'exceljs';

import { DEFAULT_DISCOUNT } from './constant';

import { Order } from '../model/order';

import { OrderItems } from '../model/orderItems';
import { Member } from '../model/member';
import { MemberScore } from '../model/memberScore';
import { OrderCoupons } from '../model/orderCoupons';
import { Inventory } from '../model/inventory';
import { User } from '../model/user';
import Decimal from 'decimal.js';
import { InventoryRecord } from '../model/inventoryRecord';

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
  const { orderSn, start, end, userPhone, payType, salerId, pageSize, current, showStatus } = req.query;
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
  // 传入的值是hidden，则查询的结果会排除“隐藏的订单”，只展示“正常”的订单
  if (showStatus) {
    where['showStatus'] = {
      [Op.eq]: 'normal',
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

// 查询订单统计信息
export const queryOrderSummary = async (req: Request, res: Response) => {
  const { orderSn, start, end, showStatus, userPhone, payType, salerId } = req.query;

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
  // 传入的值是hidden，则查询的结果会排除“隐藏的订单”，只展示“正常”的订单
  if (showStatus) {
    where['showStatus'] = {
      [Op.eq]: 'normal',
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
    const rows = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    const orderCount = rows.length;
    if (orderCount === 0) {
      return res.json({
        orderCount: 0,
        orderActualAmount: 0,
        itemCount: 0,
        payChannelStats: {
          alipay: 0,
          weixin: 0,
          cash: 0,
          card: 0,
          other: 0,
        },
      });
    }

    const orderActualAmount = rows.reduce((acc, curr) => acc + (curr.get('orderActualAmount') as number || 0), 0);
    const itemCount = rows.reduce((acc, curr) => acc + (curr.get('orderItems') as number || 0), 0);
    const payTypes = ['alipay', 'weixin', 'cash', 'card', 'other'];
    const payChannelStats = payTypes.reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});

    rows.forEach(curr => {
      const payType = curr.get('payType') as string || 'other';
      if (payTypes.includes(payType)) {
        payChannelStats[payType] += curr.get('orderActualAmount') || 0;
      }
    });

    res.json({
      orderCount,
      orderActualAmount,
      itemCount,
      payChannelStats,
    });
  } catch (error) {
    logger.error('Error getting Order summary:');
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
        discount: DEFAULT_DISCOUNT, // item.discount,先是默认值后续开放可以设置
        counts: item.counts,
        // todo: 这个地方需要根据传入的折扣计算
        actualPrice: new Decimal(item.originalPrice*DEFAULT_DISCOUNT).mul(rate).toDecimalPlaces(2),
      }))
    );
    // 3.扣减库存，退回的商品增加库存，换货的商品减少库存
    for (const item of returnItems) {
      // 先获取当前库存
      const inventory = await Inventory.findOne({
        where: { sku: item.sku }
      });
      if (inventory) {
        const inventoryData = inventory.toJSON();
        await inventory.update({
          counts: inventoryData.counts + item.counts,
          saleCounts: inventoryData.saleCounts - item.counts
        });
        await InventoryRecord.create({
          sku: item.sku,
          type: 'exchangeIn',
          info: `订单[${orderSn}]换货退回`,
          count: item.counts || 1,
        });
      }
    }
    for (const item of exchangeItems) {
      // 先获取当前库存
      const inventory = await Inventory.findOne({
        where: { sku: item.sku }
      });
      if (inventory) {
        const inventoryData = inventory.toJSON();
        await inventory.update({
          counts: inventoryData.counts - item.counts,
          saleCounts: inventoryData.saleCounts + item.counts
        });
        await InventoryRecord.create({
          sku: item.sku,
          type: 'exchangeOut',
          info: `订单[${orderSn}]换货出库`,
          count: item.counts || 1,
        });
      }
    }
    // 4.更新会员表，因实付金额的变动，需要更新会员表中的实付金额和积分
    if (orderData.userPhone && finnalChangeAmount !== 0) {
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
    // 使用Decimal处理金额相关的计算，避免精度问题
    const decOrderActualAmount = new Decimal(orderData.orderActualAmount).minus(refundAmount);
    const decOriginalAmount = new Decimal(orderData.originalAmount).minus(
      refundItems.reduce((sum, item) => new Decimal(sum).plus(new Decimal(item.originalPrice || 0).mul(item.counts || 1)), new Decimal(0))
    );
    const decOrderAmount = new Decimal(orderData.orderAmount).minus(
      refundItems.reduce((sum, item) => new Decimal(sum).plus(new Decimal(item.originalPrice || 0).mul(DEFAULT_DISCOUNT).mul(item.counts || 1)), new Decimal(0))
    );
    await order.update({
      orderStatus: 'refund', // 退货后，订单状态为退货
      orderActualAmount: decOrderActualAmount.toNumber(), // 退货后，订单实收金额减少
      originalAmount: decOriginalAmount.toNumber(), // 退货后，订单中吊牌总价也需要减少
      orderAmount: decOrderAmount.toNumber(), // 退货后，订单中应付金额也需要减少
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
        saleCounts: Sequelize.literal(`saleCounts - ${item.counts || 1}`),
      }, {
        where: {
          sku: item.sku,
        },
      });
      await InventoryRecord.create({
        sku: item.sku,
        type: 'return',
        info: `订单[${orderSn}]退货回库`,
        count: item.counts || 1,
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

    // 订单实付金额有变化的话，需要更新会员表中的实付金额和积分
    if (originalUserPhone && orderActualAmount !== orderData.orderActualAmount) {
      const member = await Member.findOne({
        where: { phone: orderData.userPhone },
      });
      if (member) {
        const memberData = member.toJSON();
        await member.update({
          actual: memberData.actual + (orderActualAmount - orderData.orderActualAmount),
          point: memberData.point + Math.floor(orderActualAmount - orderData.orderActualAmount),
        });
        // 添加积分记录
        await MemberScore.create({
          phone: orderData.userPhone,
          point: Math.floor(orderActualAmount - orderData.orderActualAmount),
          type: 'earn',
          reason: `订单${orderSn}实付金额调整,积分变动`,
        });
      }
    }

    // 更新订单基本信息（支付方式、实收金额、导购员[id, name]、会员、备注）
    let salerName = '';
    if (salerId) {
      const saler = await User.findOne({
        where: { id: salerId },
      });
      if (saler) {
        const salerData = saler.toJSON();
        salerName = salerData.name;
      } else {
        logger.error('Error getting saler:');
        console.log(saler);
      }
    }
    const updateData = { payType, salerId, salerName, userPhone, remark, orderActualAmount: orderData.orderActualAmount };
    // 订单没有完成对账才能修改实付金额，否则不能修改，防止导购员修改实付金额
    if (orderData.orderStatus !== 'checked') {
      updateData.orderActualAmount = orderActualAmount;
    }
    await result.update(updateData);
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

// 查询订单下的商品列表
export const queryOrderItemListByDate = async (req: Request, res: Response) => {
  const { start, end, pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;

  const where = {};

  if (start && end) {
    const startTime = dayjs(start as string).startOf('day').toDate();
    const endTime = dayjs(end as string).endOf('day').toDate();

    where['createdAt'] = {
      [Op.gte]: startTime,
      [Op.lte]: endTime,
    };
  }

  try {
    const { count, rows } = await OrderItems.findAndCountAll({
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
    logger.error('Error getting Order items by date:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 更新订单的打印状态
export const updatePrintStatus = async (req: Request, res: Response) => {
  const { orderSn, printStatus } = req.body;
  try {
    const result = await Order.findOne({
      where: { orderSn }
    });
    if (!result) {
      return res.json({ error: 'Order not found' });
    }
    await result.update({ printStatus });
    res.json(result.toJSON());
  } catch (error) {
    logger.error('Error updating print status:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 切换订单的展示状态
export const toggleShow = async (req: Request, res: Response) => {
  const { orderSn, showStatus } = req.body;
  try {
    const result = await Order.findOne({
      where: { orderSn }
    });
    if (!result) {
      return res.json({ error: 'Order not found' });
    }
    await result.update({ showStatus });
    res.json(result.toJSON());
  } catch (error) {
    logger.error('Error toggling show status:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 查询订单毛利率
export const queryOrderRate = async (req: Request, res: Response) => {
  const { orderSn, orderActualAmount } = req.query;
  try {
    const result = await OrderItems.findAll({
      where: { orderSn }
    });
    if (!result) {
      return res.json({ error: 'Order not found' });
    }
    // 毛利率的计算是：先从OrderItems中查询商品，然后去Inventory中查询商品的进货价，然后计算毛利率
    const orderItems = result.map(item => item.toJSON());
    // 根据orderItems中的sku去Inventory中查询商品的进货价
    const inventoryList = await Inventory.findAll({
      where: { sku: { [Op.in]: orderItems.map(item => item.sku) } }
    });
    
    // Create a map of inventory items with proper type handling
    const inventoryMap = new Map(
      inventoryList.map(item => {
        const data = item.toJSON();
        return [data.sku, data];
      })
    );
    
    // 计算总的进货价
    const totalCost = orderItems.reduce((acc, item) => {
      const inventoryItem = inventoryMap.get(item.sku);
      return acc + (inventoryItem?.costPrice || 0) * item.counts;
    }, 0);
  
    // Convert orderActualAmount from query string to number and provide default
    const actualAmount = orderActualAmount ? parseFloat(orderActualAmount as string) : 0;
    
    // Calculate rate only if actualAmount is not zero to avoid division by zero
    const rate = actualAmount > 0 ? ((actualAmount - totalCost) / actualAmount * 100) : 0;
    
    res.json({
      rate: rate.toFixed(2),
    });
  } catch (error) {
    logger.error('Error querying order rate:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}