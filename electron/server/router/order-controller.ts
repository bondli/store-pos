import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import logger from 'electron-log';
import { Order } from '../model/order';

import { OrderItems } from '../model/orderItems';
import { Member } from '../model/member';
import { Inventory } from '../model/inventory';
import { MemberScore } from '../model/memberScore';
import { MemberBalance } from '../model/memberBalance';

// 查询订单总览
export const queryOrderSummary = async (req: Request, res: Response) => {

};

export const queryOrderTotal = async (req: Request, res: Response) => {

};

export const queryOrderCharts = async (req: Request, res: Response) => {

};

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
    logger.error('Error getting Order items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
// 查询订单列表
export const queryOrderList = async (req: Request, res: Response) => {
  const { orderSn, start, end, userPhone, payType, salerId, pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;

  const today = dayjs();
  const todayAtMidnight = today.startOf('day').toDate();
  const endOfToday = today.endOf('day').toDate();
  let startTime, endTime;
  if (!start && !end) {
    startTime = todayAtMidnight;
    endTime = endOfToday;
  } else {
    startTime = new Date(start as string);
    endTime = new Date(end as string);
  }

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
  where['createdAt'] = {
    [Op.gte]: startTime,
    [Op.lte]: endTime,
  };

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
    logger.error('Error getting Orders:', error);
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
    logger.error('Error getting Order by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建订单
export const submitOrder = async (req: Request, res: Response) => {
  const { buyer, storeSaler, waitSales } = req.body;
  const { counts, totalAmount, payAmount, actualAmount, payType } = waitSales?.brief || {};
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

    // 写入订单表
    const resultOrderCreate = await Order.create({
      orderSn: `${todayStr}${String(todayOrders+1).padStart(3, '0')}`,
      orderStatus: `uncheck`,
      orderItems: counts,
      orderAmount: payAmount,
      orderActualAmount: actualAmount,
      payType,
      userPhone: buyer.phone,
      usePoint: buyer.point,
      useBalance: buyer.balance,
      useCoupon: 0, // 暂未实现
      salerId: storeSaler.id,
      salerName: storeSaler.name,
    });

    if (!resultOrderCreate) {
      throw new Error('Failed to create order: No result returned');
    }

    const orderData = resultOrderCreate.toJSON();
    if (!orderData.orderSn) {
      throw new Error('Failed to create order: Invalid order data');
    }

    // 写入订单商品表
    const rate = Number((actualAmount / payAmount).toFixed(2));
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
      actualPrice: item.isGived ? 0 : Number((item.salePrice * rate).toFixed(2)) * item.counts,
    }));

    const resultOrderItemsCreate = await OrderItems.bulkCreate(orderItems);
    if (!resultOrderItemsCreate || resultOrderItemsCreate.length !== waitSales.list.length) {
      throw new Error('Failed to create order items: Invalid data');
    }

    // 扣减 SKU 对应的库存
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

    // 更新用户信息（消费金额更新，积分更新，余额更新）
    const member = await Member.findOne({
      where: { phone: buyer.phone }
    });

    if (!member) {
      throw new Error(`Member not found for phone: ${buyer.phone}`);
    }

    const memberData = member.toJSON();
    const updates = {
      // 更新消费金额
      actual: Number((memberData.actual + actualAmount).toFixed(2)),
      // 更新积分（减去使用的积分，加上新获得的积分）
      point: memberData.point - (buyer.usePoint || 0) + Math.floor(actualAmount),
      // 更新余额（减去使用的余额）
      balance: Number((memberData.balance - (buyer.useBalance || 0)).toFixed(2))
    };

    await member.update(updates);

    // 写入用户积分流水表
    const pointRecords: Array<{
      phone: string;
      point: number;
      type: string;
      reason: string;
    }> = [];
    
    // 如果有使用积分，记录积分使用
    if (buyer.usePoint > 0) {
      pointRecords.push({
        phone: buyer.phone,
        point: -buyer.usePoint,
        type: 'use',
        reason: `订单${orderData.orderSn} 使用积分`
      });
    }

    // 如果有实际支付金额，记录积分奖励
    if (actualAmount > 0) {
      const earnedPoints = Math.floor(actualAmount);
      pointRecords.push({
        phone: buyer.phone,
        point: earnedPoints,
        type: 'earn',
        reason: `订单${orderData.orderSn}支付获取积分`
      });
    }

    // 批量创建积分流水记录
    if (pointRecords.length > 0) {
      await MemberScore.bulkCreate(pointRecords);
    }

    // 写入用户余额流水表
    const balanceRecords: Array<{
      phone: string;
      value: number;
      type: string;
      reason: string;
    }> = [];
    
    // 如果有使用余额，记录余额使用
    if (buyer.useBalance > 0) {
      balanceRecords.push({
        phone: buyer.phone,
        value: -buyer.useBalance,
        type: 'use',
        reason: `订单${orderData.orderSn} 使用余额`
      });
    }

    // 批量创建余额流水记录
    if (balanceRecords.length > 0) {
      await MemberBalance.bulkCreate(balanceRecords);
    }

    res.status(200).json(orderData);
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新订单
export const modifyOrder = async (req: Request, res: Response) => {
  const { orderSn } = req.query;
  const { payType, orderActualAmount, salerId, userPhone } = req.body;
  try {
    const result = await Order.findOne({
      where: { orderSn }
    });
    
    if (!result) {
      return res.json({ error: 'Order not found' });
    }

    const orderData = result.toJSON();
    const originalUserPhone = orderData.userPhone;

    // If userPhone is being updated from empty to a new value
    if (!originalUserPhone && userPhone) {
      // Check if member exists
      let member = await Member.findOne({
        where: { phone: userPhone }
      });

      if (!member) {
        // Create new member if doesn't exist
        member = await Member.create({
          phone: userPhone,
          actual: orderActualAmount,
          point: Math.floor(orderActualAmount), // Convert amount to points
        });
      } else {
        // Update existing member's points and actual amount
        const memberData = member.toJSON();
        await member.update({
          actual: Number((memberData.actual + orderActualAmount).toFixed(2)),
          point: memberData.point + Math.floor(orderActualAmount),
        });
      }

      // Add point transaction record
      await MemberScore.create({
        phone: userPhone,
        point: Math.floor(orderActualAmount),
        type: 'earn',
        reason: `订单${orderSn}支付获取积分`
      });
    }

    // Update order with new information
    await result.update({ payType, orderActualAmount, salerId, userPhone });
    res.json(result.toJSON());
  } catch (error) {
    logger.error('Error modify Order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const changeOrderItem = async (req: Request, res: Response) => {

};
export const refundOrderItem = async (req: Request, res: Response) => {

};
export const queryOrderBySku = async (req: Request, res: Response) => {

};
export const updateOrderMember = async (req: Request, res: Response) => {

};
export const updateOrderSaler = async (req: Request, res: Response) => {

};
export const updateOrderActual = async (req: Request, res: Response) => {

};

// 确认订单
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
    logger.error('Error checking order bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
