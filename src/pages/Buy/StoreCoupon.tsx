import React, { memo, useContext, useEffect, useState } from 'react';
import { Card, Select } from 'antd';

import { BuyContext } from './context';

import style from './index.module.less';

const StoreCoupon: React.FC = () => {
  const { storeCoupons } = useContext(BuyContext);

  const [coupons, setCoupons] = useState([{ value: '', label: 'please select coupons' }]);
  useEffect(() => {
    const newCoupons = [];
    storeCoupons.forEach((item) => {
      // todo:根据实收情况验证券的可用性，不可用的需要禁用
      storeCoupons.push({ value: item.value, label: item.label });
    });
    setCoupons(newCoupons);
  }, []);

  if (!storeCoupons || !storeCoupons.length) {
    return null;
  }

  return (
    <Card title={`Store Coupon`} size='small' className={style.groupCard}>
      <Select
        defaultValue={``}
        style={{ width: `100%` }}
        options={coupons}
      />
    </Card>
  );
};

export default memo(StoreCoupon);
