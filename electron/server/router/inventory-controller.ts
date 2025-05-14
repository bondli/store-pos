import { Request, Response } from 'express';
import { Op } from 'sequelize';
import logger from 'electron-log';
import ExcelJS from 'exceljs';
import { Inventory } from '../model/inventory';
import { InventoryRecord } from '../model/inventoryRecord';

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
      const oldCounts = result.get('counts');
      // await result.update({ sku, sn, name, color, size, brand, costPrice, originalPrice, counts });
      await result.update({ counts });
      const adjustCount = Number(counts) - Number(oldCounts);
      if (adjustCount !== 0) {
        await InventoryRecord.create({
          sku,
          type: 'adjust',
          info: `人工调整:${oldCounts} -> ${counts}`,
          count: adjustCount
        });
      }
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

// 查询热销商品列表
export const queryHotSalesList = async (req: Request, res: Response) => {
  const { pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;

  try {
    const { count, rows } = await Inventory.findAndCountAll({
      where: {
        saleCounts: { // 销售数量大于0的
          [Op.gt]: 0,
        },
      },
      order: [['saleCounts', 'DESC']],
      limit,
      offset,
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting hot sales list:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询商品流水
export const querySkuRecord = async (req: Request, res: Response) => {
  const { sku } = req.query;
  try {
    const { count, rows } = await InventoryRecord.findAndCountAll({
      where: {
        sku,
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting sku record:');
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
      // 写入库存变动记录
      await InventoryRecord.create({ sku, type: 'in', info: `单品入库`, count: counts });
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
  
  // 收集所有需要查询的 sn 和 sku
  const sns = new Set<string>();
  const skus = new Set<string>();
  
  // 预处理数据，收集所有需要查询的 sn 和 sku
  for (const item of dataList) {
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
    sns.add(inventoryData.sn);
    skus.add(inventoryData.sku);
  }

  // 一次性查询所有相关的库存记录
  const [snResults, skuResults] = await Promise.all([
    Inventory.findAll({
      where: {
        sn: {
          [Op.in]: Array.from(sns)
        }
      }
    }),
    Inventory.findAll({
      where: {
        sku: {
          [Op.in]: Array.from(skus)
        }
      }
    })
  ]);

  // 创建查询结果的 Map，方便快速查找
  const snMap = new Map(
    snResults.map(item => [(item as any).sn, item])
  );
  const skuMap = new Map(
    skuResults.map(item => [(item as any).sku, item])
  );

  // 处理每条数据
  for (const item of dataList) {
    const sn = item.货号;
    const sku = item.条码;

    const snResult = snMap.get(sn);
    if (snResult) {
      const skuResult = skuMap.get(sku);
      if (skuResult) {
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

    // 定义一个变量来保存入库的总数和错误的数量
    let totalCount = 0;
    let errorCount = 0;

    // 用于批量插入流水
    const recordsToInsert: Array<{ sku: string; type: string; info: string; count: number }> = [];

    // 预处理数据，合并相同 SKU 的数量
    const skuMap = new Map<string, {
      counts: number;
      data: any;
    }>();

    for (const item of dataList) {
      const sku = item.条码;
      const counts = Number(item.数量);
      
      if (skuMap.has(sku)) {
        const existing = skuMap.get(sku)!;
        existing.counts += counts;
      } else {
        skuMap.set(sku, {
          counts,
          data: {
            name: item.品名,
            sn: item.货号,
            brand: item.品牌 || '戴维贝拉',
            sku: item.条码,
            size: item.尺码,
            color: item.颜色,
            originalPrice: item.吊牌价,
            costPrice: item.进货价 || 0,
            counts
          }
        });
      }
    }

    // 获取所有需要查询的 SKU
    const skus = Array.from(skuMap.keys());
    
    // 一次性查询所有相关的库存记录
    const existingItems = await Inventory.findAll({
      where: {
        sku: {
          [Op.in]: skus
        }
      }
    });

    // 创建查询结果的 Map，方便快速查找
    const existingMap = new Map(
      existingItems.map(item => [(item as any).sku, item])
    );

    // 批量处理数据
    interface Operation {
      sku: string;
      promise: Promise<any>;
    }
    const updateOperations: Operation[] = [];
    const createOperations: Operation[] = [];

    for (const [sku, { counts, data }] of skuMap) {
      totalCount += counts;
      const existingItem = existingMap.get(sku);

      if (existingItem) {
        // SKU存在，更新库存数量
        const currentCounts = Number((existingItem as any).counts || 0);
        updateOperations.push({
          sku,
          promise: existingItem.update({
            counts: currentCounts + counts
          }).then(updatedItem => {
            results.push({
              sku,
              status: 'updated',
              data: updatedItem.toJSON()
            });
            // 记录流水
            recordsToInsert.push({
              sku,
              type: 'in',
              info: '批量入库',
              count: counts
            });
          }).catch(error => {
            errorCount += counts;
            errors.push({
              sku,
              error: error instanceof Error ? error.message : String(error)
            });
          })
        });
      } else {
        // SKU不存在，创建新记录
        createOperations.push({
          sku,
          promise: Inventory.create(data).then(newItem => {
            results.push({
              sku,
              status: 'created',
              data: newItem.toJSON()
            });
            // 记录流水
            recordsToInsert.push({
              sku,
              type: 'in',
              info: '批量入库',
              count: counts
            });
          }).catch(error => {
            errorCount += counts;
            errors.push({
              sku,
              error: error instanceof Error ? error.message : String(error)
            });
          })
        });
      }
    }

    // 控制并发数量的函数
    const processBatch = async (operations: Operation[], batchSize: number = 10) => {
      const batches: Operation[][] = [];
      for (let i = 0; i < operations.length; i += batchSize) {
        batches.push(operations.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        await Promise.all(batch.map(item => item.promise));
      }
    };

    // 分别处理更新和创建操作，每批最多10个并发
    await Promise.all([
      processBatch(updateOperations),
      processBatch(createOperations)
    ]);

    // 批量插入流水
    if (recordsToInsert.length > 0) {
      await InventoryRecord.bulkCreate(recordsToInsert);
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
  
  // 获取所有需要查询的 SKU
  const skus = newDataList.map(item => item.sku);
  
  // 一次性查询所有相关的库存记录
  const inventoryItems = await Inventory.findAll({
    where: {
      sku: {
        [Op.in]: skus
      }
    }
  });

  // 创建一个 Map 来存储查询结果，方便快速查找
  const inventoryMap = new Map(
    inventoryItems.map(item => [(item as any).sku, item.toJSON()])
  );

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
    const inventoryData = inventoryMap.get(item.sku);
    
    if (inventoryData) {
      finalDataList.push({
        ...inventoryData,
        sku: item.sku,
        returnCounts: Number(item.returnCounts),
      } as FinalReturnItem);
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

  try {
    // 获取所有需要处理的 SKU
    const skus = dataList.map(item => item.sku);
    
    // 一次性查询所有相关的库存记录
    const inventoryItems = await Inventory.findAll({
      where: {
        sku: {
          [Op.in]: skus
        }
      }
    });

    // 创建一个 Map 来存储查询结果，方便快速查找
    const inventoryMap = new Map(
      inventoryItems.map(item => [(item as any).sku, item])
    );

    // 创建一个 Map 来存储每个 SKU 的退货数量
    const returnCountsMap = new Map<string, number>();
    dataList.forEach(item => {
      const currentCount = returnCountsMap.get(item.sku) || 0;
      returnCountsMap.set(item.sku, currentCount + Number(item.returnCounts));
    });

    // 批量更新库存并收集流水
    const updatePromises: Promise<any>[] = [];
    const recordsToInsert: Array<{ sku: string; type: string; info: string; count: number }> = [];
    for (const [sku, returnCounts] of returnCountsMap) {
      totalCount += returnCounts;
      const inventoryItem = inventoryMap.get(sku);
      
      if (inventoryItem) {
        updatePromises.push(
          inventoryItem.decrement('counts', { by: returnCounts })
        );
        recordsToInsert.push({
          sku,
          type: 'return',
          info: '批量退库',
          count: returnCounts
        });
      } else {
        errorCount += returnCounts;
      }
    }

    // 等待所有更新操作完成
    await Promise.all(updatePromises);
    // 批量插入流水
    if (recordsToInsert.length > 0) {
      await InventoryRecord.bulkCreate(recordsToInsert);
    }

    res.json({
      success: true,
      errorCount,
      totalCount,
    });
  } catch (error) {
    logger.error('Error in batch returns inventory:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
