import React, { memo, useContext, useEffect, useState, useRef } from 'react';
import { Flex, Button, Row, Col, message, Drawer, Result } from 'antd';

import { getStore, setStore, printStr } from '@common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { BuyContext } from './context';
import Bill from '@/components/Bill';

const SubmitBar: React.FC = () => {
  const { currentLang } = useContext(MainContext);
  
  const {
    waitSales,
    buyer,
    storeSaler,
    storeCoupons,
    setWaitSales,
    setStoreCoupons,
    setBuyer,
    setStoreSaler,
  } = useContext(BuyContext);

  const [orderInCache, setOrderInCache] = useState(null);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [memberInfo, setMemberInfo] = useState({});

  // 打印小票用
  const printRef = useRef<HTMLDivElement>(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const orderCache = getStore('orderCache') || {};
    if (orderCache?.waitSales?.list?.length) {
      setOrderInCache(orderCache);
    }
  }, []);

  // 获取会员信息
  const getMemberInfo = async (phone: string) => {
    const response = await request.get('/member/detail', {
      params: {
        phone,
      },
    });
    const result = response.data;
    if (!result.error) {
      setMemberInfo(result);
    }
  };

  useEffect(() => {
    if (showSuccessDrawer && orderInfo?.userPhone) {
      getMemberInfo(orderInfo.userPhone);
    }
  }, [showSuccessDrawer, orderInfo]);

  // 取消下单
  const handleReset = () => {
    setWaitSales({
      list: [],
      brief: {
        skuNum: 0,
        counts: 0,
        totalAmount: 0,
        payAmount: 0,
        actualAmount: 0,
        payType: '',
        remark: '',
      },
    });
    setStoreCoupons([]);
    setBuyer(null);
    setStoreSaler(null);
  };

  // 提交订单
  const handleSubmit = async () => {
    // 检查必要数据
    if (!waitSales?.list?.length) {
      message.error('还没有添加待售商品');
      return;
    }

    if (!waitSales?.brief?.payType) {
      message.error('请选择支付方式');
      return;
    }

    if (!storeSaler || !storeSaler.id) {
      message.error('请选择导购员');
      return;
    }

    try {
      const response = await request.post('/buy/submit', {
        waitSales,
        buyer,
        storeSaler,
        storeCoupons,
      });

      const resData = response.data;

      if (resData?.error) {
        message.error(resData?.error || '订单提交失败');
      } else {
        message.success('订单提交成功');
        // 在清除待售商品之前，先将待售的商品写入state，用于打印小票
        const rate = waitSales?.brief?.actualAmount / waitSales?.brief?.payAmount;
        const orderItems = waitSales?.list.map((item) => ({
          ...item,
          actualPrice: item.isGived ? 0 : Number((item.salePrice * rate).toFixed(2)) * item.counts,
        }));
        setOrderItems(orderItems);
        handleReset();
        // 弹出下单成功的抽屉，提供打印小票的功能
        setShowSuccessDrawer(true);
        // 将订单信息写入state，用于打印小票
        setOrderInfo(resData);
      }
    } catch (error) {
      message.error('订单提交失败，请重试');
    }
  };

  // 从缓存中恢复订单
  const handleRestore = () => {
    setWaitSales(orderInCache.waitSales);
    setBuyer(orderInCache.buyer);
    setStoreSaler(orderInCache.storeSaler);
    // 删除缓存
    setOrderInCache(null);
    // 删除store中的缓存
    setStore('orderCache', null);
  };

  // 打印小票
  const handlePrint = () => {
    if (printRef.current) {
      printStr(printRef.current.innerHTML);
    } else {
      message.error('小票内容为空');
    }
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Flex gap={'small'} wrap>
          <Button type={'primary'} onClick={handleSubmit}>{language[currentLang].buy.submit}</Button>
          <Button onClick={handleReset}>{language[currentLang].buy.clear}</Button>
        </Flex>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        {
          orderInCache?.waitSales?.list?.length ? (
            <Button onClick={handleRestore}>{language[currentLang].buy.restore}</Button>
          ) : null
        }
      </Col>
      <Drawer
        title={language[currentLang].buy.success}
        open={showSuccessDrawer}
        onClose={() => setShowSuccessDrawer(false)}
      >
        <Result
          status='success'
          title={language[currentLang].buy.success}
          subTitle={language[currentLang].buy.successSubtitle}
          extra={[
            <Button type='primary' key='print' onClick={handlePrint}>
              {language[currentLang].buy.print}
            </Button>,
            <Button key='close' onClick={() => setShowSuccessDrawer(false)}>
              {language[currentLang].buy.close}
            </Button>,
          ]}
        />
        <div ref={printRef} style={{ display: 'block' }}>
          <Bill orderInfo={orderInfo} orderItems={orderItems} memberInfo={memberInfo} />
        </div>
      </Drawer>
    </Row>
  );
};

export default memo(SubmitBar);
