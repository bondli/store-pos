import React, { memo } from 'react';
import { Card, Col, Row } from 'antd';

import PageTitle from '@/components/PageTitle';
import CustomCard from '@/components/CustomCard';

import style from './index.module.less';

const BuyPage: React.FC = () => {
  return (
    <div className={style.container}>
      <PageTitle text={`Sales and Payment`} />

      <Row gutter={16} style={{ height: `calc(100% - 40px)`}}>
        <Col span={12}>
          <CustomCard
            title={`Sales Info`}
            footer={`asdasdasd`}
          >
            // 顶部给到扫码框，然后是待售商品列表
          </CustomCard>
        </Col>
        <Col span={12}>
          <CustomCard
            title={`Payment Info`}
            footer={`提交按钮`}
          >
            // 会员信息（先填写会员，然后带出积分使用积分抵扣，带出余额使用余额支付，带出券使用券抵扣）
            // 营销减扣（满减券，红包等）
            // 支付方式
          </CustomCard>
        </Col>
      </Row>
    </div>
  );

};

export default memo(BuyPage);
