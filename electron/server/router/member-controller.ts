import { Request, Response } from 'express';
import logger from 'electron-log';
import { Member } from '../model/member';
import { MemberScore } from '../model/memberScore';

// 新增会员
export const createMember = async (req: Request, res: Response) => {
  const { phone, name, brithday } = req.body;
  try {
    // 先判断该手机号是否已经存在
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists === null) {
      const result = await Member.create({ phone, name, brithday });
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
  const { orderSn, userPhone, pageSize, pageNum } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(pageNum) - 1) * limit;
  try {
    const { count, rows } = await Member.findAndCountAll({
      where: { orderSn, userPhone },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting Members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新会员信息
export const updateMember = async (req: Request, res: Response) => {
  const { phone } = req.query;
  const { name, brithday } = req.body;
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
      const { count, rows } = await Member.findAndCountAll({
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
  const { phone, score, type, reason } = req.body;
  try {
    const resultCheckExists = await Member.findOne({
      where: {
        phone,
      },
    });
    if (resultCheckExists) {
      const justifyScore = (type === 'add') ? Number(score) : -1 * Number(score);
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