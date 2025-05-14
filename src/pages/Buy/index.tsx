import React, { memo, useContext } from 'react';
import { Col, Row, Button } from 'antd';

import { setStore } from '@/common/electron';
import PageTitle from '@/components/PageTitle';
import CustomCard from '@/components/CustomCard';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { BuyProvider } from './context';

import WaitSaleList from './WaitSaleList';
import WaitSaleSummary from './WaitSaleSummary';
import MemberCoupon from './MemberCoupon';
import StoreCoupon from './StoreCoupon';
import Payment from './Payment';
import BillInfo from './BillInfo';
import SubmitBar from './SubmitBar';
import PhoneInput from './PhoneInput';
import SkuInput from './SkuInput';

import style from './index.module.less';

const BuyPageContainer: React.FC = () => {
  const { currentLang } = useContext(MainContext);

  return (
    <div className={style.container}>
      <PageTitle
        text={`${language[currentLang].buy.title}`}
      />
      <Row gutter={16} style={{ height: `calc(100% - 40px)`}}>
        <Col span={12}>
          <CustomCard
            title={<SkuInput />}
            footer={<WaitSaleSummary />}
          >
            <WaitSaleList />
          </CustomCard>
        </Col>
        <Col span={12}>
          <CustomCard
            title={<PhoneInput />}
            footer={<SubmitBar />}
          >
            <MemberCoupon />

            <StoreCoupon />

            <BillInfo />

            <Payment />

          </CustomCard>
        </Col>
      </Row>
    </div>
  );
};

const BuyPage: React.FC = () => {
  return (
    <BuyProvider>
      <BuyPageContainer />
    </BuyProvider>
  );
};

export default memo(BuyPage);
