import { DataTypes } from 'sequelize';
import { sequelize } from './index';

const OrderItems = sequelize.define('OrderItems', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sn: {
    comment: '货号',
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    comment: 'SKU',
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    comment: '商品名称',
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    comment: '颜色',
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    comment: '尺码',
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    comment: '品牌',
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'db',
  },
  originalPrice: {
    comment: '吊牌价',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    comment: '折扣',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 100,
  },
  actualPrice: {
    comment: '实收价',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  counts: {
    comment: '销售数量',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  orderSn: {
    comment: '订单号',
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 'OrderItems',
});

export { OrderItems };
