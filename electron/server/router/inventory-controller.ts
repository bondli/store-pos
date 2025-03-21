import { Request, Response } from 'express';
import logger from 'electron-log';
import { Inventory } from '../model/inventory';

// 查询所有库存的总量
export const queryInventoryTotal = async (req: Request, res: Response) => {
  try {
    const result = await Inventory.sum('counts');
    res.json({
      total: result || 0,
    });
  } catch (error) {
    logger.error('Error querying inventory total:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 按款号展示所有的库存
export const queryInventoryList = async (req: Request, res: Response) => {
  const { sn, pageSize, pageNum } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(pageNum) - 1) * limit;
  try {
    const { count, rows } = await Inventory.findAndCountAll({
      where: { sn },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      group: ['sn'],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting Inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据款号查询所有的 SKU 列表
export const queryInventoryByStyle = async (req: Request, res: Response) => {
  const { sn } = req.query;
  try {
    const { count, rows } = await Inventory.findAndCountAll({
      where: { sn },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting Inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新一个 SKU 的信息
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { sku, sn, name, color, size, brand, costPrice, originalPrice, counts } = req.body;
    const result = await Inventory.findByPk(Number(id));
    if (result) {
      await result.update({ sku, sn, name, color, size, brand, costPrice, originalPrice, counts });
      res.json(result.toJSON());
    } else {
      res.json({ error: 'Inventory not found' });
    }
  } catch (error) {
    logger.error('Error updating Inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据 SKU 查询库存数量
export const queryInventoryDetailBySku = async (req: Request, res: Response) => {
  const { sku } = req.query;
  try {
    const result = await Inventory.findOne({
      where: { sku },
    });
    if (result) {
      res.json(result.toJSON());
    } else {
      res.json({ error: 'Inventory not found' });
    }
  } catch (error) {
    logger.error('Error getting Inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};