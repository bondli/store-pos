import React, { createContext, useState } from 'react';

// 待售商品
type WaitSaleItem = {
  sn: string;
  sku: string;
  name: string;
  color: string;
  size: string;
  originalPrice: number; // 商品吊牌价
  salePrice: number; // 商品折扣价
  discount: number; // 商品折扣率
  counts: number; // 商品数量
  isGived: boolean; // 商品是否赠送
};

// 待售商品汇总信息和支付信息
type WaitSaleBrief = {
  skuNum: number; // SKU数量
  counts: number; // 商品数量
  totalAmount: number; // 商品吊牌总金额
  payAmount: number; // 商品折扣之后的应付金额
  actualAmount: number; // 商品折扣之后的实付金额
  payType: string; // 支付方式
  remark: string; // 订单备注
};

type WaitSales = {
  list: WaitSaleItem[];
  brief: WaitSaleBrief;
};

// 购买的会员信息(资产)
type Buyer = {
  phone: string; // 会员手机号
  point: number; // 会员积分
  balance: number; // 会员余额
  coupon?: number; // 会员优惠券
  bigdayCoupon?: number; // 会员日优惠券
  level?: string; // 会员等级
  status?: string; // 会员状态
  usePoint?: number; // 使用积分数量
  useBalance?: number; // 使用余额
  useCoupon?: number; // 使用优惠券价值
  useCouponId?: number; // 使用优惠券ID
  useBigdayCoupon?: number; // 使用会员日优惠券
  useBigdayCouponId?: number; // 使用会员日优惠券ID
};

// 店铺优惠券(满减券/红包等)
type StoreCoupon = {
  id: number;
  activityId: number;
  couponCondition: number;
  couponDesc: string;
  couponValue: number;
  couponCount: number;
  couponStatus: string;
  couponExpiredTime: string;
};

// 成单导购员信息
type StoreSaler = {
  id: number;
  name: string;
};

type BuyContextType = {
  waitSales: WaitSales; // 待售商品 
  setWaitSales: React.Dispatch<React.SetStateAction<WaitSales>>;
  buyer: Buyer; // 购买的会员信息
  setBuyer: React.Dispatch<React.SetStateAction<Buyer>>;
  storeCoupons: StoreCoupon[]; // 使用了的店铺优惠券
  setStoreCoupons: React.Dispatch<React.SetStateAction<StoreCoupon[]>>;
  storeSaler: StoreSaler; // 成单导购员信息
  setStoreSaler: React.Dispatch<React.SetStateAction<StoreSaler>>;
};

export const BuyContext = createContext<BuyContextType | undefined>(undefined);

export const BuyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [waitSales, setWaitSales] = useState<WaitSales>({
    list: [],
    brief: {
      skuNum: 0,
      counts: 0,
      totalAmount: 0,
      payAmount: 0,
      actualAmount: 0,
      payType: '',
      remark: '',
    },
  });
  const [buyer, setBuyer] = useState<Buyer>({
    phone: '',
    point: 0,
    balance: 0,
    coupon: 0,
    bigdayCoupon: 0,
  });
  const [storeCoupons, setStoreCoupons] = useState<StoreCoupon[]>([]);
  const [storeSaler, setStoreSaler] = useState<StoreSaler>({
    id: 0,
    name: '',
  });

  return (
    <BuyContext.Provider
      value={{
        waitSales,
        setWaitSales,
        buyer,
        setBuyer,
        storeCoupons,
        setStoreCoupons,
        storeSaler,
        setStoreSaler,
      }}
    >
      {children}
    </BuyContext.Provider>
  );
};
