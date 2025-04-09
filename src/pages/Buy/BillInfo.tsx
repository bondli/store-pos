import React, { memo, useContext, useEffect, useState } from 'react';
import { List } from 'antd';

import { BuyContext } from './context';

import style from './index.module.less';

const BillInfo: React.FC = () => {
  const { waitSales, storeCoupons, buyer } = useContext(BuyContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const tmp = [];
    let needPay = waitSales?.brief?.payAmount;
    tmp.push({
      key: 1,
      desc: `订单应收:`,
      amount: waitSales?.brief?.payAmount,
    });
    // 使用店铺优惠券抵扣
    if (storeCoupons?.length) {
      needPay -= storeCoupons?.reduce((acc, curr) => acc + curr.couponValue, 0);
      tmp.push({
        key: 2,
        desc: `使用店铺优惠券抵扣:`,
        amount: `-${(storeCoupons?.reduce((acc, curr) => acc + curr.couponValue, 0))}`
      });
    }
    if (buyer?.usePoint) {
      needPay -= buyer?.usePoint / 100;
      tmp.push({
        key: 3,
        desc: `使用(${buyer?.usePoint})积分抵扣:`,
        amount: `-${(buyer?.usePoint / 100)}`,
      });
    }
    // 使用余额抵扣
    if (buyer?.useBalance) {
      needPay -= buyer?.useBalance;
      tmp.push({
        key: 4,
        desc: `使用(${buyer?.useBalance})余额抵扣:`,
        amount: `-${(buyer?.useBalance)}`,
      });
    }
    // 使用会员优惠券抵扣
    if (buyer?.useCoupon) {
      needPay -= buyer?.useCoupon;
      tmp.push({
        key: 5,
        desc: `使用会员优惠券抵扣:`,
        amount: `-${(buyer?.useCoupon)}`,
      });
    }
    tmp.push({
      key: 6,
      desc: `订单应付:`,
      amount: needPay,
    });

    if (buyer?.phone && needPay > 1) {
      tmp.push({
        key: 7,
        desc: `本次获得积分:`,
        amount: Math.floor(needPay),
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
            Marketing Info
          </div>
        }
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
