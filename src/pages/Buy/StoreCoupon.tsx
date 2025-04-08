import React, { memo, useContext, useEffect, useState } from 'react';
import { Card, Select } from 'antd';

import request from '@/common/request';

import { BuyContext } from './context';

import style from './index.module.less';

const StoreCoupon: React.FC = () => {
  const { setStoreCoupons, waitSales } = useContext(BuyContext);
  const [coupons, setCoupons] = useState([]);

  // 根据传入的应收金额是服务端查询当前店铺的优惠券，如果符合优惠的条件，设置券可用，否则禁用
  const getCoupons = async () => {
    const res = await request.get('/buy/getStoreCoupon', {
      params: {
        amount: waitSales?.brief?.payAmount,
      },
    });

    const coupons = res.data;
    // 优惠券列表格式化成Select组件可用的格式
    setCoupons(coupons.map(item => ({
      ...item,
      label: item.couponDesc,
      value: item.id,
    })));
  };

  const handleChange = (value: string) => {
    const selectedCoupon = coupons.find(item => item.value === value);
    console.log('selectedCoupon:', selectedCoupon);
    setStoreCoupons(selectedCoupon ? [selectedCoupon] : []);
  };

  useEffect(() => {
    if (waitSales?.list?.length && waitSales?.brief?.payAmount) {
      getCoupons();
    }
  }, [waitSales?.brief?.payAmount]);

  if (!waitSales?.list?.length) {
    return null;
  }

  return (
    <Card title={`Store Coupon`} size='small' className={style.groupCard}>
      <Select
        defaultValue={``}
        style={{ width: `100%` }}
        options={coupons}
        onChange={handleChange}
        labelRender={
          (props) => {
            const { label } = props;
            if (label) {
              return label;
            }
            return <span>请选择优惠券</span>;
          }
        }
      />
    </Card>
  );
};

export default memo(StoreCoupon);
