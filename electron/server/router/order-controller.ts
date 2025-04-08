import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import logger from 'electron-log';
import { Order } from '../model/order';

import { OrderItems } from '../model/orderItems';
import { Member } from '../model/member';
import { MemberScore } from '../model/memberScore';
import { OrderCoupons } from '../model/orderCoupons';

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

export const changeOrderItem = async (req: Request, res: Response) => {

};
export const refundOrderItem = async (req: Request, res: Response) => {

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

    // 更新订单基本信息（支付方式、实收金额、导购员、会员、备注）
    await result.update({ payType, orderActualAmount, salerId, userPhone, remark });
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