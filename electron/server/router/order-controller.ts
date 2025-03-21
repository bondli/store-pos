import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import logger from 'electron-log';
import { Order } from '../model/order';


export const queryOrderSummary = async (req: Request, res: Response) => {

};
export const queryOrderTotal = async (req: Request, res: Response) => {

};
export const queryOrderCharts = async (req: Request, res: Response) => {

};
export const queryOrderItemList = async (req: Request, res: Response) => {

};
  
// 查询订单列表
export const queryOrderList = async (req: Request, res: Response) => {
  const { orderSn, start, end, userPhone, payType, salerId, salerName, pageSize, pageNum } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(pageNum) - 1) * limit;

  const today = new Date();
  const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  let startTime, endTime;
  if (!start && !end) {
    startTime = todayAtMidnight;
    endTime = endOfToday;
  } else {
    startTime = new Date(start as string);
    endTime = new Date(end as string);
  }

  try {
    const { count, rows } = await Order.findAndCountAll({
      where: {
        orderSn,
        userPhone,
        payType,
        salerId,
        salerName,
        createdAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime,
        },
      },
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
  const { avatar, name, password, email } = req.body;
  try {
    const result = await Order.create({ avatar, name, password, email });
    res.status(200).json(result.toJSON());
  } catch (error) {
    logger.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新订单
export const modifyOrder = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { avatar, name, password, email } = req.body;
  try {
    const result = await Order.findByPk(Number(id));
    if (result) {
      await result.update({ avatar, name, password, email });
      res.json(result.toJSON());
    } else {
      res.json({ error: 'Order not found' });
    }
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