import { Request, Response } from 'express';
import { Op } from 'sequelize';
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
  const { sn, sku, name, brand, pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;
  const where = {};

  if (sn) {
    where['sn'] = {
      [Op.substring]: sn,
    };
  }
  if (sku) {
    where['sku'] = {
      [Op.substring]: sku,
    };
  }
  if (name) {
    where['name'] = {
      [Op.substring]: name,
    };
  }
  if (brand) {
    where['brand'] = {
      [Op.substring]: brand,
    };
  }
  try {
    const { count, rows } = await Inventory.findAndCountAll({
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
    const result = await Inventory.findOne({
      where: { sku },
    });
    if (result) {
      // await result.update({ sku, sn, name, color, size, brand, costPrice, originalPrice, counts });
      await result.update({ counts });
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
export const queryDetailBySku = async (req: Request, res: Response) => {
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

// 单个入库
export const createInventory = async (req: Request, res: Response) => {
  const { sn, sku, name, brand, color, size, originalPrice, costPrice, counts } = req.body;
  try {
    // 先判断该SKU是否已经存在
    const resultCheckExists = await Inventory.findOne({
      where: {
        sku,
      },
    });
    if (resultCheckExists === null) {
      const result = await Inventory.create({ sn, sku, name, brand, color, size, originalPrice, costPrice, counts });
      res.status(200).json(result.toJSON());
    } else {
      res.json({ error: 'sku had exists' });
    }
  } catch (error) {
    logger.error('Error creating sku:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};