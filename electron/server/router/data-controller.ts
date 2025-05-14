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

    const currentUserId = req.headers['x-user-id'] as string;

    // 并行查询所有统计数据
    const [orderStats, salerOrderAmount, inventoryCount, saledItemCount, memberCount] = await Promise.all([
      // 查询订单统计
      Order.findAll({
        where: orderWhere,
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
          [sequelize.fn('SUM', sequelize.col('orderActualAmount')), 'totalAmount']
        ],
        raw: true
      }),
      // 查询导购员订单数据
      Order.findAll({
        where: {
          ...orderWhere,
          salerId: {
            [Op.eq]: Number(currentUserId),
          },
        },
        attributes: [
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
      saledItemCount: Number(saledItemCount || 0),
      salerOrderAmount: Number((salerOrderAmount[0] as any)?.totalAmount || 0),
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

    const outputData = orderCharts.map(item => {
      const obj = item.toJSON();
      obj.amounts = Number(obj.amounts);
      return obj;
    });

    // 查询符合条件的订单
    const order = await Order.findAll({
      where: orderWhere,
    });

    // 查询符合条件的订单商品
    const orderList = order.map(item => item.toJSON());
    const orderItemsResult = await OrderItems.findAll({
      where: {
        orderSn: { [Op.in]: orderList.map(item => item.orderSn) }
      },
    });

    // 查询符合条件的订单商品的进货价
    const orderItems = orderItemsResult.map(item => item.toJSON());
    // 根据orderItems中的sku去Inventory中查询商品的进货价
    const inventoryList = await Inventory.findAll({
      where: { sku: { [Op.in]: orderItems.map(item => item.sku) } }
    });
    
    // 将商品进货价转换为map
    const inventoryMap = new Map(
      inventoryList.map(item => {
        const data = item.toJSON();
        return [data.sku, data];
      })
    );

    // 订单按月统计这些订单中商品的总进货价
    // 1. 构建订单号到月份的映射
    const orderSnToMonth = new Map<string, string>();
    order.forEach(item => {
      const month = dayjs(item.get('createdAt') as string).format('YYYY/MM');
      orderSnToMonth.set(item.get('orderSn') as string, month);
    });

    // 2. 统计每月进货价
    const monthCostMap = new Map<string, number>();
    orderItems.forEach(item => {
      const month = orderSnToMonth.get(item.orderSn);
      const inventory = inventoryMap.get(item.sku);
      const costPrice = inventory ? Number(inventory.costPrice) : 0;
      const totalCost = costPrice * item.counts;
      if (month) {
        monthCostMap.set(month, Number(((monthCostMap.get(month) || 0) + totalCost).toFixed(2)));
      }
    });

    // 3. 合并到outputData
    outputData.forEach(obj => {
      obj.cost = Number(monthCostMap.get(obj.month) || 0);
      obj.rate = obj.amounts > 0 ? Number(((obj.amounts - obj.cost) / obj.amounts * 100).toFixed(2)) : 0;
    });

    res.json(outputData);
  } catch (error) {
    logger.error('Error getting order charts:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};