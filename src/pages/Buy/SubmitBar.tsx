import React, { memo, useContext, useEffect, useState } from 'react';
import { Flex, Button, Row, Col, message } from 'antd';

import { getStore } from '@common/electron';
import request from '@common/request';

import { BuyContext } from './context';

const SubmitBar: React.FC = () => {
  const {
    waitSales,
    buyer,
    storeSaler,
    setWaitSales,
    setStoreCoupons,
    setBuyer,
  } = useContext(BuyContext);

  const [orderInCache, setOrderInCache] = useState(null);

  useEffect(() => {
    const orderCache = getStore('orderCache') || {};
    if (orderCache?.waitSales?.length) {
      setOrderInCache(orderCache);
    }
  }, []);

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
      },
    });
    setStoreCoupons([]);
    setBuyer(null);
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
      const response = await request.post('/order/submit', {
        waitSales,
        buyer,
        storeSaler,
      });

      const resData = response.data;

      if (resData?.error) {
        message.error(resData?.error || '订单提交失败');
      } else {
        message.success('订单提交成功');
        handleReset();
      }
    } catch (error) {
      message.error('订单提交失败，请重试');
    }
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Flex gap={`small`} wrap>
          <Button type={`primary`} onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleReset}>Cancel</Button>
        </Flex>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        {
          orderInCache ? (
            <Button>Restore from handed</Button>
          ) : null
        }
      </Col>
    </Row>
  );
};

export default memo(SubmitBar);
