import { Request, Response } from 'express';
import { Op } from 'sequelize';
import logger from 'electron-log';
import { Marketing } from '../model/marketing';
import { StoreCoupon } from '../model/storeCoupon';

// 获取营销活动列表
export const getMarketingList = async (req: Request, res: Response) => {
  const { activityName, activityType, startDate, endDate, pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;
  const where = {};

  if (activityName) {
    where['activityName'] = {
      [Op.substring]: activityName,
    };
  }
  if (activityType) {
    where['activityType'] = {
      [Op.substring]: activityType,
    };
  }

  // 处理起止时间
  if (startDate && endDate) {
    const startTmp = new Date(startDate as string);
    const endTmp = new Date(endDate as string);
    const start = new Date(startTmp.getFullYear(), startTmp.getMonth(), startTmp.getDate());
    const end = new Date(endTmp.getFullYear(), endTmp.getMonth(), endTmp.getDate(), 23, 59, 59, 999);
    where['startTime'] = {
      [Op.gte]: start,
    };
    where['endTime'] = {
      [Op.lte]: end,
    };
  }
  try {
    const { count, rows } = await Marketing.findAndCountAll({
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
    logger.error('Error getting Marketing List:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建营销活动
export const createMarketing = async (req: Request, res: Response) => {
  const { activityName, activityType, activityDesc, activityTime, activityContent } = req.body;
  try {
    const [startTime, endTime] = activityTime;
    
    const marketing = await Marketing.create({
      marketingName: activityName,
      marketingDesc: activityDesc,
      marketingType: activityType,
      startTime,
      endTime,
    });
    // 根据活动类型，创建活动内容
    if (activityType === 'full_send') { // 满送活动
      const { distributionRules } = activityContent;
      // 将满送的优惠券写入店铺优惠券表
      for (const rule of distributionRules) {
        const { full, reduce, count } = rule;
        await StoreCoupon.create({
          activityId: (marketing as any).id,
          couponDesc: `满${full}元减${reduce}元`,
          couponCondition: full,
          couponValue: reduce,
          couponStatus: 'active',
          couponExpiredTime: endTime,
          couponCount: count,
        });
      }
    } else if (activityType === 'full_reduce') { // 满减活动
      const { rules } = activityContent;
      // 将满减的优惠券写入店铺优惠券表
      for (const rule of rules) {
        const { full, reduce } = rule;
        await StoreCoupon.create({
          activityId: (marketing as any).id,
          couponDesc: `满${full}元减${reduce}元`,
          couponCondition: full,
          couponValue: reduce,
          couponStatus: 'active',
          couponExpiredTime: endTime,
          couponCount: 1,
        });
      }
    } else if (activityType === 'full_gift') { // 满赠活动
      // 将满赠的优惠券写入店铺优惠券表
      // 暂不实现
    }
    res.json(marketing);
  } catch (error) {
    logger.error('Error creating Marketing:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新营销活动
export const updateMarketing = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { activityName, activityTime, activityDesc } = req.body;
  const [startTime, endTime] = activityTime;
  try {
    const marketing = await Marketing.findByPk(id as string); 
    if (marketing) {
      await marketing.update({
        marketingName: activityName,
        startTime,
        endTime,
        marketingDesc: activityDesc,
      });
      res.json(marketing);
    } else {
      res.status(404).json({ error: 'Marketing not found' });
    }
  } catch (error) {
    logger.error('Error updating Marketing:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除营销活动
export const deleteMarketing = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const marketing = await Marketing.findByPk(id);
    if (marketing) {
      await marketing.destroy();
      res.json({ message: 'Marketing deleted successfully' });
      // 删除营销活动下属优惠券
      await StoreCoupon.destroy({
        where: {
          marketingId: id,
        },
      });
    } else {
      res.status(404).json({ error: 'Marketing not found' });
    }
  } catch (error) {
    logger.error('Error deleting Marketing:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取营销活动详情
export const getMarketingDetail = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const marketing = await Marketing.findByPk(id as string);
    res.json(marketing);
  } catch (error) {
    logger.error('Error getting Marketing Detail:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取营销活动下属优惠券列表
export const getMarketingCouponList = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { count, rows } = await StoreCoupon.findAndCountAll({
    where: {
      activityId: id,
    },
  });
  res.json({
    count: count || 0,
    data: rows || [],
  });
};