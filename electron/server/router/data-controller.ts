import { Request, Response } from 'express';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import logger from 'electron-log';

import { sequelize } from '../model/index';
import { Order } from '../model/order';
import { Inventory } from '../model/inventory';
import { Member } from '../model/member';
import { OrderItems } from '../model/orderItems'; 

// 查询系统核心的统计数据
export const getCoreData = async (req: Request, res: Response) => {
  const dateRange = req.body.dateRange as string[];
  const showStatus = req.body.showStatus as string;

  let startTime, endTime;

  try {
    // 处理日期范围
    if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
      startTime = dayjs(dateRange[0]).startOf('day').toDate();
      endTime = dayjs(dateRange[1]).endOf('day').toDate();
    } else {
      // 默认查询最近30天
      startTime = dayjs().subtract(30, 'days').startOf('day').toDate();
      endTime = dayjs().endOf('day').toDate();
    }

    // 根据showStatus查询订单
    const orderWhere = {
      createdAt: {
        [Op.between]: [startTime, endTime]
      }
    };
    if (showStatus === 'hidden') {
      orderWhere['showStatus'] = 'normal';
    }

    // 并行查询所有统计数据
    const [orderStats, inventoryCount, saledItemCount, memberCount] = await Promise.all([
      // 查询订单统计
      Order.findAll({
        where: orderWhere,
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
          [sequelize.fn('SUM', sequelize.col('orderActualAmount')), 'totalAmount']
        ],
        raw: true
      }),
      // 查询库存总量
      Inventory.sum('counts'),
      // 销售的商品数量
      OrderItems.sum('counts'),
      // 查询会员总量
      Member.count()
    ]);

    // 处理订单统计结果
    const orderCount = (orderStats[0] as any)?.orderCount || 0;
    const totalAmount = (orderStats[0] as any)?.totalAmount || 0;

    res.json({
      orderCount: Number(orderCount),
      orderAmount: Number(totalAmount),
      inventoryCount: Number(inventoryCount || 0),
      memberCount: Number(memberCount || 0),
      saledItemCount: Number(saledItemCount || 0)
    });
  } catch (error) {
    logger.error('Error getting core data:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询订单图表数据
export const getOrderCharts = async (req: Request, res: Response) => {
  const showStatus = req.query.showStatus as string;

  const startTime = dayjs().subtract(365, 'days').startOf('day').toDate();
  const endTime = dayjs().endOf('day').toDate();

  // 根据showStatus查询订单
  const orderWhere = {
    createdAt: {
      [Op.between]: [startTime, endTime]
    }
  };
  if (showStatus === 'hidden') {
    orderWhere['showStatus'] = 'normal';
  }

  try {
    // 查询订单图表数据
    const orderCharts = await Order.findAll({
      where: orderWhere,
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y/%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('orderActualAmount')), 'amounts'],
      ],
      group: ['month'],
      order: [['month', 'ASC']],
    });

    const data = orderCharts.map(item => {
      const obj = item.toJSON();
      obj.amounts = Number(obj.amounts);
      return obj;
    });

    res.json(data);
  } catch (error) {
    logger.error('Error getting order charts:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询最近销售数据
export const getRecentSaleList = async (req: Request, res: Response) => {
  const showStatus = req.query.showStatus as string;

  const startTime = dayjs().subtract(30, 'days').startOf('day').toDate();
  const endTime = dayjs().endOf('day').toDate();

  // 根据showStatus查询订单
  const orderWhere = {
    createdAt: {
      [Op.between]: [startTime, endTime]
    }
  };
  if (showStatus === 'hidden') {
    orderWhere['showStatus'] = 'normal';
  }

  try {
    // 查询最近销售数据
    const recentSaleList = await Order.findAll({
      where: orderWhere,
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json(recentSaleList);
  } catch (error) {
    logger.error('Error getting recent sale list:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};