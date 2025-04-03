import React, { createContext, useState } from 'react';

// 待售商品
type WaitSaleItem = {
  sn: string;
  sku: string;
  name: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  counts: number;
  isGived: boolean;
};

// 待售商品汇总信息和支付信息
type WaitSaleBrief = {
  skuNum: number;
  counts: number;
  totalAmount: number;
  payAmount: number;
  actualAmount: number;
  payType: string;
};

type WaitSales = {
  list: WaitSaleItem[];
  brief: WaitSaleBrief;
};

// 购买的会员信息(资产)
type Buyer = {
  phone: string;
  point: number;
  balance: number;
  coupon?: number;
  usePoint?: number;
  useBalance?: number;
  useStoreCoupon?: number;
};

// 店铺优惠券(满减券/红包等)
type StoreCoupon = {
  label: string;
  value: number;
};

// 成单导购员信息
type StoreSaler = {
  id: number;
  name: string;
};

type BuyContextType = {
  waitSales: WaitSales;
  setWaitSales: React.Dispatch<React.SetStateAction<WaitSales>>;
  buyer: Buyer;
  setBuyer: React.Dispatch<React.SetStateAction<Buyer>>;
  storeCoupons: StoreCoupon[];
  setStoreCoupons: React.Dispatch<React.SetStateAction<StoreCoupon[]>>;
  storeSaler: StoreSaler;
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
    },
  });
  const [buyer, setBuyer] = useState<Buyer>(null);
  const [storeCoupons, setStoreCoupons] = useState<StoreCoupon[]>([]);
  const [storeSaler, setStoreSaler] = useState<StoreSaler>(null);

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
