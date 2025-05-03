import { Request, Response } from 'express';
import { Op } from 'sequelize';
import logger from 'electron-log';
import ExcelJS from 'exceljs';
import { Inventory } from '../model/inventory';

// 查询所有库存的总量
export const queryInventoryTotal = async (req: Request, res: Response) => {
  try {
    const result = await Inventory.sum('counts');
    res.json({
      total: result || 0,
    });
  } catch (error) {
    logger.error('Error querying inventory total:');
    console.log(error);
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
    logger.error('Error getting Inventory:');
    console.log(error);
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
    logger.error('Error getting Inventory:');
    console.log(error);
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
    logger.error('Error updating Inventory:');
    console.log(error);
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
      res.json({ sku: null, msg: 'Inventory not found' });
    }
  } catch (error) {
    logger.error('Error getting Inventory:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询断码商品列表
export const queryNoStockList = async (req: Request, res: Response) => {
  const { pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;
  const where = {
    counts: {
      [Op.lte]: 0,
    },
  };

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
    logger.error('Error getting no stock list:');
    console.log(error);
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
    logger.error('Error creating sku:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 批量处理预处理数据(入库)
export const batchProcessPurchaseData = async (req: Request, res: Response) => {
  const { dataList } = req.body;

  let totalCount = 0;
  // 对传入的数据进行遍历，目的是根据styleNo和sku字段来判断入库方式
  // 新增一个叫type的字段，值为addSku、addStyle、newStyle
  // 如果通过styleNo，没有查询到数据，则type赋值newStyle
  // 如果通过sku没有查询到数据，则type赋值addSku
  // 如果通过sku查询到了数据，则type赋值addNum
  // 最后将记录返回
  for (const item of dataList) {
    // 将中文字段名映射到数据库字段名
    const inventoryData = {
      name: item.品名,
      sn: item.货号,
      brand: item.品牌 || '戴维贝拉',
      sku: item.条码,
      size: item.尺码,
      color: item.颜色,
      originalPrice: item.吊牌价,
      costPrice: item.进货价 || 0,
      counts: Number(item.数量),
    };

    // 如果品牌为空，则赋值为戴维贝拉
    if (!item.品牌) {
      item.品牌 = '戴维贝拉';
    }

    totalCount += Number(inventoryData.counts);

    const sn = inventoryData.sn;
    const sku = inventoryData.sku;
    const result = await Inventory.findOne({
      where: { sn: sn },
    });
    if (result) {
      const resultSku = await Inventory.findOne({
        where: { sku: sku },
      });
      if (resultSku) {
        item['type'] = 'addNum';
      } else {
        item['type'] = 'addSku';
      }
    } else {
      item['type'] = 'newStyle';
    }
  }

  res.json({
    success: true,
    dataList,
    totalCount,
  });
};

// 批量入库
export const batchCreateInventory = async (req: Request, res: Response) => {
  const { dataList } = req.body;
  try {
    const results: Array<{
      sku: string;
      status: 'created' | 'updated';
      data: any;
    }> = [];
    const errors: Array<{
      sku: string;
      error: string;
    }> = [];

    // 定义一个变量来保存r入库的总数和错误的数量
    let totalCount = 0;
    let errorCount = 0;
    for (const item of dataList) {
      try {
        // 将中文字段名映射到数据库字段名
        const inventoryData = {
          name: item.品名,
          sn: item.货号,
          brand: item.品牌 || '戴维贝拉',
          sku: item.条码,
          size: item.尺码,
          color: item.颜色,
          originalPrice: item.吊牌价,
          costPrice: item.进货价 || 0,
          counts: Number(item.数量)
        };

        totalCount += Number(inventoryData.counts);

        // 检查该SKU是否已存在
        const existingItem = await Inventory.findOne({
          where: { sku: inventoryData.sku }
        });

        if (existingItem) {
          // SKU存在，更新库存数量
          const currentCounts = Number((existingItem as any).counts || 0);
          const updatedItem = await existingItem.update({
            counts: currentCounts + inventoryData.counts
          });
          results.push({
            sku: inventoryData.sku,
            status: 'updated',
            data: updatedItem.toJSON()
          });
        } else {
          // SKU不存在，创建新记录
          const newItem = await Inventory.create(inventoryData);
          results.push({
            sku: inventoryData.sku,
            status: 'created',
            data: newItem.toJSON()
          });
        }
      } catch (itemError) {
        errorCount += Number(item['数量']);
        errors.push({
          sku: item.条码,
          error: itemError instanceof Error ? itemError.message : String(itemError)
        });
      }
    }

    res.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
      totalCount,
      errorCount
    });
  } catch (error) {
    logger.error('Error in batch creating inventory:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 批量处理预处理数据(退库)
export const batchProcessReturnsData = async (req: Request, res: Response) => {
  const { dataList } = req.body;

  let totalCount = 0;
  // 对传入的数据进行遍历，将重复的行合并，数量列相加
  interface ReturnItem {
    sku: string;
    returnCounts: string | number;
    [key: string]: any;  // 允许其他可能的字段
  }
  const newDataList: ReturnItem[] = [];
  const map = new Map<string, ReturnItem>();
  for (const item of dataList) {
    const sku = item.条码;
    if (map.has(sku)) {
      const data = map.get(sku)!;
      data.returnCounts = Number(data.returnCounts) + Number(item.数量);
    } else {  
      map.set(sku, {
        sku,
        returnCounts: Number(item.数量),
      });
    }
  }
  for (const item of map.values()) {
    newDataList.push(item);
  }
  
  // 最后将记录返回
  interface FinalReturnItem extends ReturnItem {
    id?: number;
    name?: string;
    brand?: string;
    color?: string;
    size?: string;
    originalPrice?: number;
    costPrice?: number;
    counts?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  const finalDataList: FinalReturnItem[] = [];
  for (const item of newDataList) {
    totalCount += Number(item.returnCounts);

    const sku = item.sku;
    const result = await Inventory.findOne({
      where: { sku },
    });
    const data = result?.toJSON();
    if (data) {
      finalDataList.push({
        ...data,
        returnCounts: Number(item.returnCounts),
      });
    }
  }

  res.json({
    success: true,
    dataList: finalDataList,
    totalCount,
  });
};

// 批量退库
export const batchReturnsInventory = async (req: Request, res: Response) => {
  const { dataList } = req.body;
  let errorCount = 0;
  let totalCount = 0;
  // 对dataList进行遍历，将sku作为where条件，将counts的值减去returnCounts再保存
  for (const item of dataList) {
    totalCount += Number(item.returnCounts);
    const result = await Inventory.findOne({
      where: { sku: item.sku },
    });
    if (result) {
      const updatedItem = await result.decrement('counts', { by: Number(item.returnCounts) });
      if (!updatedItem) {
        errorCount += Number(item.returnCounts);
      }
    } else {
      errorCount += Number(item.returnCounts);
    }
  }
  res.json({
    success: true,
    errorCount,
    totalCount,
  });
};

// 下载模板
export const downloadTemplate = async (req: Request, res: Response) => {
  const { type } = req.body;
  let fileName = '';

  // 将结果写入excel文件
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('default');

  try {
    if (type === 'purchase') {
      fileName = 'purchase.xlsx';
      worksheet.addRow(['品名', '货号', '条码', '尺码', '颜色', '吊牌价', '进货价', '数量', '品牌']);
    }
    else {
      fileName = 'returns.xlsx';
      worksheet.addRow(['条码', '数量']);
    }
    
    // 将文件写入响应
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    workbook.xlsx.write(res);
  } catch (error) {
    logger.error('Error downloading template:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
