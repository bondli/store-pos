export const PAY_CHANNEL = {
  alipay: '支付宝',
  weixin: '微信',
  cash: '现金',
  card: '银行卡',
  point: '积分',
  balance: '余额',
  other: '其他',
};

// 默认折扣率
export const DEFAULT_DISCOUNT = 0.6;

// 支付渠道类型
export type PaymentChannel = 'alipay' | 'weixin' | 'cash' | 'card' | 'other';

// 支付渠道统计
export interface PaymentChannelStats {
  alipay: number;
  weixin: number;
  cash: number;
  card: number;
  other: number;
}

// 订单统计信息
export interface OrderStatistics {
  orderActualAmount: number;      // 订单总金额
  orderCount: number;       // 订单数量
  itemCount: number;        // 商品数量
  payChannelStats: PaymentChannelStats;  // 支付渠道统计
}

// 订单基础信息
export interface OrderBase {
  orderActualAmount: number;  // 实际支付金额
  orderAmount: number;        // 订单金额
  orderItems: number;         // 订单商品数量
  payType: PaymentChannel;    // 支付方式
}

// 订单列表组件属性
export interface OrderListProps {
  dataList: OrderBase[];
}

// 订单查询参数
export interface QueryParamsProps {
  queryParams: {
    start?: string;
    end?: string;
    showStatus?: string;
    userPhone?: string;
    payType?: string;
    orderSn?: string;
    salerId?: string;
  };
}