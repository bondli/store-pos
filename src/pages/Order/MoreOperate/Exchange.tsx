import React, { memo, useEffect, useState, useRef } from 'react';
import { Button, Drawer, Flex, App } from 'antd';

import { userLog } from '@/common/electron';
import request from '@common/request';
import Bill from '@/components/Bill';
import { printStr } from '@/common/electron';

type ComProps = {
  orderSn: string;
};

const defaultOrderInfo = {
  orderSn: '',
  createdAt: '',
  orderAmount: 0,
  orderActualAmount: 0,
  orderItems: 0,
  payType: '',
  userPhone: '',
  salerName: '',
  remark: '',
  usePoint: 0,
  useBalance: 0,
  useCoupon: 0,
};

const Exchange: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  const [orderItems, setOrderItems] = useState([]);
  const printRef = useRef<HTMLDivElement>(null);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 获取订单信息
  const getOrderDetail = async () => {
    userLog('request order detail params:', orderSn);
    try {
      const response = await request.get('/order/queryDetail', {
        params: {
          orderSn,
        },
      });
      const result = response.data;
      if (!result.error) {
        setOrderInfo(result);
      }

    } catch (error) {
      message.error('查询订单失败');
    }
  };

  // 获取订单中商品列表
  const getOrderItems = async () => {
    try {
      const response = await request.get('/order/queryItemList', {
        params: {
          orderSn,
        },
      });
      const result = response.data;
      setOrderItems(result.data);
    } catch (error) {
      message.error('查询订单商品失败');
    }
  };

  // 执行换货
  const handleExchange = () => {
    if (printRef.current) {
      printStr(printRef.current.innerHTML);
    } else {
      message.error('小票内容为空');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getOrderDetail();
      getOrderItems();
    }
  }, [showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        订单换货
      </Button>
      <Drawer
        title={`Order Exchange`}
        width={368}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='center'>
            <Button type='primary' key='exchange' onClick={handleExchange}>
              执行换货
            </Button>
          </Flex>
        }
      >
        <div ref={printRef}>
          <Bill orderInfo={orderInfo} orderItems={orderItems} />
        </div>
      </Drawer>
    </>
  );

};

export default memo(Exchange);
