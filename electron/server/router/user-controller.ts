import { Request, Response } from 'express';
import logger from 'electron-log';
import { User } from '../model/user';

// 新增一个用户
export const createUser = async (req: Request, res: Response) => {
  const { avatar, name, password, email } = req.body;
  try {
    const result = await User.findOne({
      where: {
        name,
      },
    });
    if (result === null) {
      const updateResult = await User.create({ avatar, name, password, email });
      res.status(200).json(updateResult.toJSON());
    } else {
      res.json({
        error: '用户名已存在',
        code: 1,
      });
    }
  } catch (error) {
    logger.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询用户详情
export const getUserInfo = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const result = await User.findByPk(Number(id));
    if (result) {
      res.json(result.toJSON());
    } else {
      res.json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error('Error getting User by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新用户信息
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { avatar, name, password, email } = req.body;
  try {
    const result = await User.findByPk(Number(id));
    if (result) {
      await result.update({ avatar, name, password, email });
      res.json(result.toJSON());
    } else {
      res.json({ error: 'user not found' });
    }
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 用户登录
export const userLogin = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  try {
    const result = await User.findOne({
      where: {
        name,
        password,
      },
    });
    if (result === null) {
      res.json({ error: 'user not found' });
    } else {
      res.json(result.toJSON());
    }
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 用户列表
export const getUserList = async (req: Request, res: Response) => {
  try {
    const { count, rows } = await User.findAndCountAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    logger.error('Error getting user list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
