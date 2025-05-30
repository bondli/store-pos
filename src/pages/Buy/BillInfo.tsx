import React, { memo, useContext, useEffect, useState } from 'react';
import { List } from 'antd';
import Decimal from 'decimal.js';

import language from '@/common/language';
import { MainContext } from '@/common/context';

import { BuyContext } from './context';

import style from './index.module.less';

const BillInfo: React.FC = () => {
  const { currentLang } = useContext(MainContext);
  const { waitSales, storeCoupons, buyer } = useContext(BuyContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const tmp = [];
    let needPay = new Decimal(waitSales?.brief?.payAmount || 0);
    tmp.push({
      key: 1,
      desc: `订单应收:`,
      amount: waitSales?.brief?.payAmount,
    });
    // 使用店铺优惠券抵扣
    if (storeCoupons?.length) {
      const couponValue = storeCoupons?.reduce((acc, curr) => acc + curr.couponValue, 0);
      needPay = needPay.minus(couponValue);
      tmp.push({
        key: 2,
        desc: `使用店铺优惠券抵扣:`,
        amount: `-${couponValue}`
      });
    }
    if (buyer?.usePoint) {
      const pointsValue = new Decimal(buyer.usePoint).dividedBy(100);
      needPay = needPay.minus(pointsValue);
      tmp.push({
        key: 3,
        desc: `使用(${buyer?.usePoint})积分抵扣:`,
        amount: `-${pointsValue.toNumber()}`,
      });
    }
    // 使用余额抵扣
    if (buyer?.useBalance) {
      needPay = needPay.minus(buyer.useBalance);
      tmp.push({
        key: 4,
        desc: `使用(${buyer?.useBalance})余额抵扣:`,
        amount: `-${buyer?.useBalance}`,
      });
    }
    // 使用会员优惠券抵扣
    if (buyer?.useCoupon) {
      needPay = needPay.minus(buyer.useCoupon);
      tmp.push({
        key: 5,
        desc: `使用会员优惠券抵扣:`,
        amount: `-${buyer?.useCoupon}`,
      });
    }
    tmp.push({
      key: 6,
      desc: `订单应付:`,
      amount: needPay.toFixed(2),
    });

    if (buyer?.phone && needPay.greaterThan(1)) {
      tmp.push({
        key: 7,
        desc: `本次获得积分:`,
        amount: Math.floor(needPay.toNumber()),
      });
    }

    setList(tmp);
  }, [waitSales, storeCoupons, buyer]);

  if (!waitSales?.list?.length) {
    return null;
  }

  return (
    <div className={style.billContainer}>
      <List
        header={
          <div className={style.billTitle}>
            {language[currentLang].buy.marketingInfo}
          </div>
        }
        size='small'
        itemLayout={`horizontal`}
        bordered
        dataSource={list}
        renderItem={(item) => (
          <List.Item key={item.key}>
            <List.Item.Meta title={<div className={style.billListTitle}>{item.desc}</div>}/>
            {
              item.key === 1 || item.key === 6 ? (
                <div>¥{item.amount}</div>
              ) : (
                <div>{item.amount}</div>
              )
            }
          </List.Item>
        )}
      />
    </div>
  );
};

export default memo(BillInfo);
