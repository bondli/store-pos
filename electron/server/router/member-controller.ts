import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import logger from 'electron-log';
import { Member } from '../model/member';
import { Order } from '../model/order';
import { MemberScore } from '../model/memberScore';
import { MemberBalance } from '../model/memberBalance';
import { MemberCoupon } from '../model/memberCoupon';

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
      // 创建会员权益（第二单可以消费的5元抵扣券）
      await MemberCoupon.create({
        phone,
        couponId: uuidv4(),
        couponCondition: 0, // 无门槛
        couponDesc: '入会权益(第二单可用)',
        couponValue: 5,
        couponCount: 1,
        couponStatus: 'active',
        couponExpiredTime: dayjs().add(1, 'year').toDate(), // 1年后过期
      });

      res.status(200).json(result.toJSON());
    } else {
      res.json({ error: 'member had exists' });
    }
  } catch (error) {
    logger.error('Error creating member:');
    console.log(error);
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
    logger.error('Error getting Member by phone:');
    console.log(error);
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
    logger.error('Error query Member list:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新会员信息
export const updateMember = async (req: Request, res: Response) => {
  const { phone, name, birthday } = req.body;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      await resultCheckExists.update({ name, birthday });
      res.json(resultCheckExists.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error updating Member:');
    console.log(error);
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
    logger.error('Error deleting Member:');
    console.log(error);
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
    logger.error('Error querying Member Score List:');
    console.log(error);
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
        point: justifyScore,
        type,
        reason,
      });
      res.json(result.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error updating Member Score:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 会员充值
export const memberIncomeBalance = async (req: Request, res: Response) => {
  const { phone, inComeBalance, sendValue, sendValueType, reason } = req.body;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      const justifyBalance = Number(inComeBalance) + (sendValueType === 'balance' ? Number(sendValue) : 0);
      // 更新用户余额
      await resultCheckExists.increment({
        balance: justifyBalance,
        // 充值了多少钱就直接加多少积分给用户
        point: Number(inComeBalance),
      });
      // 充值大于1000的自动升级为超级会员
      await resultCheckExists.update({
        level: justifyBalance >= 1000 ? 'super' : 'normal',
      });
      // 写入积分流水表
      await MemberScore.create({
        phone,
        point: inComeBalance,
        type: 'income',
        reason: `充值${inComeBalance}获得${inComeBalance}积分`,
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
      // 如果是现金余额，则写入充值流水记录
      if (sendValueType === 'balance' && Number(sendValue)) {
        balanceRecords.push({
          phone,
          value: Number(sendValue),
          type: `send`,
          reason: reason || `充值${inComeBalance}送${sendValue}`,
        });
      }
      // 如果是商品吊牌价值，则写一个优惠券到用户表
      if (sendValueType === 'goodsValue' && Number(sendValue)) {
        await MemberCoupon.create({
          phone,
          couponId: uuidv4(),
          couponCondition: 0, // 无门槛
          couponDesc: `充值赠送吊牌金额${sendValue}`,
          couponValue: Number(sendValue * 0.59), // 吊牌价值，减扣的只能是59折
          couponCount: 1,
          couponStatus: 'active',
          couponExpiredTime: dayjs().add(1, 'year').toDate(), // 1年后过期
        });
        // 用户的基本信息表中更新优惠券数量
        await resultCheckExists.increment({
          coupon: 1,
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
        remark: `用户充值`,
      });

      res.json(resultOrderCreate.toJSON());
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error Income Member Balance:');
    console.log(error);
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
    logger.error('Error querying Member Balance List:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据会员查询用户的优惠券列表
export const queryMemberCouponList = async (req: Request, res: Response) => {
  const { phone, status, expiredTime } = req.query;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      const where = {};
      where['phone'] = phone;
      if (status) {
        where['couponStatus'] = status;
      }
      if (expiredTime) {
        where['couponExpiredTime'] = { [Op.gte]: dayjs().toDate() };
      }
      const { count, rows } = await MemberCoupon.findAndCountAll({
        where,
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
    logger.error('Error querying Member Coupon List:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据会员查询用户的会员权益列表
export const queryMemberBigdayCouponList = async (req: Request, res: Response) => {
  const { phone } = req.query;
  const couponList: Array<{
    id: number;
    couponDesc: string;
    couponValue: number;
  }> = [];

  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      const memberData = resultCheckExists.toJSON();
      // 判断会员生日是否是当月
      const birthday = dayjs(memberData.birthday);
      if (birthday.month() === dayjs().month()) {
        couponList.push({
          id: 1, // 生日特价
          couponDesc: '会员生日月权益特价',
          couponValue: 1,
        });
      }
      // 判断当前时间是否会员日，会员日每月18号
      if (dayjs().date() === 18) {
        couponList.push({
          id: 2, // 会员日特价
          couponDesc: '会员日(18号)权益特价',
          couponValue: 1,
        });
      }
      // 如果是超级会员，则显示超级会员权益特价
      if (memberData.level === 'super') {
        couponList.push({
          id: 3, // 超级会员特价
          couponDesc: '超级会员权益特价(折上97折)',
          couponValue: 1,
        });
      }
      res.json({ data: couponList });
    } else {
      res.json({ error: 'Member not found' });
    }
  } catch (error) {
    logger.error('Error querying Member Bigday Coupon List:');
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
