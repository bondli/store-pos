import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'electron-log';
import { sequelize } from './model/index';
import router from './router/index';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(router);

app.all('*', (req, res, next) => {
  res.header('X-Powered-By', 'Store-Pos');
  next();
});

(async () => {
  try {
    // 测试一下数据库是否能连上
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');

    // 启动服务器前同步所有模型
    await sequelize.sync();
    
    // 启动服务器
    app.listen(9527, () => {
      logger.info('Server is running on port 9527');
      // 通知主进程服务器已启动
      if (process.send) {
        process.send({ type: 'server-started', port: 9527 });
      }
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    // 如果启动失败，也通知主进程
    if (process.send) {
      process.send({ type: 'server-error', error: error.message });
    }
  }
})();
