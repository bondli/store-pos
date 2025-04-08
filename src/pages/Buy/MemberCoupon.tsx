import React, { memo, useContext, useState } from 'react';
import { Card, Col, Row, Statistic, Button, Modal, Flex, Typography, Input } from 'antd';

import { BuyContext } from './context';

import style from './index.module.less';

const MemberCoupon: React.FC = () => {
  const { buyer } = useContext(BuyContext);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentSettingType, setCurrentSettingType] = useState('');

  if (!buyer || !buyer.phone) {
    return null;
  }

  // 使用积分
  const handleUsePoint = () => {
    console.log('use point');
    setCurrentSettingType('point');
    setIsShowModal(true);
  };

  // 使用余额
  const handleUseBalance = () => {
    console.log('use balance');
    setCurrentSettingType('balance');
    setIsShowModal(true);
  };

  // 使用优惠券
  const handleUseCoupon = () => {
    console.log('use coupon');
    setCurrentSettingType('coupon');
    setIsShowModal(true);
  };

  // 确认使用
  const handleModalOk = () => {
    console.log('confirm use');
  };

  // 取消使用
  const handleModalCancel = () => {
    console.log('cancel use');
    setIsShowModal(false);
  };

  // 输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('input change', e.target.value);
  };

  return (
    <Card title={`Member Worth`} size='small' className={style.groupCard}>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title='Points' value={buyer.point} />
          <Button style={{ marginTop: 16 }} disabled={buyer.point <= 0} onClick={handleUsePoint}>use point</Button>
        </Col>
        <Col span={8}>
          <Statistic title='Balance (CNY)' value={buyer.balance} precision={2} />
          <Button style={{ marginTop: 16 }} disabled={buyer.balance <= 0} onClick={handleUseBalance}>use balance</Button>
        </Col>
        <Col span={8}>
          <Statistic title='Coupons' value={buyer.coupon} />
          <Button style={{ marginTop: 16 }} disabled={buyer.coupon <= 0} onClick={handleUseCoupon}>use coupon</Button>
        </Col>
      </Row>
      <Modal
        title={`${currentSettingType} use`}
        open={isShowModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Flex vertical wrap>
          <Flex align="center">
            <Typography.Text style={{ width: '100px' }}>Current Value</Typography.Text>
          </Flex>

          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>Used Value</Typography.Text>
            <Input 
              size='middle' 
              placeholder='input used value'
              style={{ width: `200px` }}
              type='number'
              onChange={handleInputChange}
            />
          </Flex>
        </Flex>
      </Modal>
    </Card>
  );
};

export default memo(MemberCoupon);
