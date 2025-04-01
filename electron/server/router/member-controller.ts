import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import logger from 'electron-log';
import { Member } from '../model/member';
import { Order } from '../model/order';
import { MemberScore } from '../model/memberScore';
import { MemberBalance } from '../model/memberBalance';

// 新增会员
export const createMember = async (req: Request, res: Response) => {
  const { phone, name, birthday } = req.body;
  try {
    // 先判断该手机号是否已经存在
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists === null) {
      const result = await Member.create({ phone, name, birthday });
      res.status(200).json(result.toJSON());
    } else {
      res.json({ error: 'member had exists' });
    }
  } catch (error) {
    logger.error('Error creating member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询会员详情
export const getMemberInfo = async (req: Request, res: Response) => {
  const { phone } = req.query;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      res.json(resultCheckExists.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error getting Member by phone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询所有会员
export const getMemberList = async (req: Request, res: Response) => {
  const { startDate, endDate, phone, pageSize, current } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(current) - 1) * limit;
  const where = {};
  // 处理起止时间
  if (startDate && endDate) {
    const startTmp = new Date(startDate as string);
    const endTmp = new Date(endDate as string);
    const start = new Date(startTmp.getFullYear(), startTmp.getMonth(), startTmp.getDate());
    const end = new Date(endTmp.getFullYear(), endTmp.getMonth(), endTmp.getDate(), 23, 59, 59, 999);
    where['createdAt'] = {
      [Op.gte]: start,
      [Op.lte]: end,
    };
  }

  // 处理phone查询
  if (phone) {
    where['phone'] = {
      [Op.eq]: phone,
    };
  }

  try {
    const { count, rows } = await Member.findAndCountAll({
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
    logger.error('Error query Member list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新会员信息
export const updateMember = async (req: Request, res: Response) => {
  const { phone, name, brithday } = req.body;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      await resultCheckExists.update({ name, brithday });
      res.json(resultCheckExists.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error updating Member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除会员
export const deleteMember = async (req: Request, res: Response) => {
  const { phone } = req.query;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      await resultCheckExists.destroy();
      res.json({ message: 'Member deleted successfully' });
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error deleting Member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据会员查询用户的积分列表
export const queryMemberScoreList = async (req: Request, res: Response) => {
  const { phone } = req.query;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      // 从用户积分表取数据
      const { count, rows } = await MemberScore.findAndCountAll({
        where: { phone },
        order: [['createdAt', 'DESC']],
      });
      res.json({
        count: count || 0,
        data: rows || [],
      });
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error querying Member Score List:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新用户积分
export const updateMemberScore = async (req: Request, res: Response) => {
  const { phone, changePoint, type, reason } = req.body;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      const justifyScore = (type === 'manualAdd') ? Number(changePoint) : -1 * Number(changePoint);
      // 更新用户积分
      await resultCheckExists.increment({
        point: justifyScore,
      });
      // 插入记录到用户积分表
      const result = await MemberScore.create({
        phone,
        score: justifyScore,
        type,
        reason,
      });
      res.json(result.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error updating Member Score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 会员充值
export const memberIncomeBalance = async (req: Request, res: Response) => {
  const { phone, inComeBalance, sendValue, reason } = req.body;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      const justifyBalance = Number(inComeBalance) + Number(sendValue);
      // 更新用户余额
      await resultCheckExists.increment({
        balance: justifyBalance,
      });
      // 插入记录到用户余额记录表
      const balanceRecords: Array<{
        phone: string;
        value: number;
        type: string;
        reason: string;
      }> = [];
      
      balanceRecords.push({
        phone,
        value: inComeBalance,
        type: `income`,
        reason: `充值${inComeBalance}`,
      });
      if (sendValue) {
        balanceRecords.push({
          phone,
          value: sendValue,
          type: `send`,
          reason: reason || `充值${inComeBalance}送${sendValue}`,
        });
      }
      // 批量写入充值流水记录
      await MemberBalance.bulkCreate(balanceRecords);

      // 写入订单表，方便对账和统计当天的收入
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
      const resultOrderCreate = await Order.create({
        orderSn: `${todayStr}${String(todayOrders+1).padStart(3, '0')}`, // 构造订单编号
        orderStatus: `uncheck`,
        orderItems: 0,
        orderAmount: 0,
        orderActualAmount: inComeBalance,
        payType: 'other',
        userPhone: phone,
        usePoint: 0,
        useBalance: 0,
        useCoupon: 0,
        salerId: 0,
        salerName: '',
      });

      res.json(resultOrderCreate.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error Income Member Balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据会员查询用户的余额列表
export const queryMemberBalanceList = async (req: Request, res: Response) => {
  const { phone } = req.query;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      // 从用户积分表取数据
      const { count, rows } = await MemberBalance.findAndCountAll({
        where: { phone },
        order: [['createdAt', 'DESC']],
      });
      res.json({
        count: count || 0,
        data: rows || [],
      });
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error querying Member Balance List:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};