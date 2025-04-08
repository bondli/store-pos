import { DataTypes } from 'sequelize';
import { sequelize } from './index';

// 会员优惠券表
const MemberCoupon = sequelize.define('MemberCoupon', {
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
  couponId: {
    comment: '优惠券ID',
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  couponCondition: {
    comment: '优惠券条件',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  couponDesc: {
    comment: '优惠券描述',
    type: DataTypes.STRING,
    allowNull: true,
  },
  couponValue: {
    comment: '优惠券面额',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  couponCount: {
    comment: '优惠券数量',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  couponStatus: {
    comment: '优惠券状态',
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', // 'used' or 'expired'
  },
  couponExpiredTime: {
    comment: '优惠券过期时间',
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  // 这是其他模型参数
  tableName: 'MemberCoupon',
});

export { MemberCoupon };
