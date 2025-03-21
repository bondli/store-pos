import type { MenuProps } from 'antd';

export const PAY_CHANNEL = {
  alipay: '支付宝',
  weixin: '微信',
  cash: '现金',
  card: '银行卡',
  point: '积分',
  balance: '余额',
  other: '其他',
};

export const mainMenuItems: MenuProps['items'] = [{
  key: 'summary',
  label: 'Summary',
}, {
  key: 'order',
  label: 'Order Center',
}, {
  key: 'inventory',
  label: 'Inventory Center',
}, {
  key: 'member',
  label: 'Member Center',
}, {
  key: 'buy',
  label: 'Sales and Payment',
}];