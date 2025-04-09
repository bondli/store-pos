import React, { memo, useContext, useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Button, Modal, Flex, Typography, Input, Select, App } from 'antd';

import request from '@/common/request';

import { BuyContext } from './context';

import style from './index.module.less';

const MemberCoupon: React.FC = () => {
  const { message } = App.useApp();

  const { buyer, setBuyer } = useContext(BuyContext);
  const [isShowPointModal, setIsShowPointModal] = useState(false);
  const [isShowBalanceModal, setIsShowBalanceModal] = useState(false);
  const [isShowCouponModal, setIsShowCouponModal] = useState(false);

  const [usePoint, setUsePoint] = useState(0);
  const [useBalance, setUseBalance] = useState(0);
  const [useCoupon, setUseCoupon] = useState<any>(null);

  // 用户可用优惠券列表
  const [couponList, setCouponList] = useState<any[]>([]);

  // 获取用户可用优惠券列表
  useEffect(() => {
    if (buyer?.coupon > 0) {
      // 发送请求获取用户可用的优惠券
      request.get('/member/queryCouponList', {
        params: {
          phone: buyer.phone,
          status: 'active',
          expiredTime: 1,
        },
      }).then((res) => {
        const result = res.data;
        setCouponList(result.data);
      });
    }
  }, [buyer?.phone]);

  if (!buyer || !buyer.phone) {
    return null;
  }

  // 使用积分
  const handleUsePoint = () => {
    console.log('use point');
    setIsShowPointModal(true);
  };

  // 使用余额
  const handleUseBalance = () => {
    console.log('use balance');
    setIsShowBalanceModal(true);
  };

  // 使用优惠券
  const handleUseCoupon = () => {
    console.log('use coupon');
    setIsShowCouponModal(true);
  };

  // 使用积分输入框变化
  const handlePointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('input change', e.target.value);
    const point = Number(e.target.value.trim());
    setUsePoint(point);
  };

  // 使用余额输入框变化
  const handleBalanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('input change', e.target.value);
    const balance = Number(e.target.value.trim());
    setUseBalance(balance);
  };

  // 选择优惠券
  const handleCouponSelectChange = (value: string) => {
    // console.log('select change', value);
    const coupon = couponList.find((item) => item.id === value);
    setUseCoupon(coupon);
  };

  // 确认使用积分
  const handlePointModalOk = () => {
    // console.log('confirm use');
    if(usePoint > buyer.point) {
      message.error('使用积分不能大于当前积分');
      return;
    }
    setBuyer({
      ...buyer,
      usePoint,
    });
    setIsShowPointModal(false);
  };

  // 确认使用余额
  const handleBalanceModalOk = () => {
    // console.log('confirm use');
    if(useBalance > buyer.balance) {
      message.error('使用余额不能大于当前余额');
      return;
    }
    setBuyer({
      ...buyer,
      useBalance,
    });
    setIsShowBalanceModal(false);
  };

  // 确认使用优惠券
  const handleCouponModalOk = () => {
    // console.log('confirm use');
    setBuyer({
      ...buyer,
      useCoupon: useCoupon?.couponValue || 0,
      useCouponId: useCoupon?.id || 0,
    });
    setIsShowCouponModal(false);
  };
  
  return (
    <Card title={`User[${buyer.phone}] Worth`} size='small' className={style.groupCard}>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title='Points'
            value={buyer.point}
            suffix={<span style={{ fontSize: 12, color: '#999' }}>{usePoint > 0 ? `-${usePoint}` : ''}</span>}
          />
          <Button style={{ marginTop: 16 }} disabled={buyer.point <= 0} onClick={handleUsePoint}>use point</Button>
        </Col>
        <Col span={8}>
          <Statistic
            title='Balance (CNY)'
            value={buyer.balance}
            precision={2}
            suffix={<span style={{ fontSize: 12, color: '#999' }}>{useBalance > 0 ? `-${useBalance}` : ''}</span>}
          />
          <Button style={{ marginTop: 16 }} disabled={buyer.balance <= 0} onClick={handleUseBalance}>use balance</Button>
        </Col>
        <Col span={8}>
          <Statistic
            title='Coupons'
            value={buyer.coupon}
            suffix={<span style={{ fontSize: 12, color: '#999' }}>{useCoupon?.couponValue > 0 ? `-${useCoupon.couponValue}` : ''}</span>}
          />
          <Button style={{ marginTop: 16 }} disabled={buyer.coupon <= 0} onClick={handleUseCoupon}>use coupon</Button>
        </Col>
      </Row>
      <Modal
        title={`使用积分`}
        open={isShowPointModal}
        onOk={handlePointModalOk}
        onCancel={() => setIsShowPointModal(false)}
        destroyOnClose
      >
        <Flex vertical wrap>
          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>当前积分</Typography.Text>
            <Typography.Text>{buyer.point}</Typography.Text>
          </Flex>

          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>使用积分</Typography.Text>
            <Input 
              size='middle' 
              placeholder='输入使用积分'
              style={{ width: `200px` }}
              type='number'
              onChange={handlePointInputChange}
            />
          </Flex>
        </Flex>
      </Modal>

      <Modal
        title={`使用余额`}
        open={isShowBalanceModal}
        onOk={handleBalanceModalOk}
        onCancel={() => setIsShowBalanceModal(false)}
        destroyOnClose
      >
        <Flex vertical wrap>
          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>当前余额</Typography.Text>
            <Typography.Text>{buyer.balance}</Typography.Text>
          </Flex>

          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>使用余额</Typography.Text>
            <Input 
              size='middle' 
              placeholder='输入使用余额'
              style={{ width: `200px` }}
              type='number'
              onChange={handleBalanceInputChange}
            />
          </Flex>
        </Flex>
      </Modal>

      <Modal
        title={`使用优惠券`}
        open={isShowCouponModal}
        onOk={handleCouponModalOk}
        onCancel={() => setIsShowCouponModal(false)}
        destroyOnClose
      >
        <Flex vertical wrap>
          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>使用优惠券</Typography.Text>
            <Select
              size='middle'
              placeholder='选择优惠券'
              style={{ width: `200px` }}
              onChange={handleCouponSelectChange}
              value={useCoupon?.id}
            >
              <Select.Option key={0} value={0}>不使用</Select.Option>
              {couponList.map((item) => (
                <Select.Option key={item.id} value={item.id}>{item.couponDesc}</Select.Option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Modal>
    </Card>
  );
};

export default memo(MemberCoupon);
