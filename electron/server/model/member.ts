import { DataTypes } from 'sequelize';
import { sequelize } from './index';

// 会员表
const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  phone: {
    comment: '手机号',
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  actual: {
    comment: '消费金额',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  point: {
    comment: '积分余额',
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  balance: {
    comment: '余额',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  name: {
    comment: '会员名',
    type: DataTypes.STRING,
    allowNull: true,
  },
  birthday: {
    comment: '生日',
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  // 这是其他模型参数
  tableName: 'Member',
});

export { Member };
