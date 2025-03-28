import React, { memo, useContext } from 'react';
import { Card, Col, Row, Statistic, Button } from 'antd';

import { BuyContext } from './context';

import style from './index.module.less';

const MemberCoupon: React.FC = () => {
  const { buyer } = useContext(BuyContext);

  if (!buyer || !buyer.phone) {
    return null;
  }

  return (
    <Card title={`Member Worth`} size='small' className={style.groupCard}>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title='Points' value={buyer.point} />
          <Button style={{ marginTop: 16 }}>use point</Button>
        </Col>
        <Col span={8}>
          <Statistic title='Balance (CNY)' value={buyer.balance} precision={2} />
          <Button style={{ marginTop: 16 }}>use balance</Button>
        </Col>
        <Col span={8}>
          <Statistic title='Coupons' value={buyer.coupon} />
        </Col>
      </Row>
    </Card>
  );
};

export default memo(MemberCoupon);
