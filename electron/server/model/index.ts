import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import logger from 'electron-log'

// 根据 NODE_ENV 加载对应的环境变量文件
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log('Database Config:', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  database: process.env.DB_NAME || 'store_pos',
  user: process.env.DB_USER || 'root'
});

// 使用到的是sequelize，文档：
// https://github.com/demopark/sequelize-docs-Zh-CN/blob/v6/core-concepts/model-querying-basics.md
export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'cx0917CXC',
  database: process.env.DB_NAME || 'store_pos',
  logging: (msg) => logger.info(msg),
  dialectOptions: {
    // 设置时区
    timezone: '+08:00'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });