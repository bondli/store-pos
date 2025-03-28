import React, { memo, useContext, useEffect, useState } from 'react';
import { List } from 'antd';

import { BuyContext } from './context';

import style from './index.module.less';

const BillInfo: React.FC = () => {
  const { waitSales, buyer } = useContext(BuyContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const tmp = [];
    let needPay = waitSales?.brief?.payAmount;
    tmp.push({
      desc: `订单应收:`,
      amount: waitSales?.brief?.payAmount,
    });
    if (buyer?.usePoint) {
      needPay -= buyer?.usePoint / 100;
      tmp.push({
        desc: `使用(${buyer?.usePoint})积分抵扣:`,
        amount: `-${(buyer?.usePoint / 100)}`,
      });
    }
    tmp.push({
      desc: `订单应付:`,
      amount: needPay,
    });

    if (buyer?.phone && needPay > 1) {
      tmp.push({
        desc: `本次获得积分:`,
        amount: Math.floor(needPay),
      });
    }

    setList(tmp);
  }, [waitSales, buyer]);

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
          <List.Item>
            <List.Item.Meta title={<div className={style.billListTitle}>{item.desc}</div>}/>
            <div>¥{item.amount}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default memo(BillInfo);
