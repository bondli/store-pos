import { DataTypes } from 'sequelize';
import { sequelize } from './index';

// 积分流水表
const MemberScore = sequelize.define('MemberScore', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  phone: {
    comment: '手机号',
    type: DataTypes.STRING,
    allowNull: false,
  },
  point: {
    comment: '变动的积分',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  type: {
    comment: '变动的方式',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  reason: {
    comment: '变动的原因',
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 'MemberScore',
});

export { MemberScore };
