import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, Descriptions, App } from 'antd';
import dayjs from 'dayjs';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { PAY_CHANNEL } from '@common/constant';
import { userLog } from '@/common/electron';
import request from '@common/request';

import Box from '@/components/Box';

import itemColumns from './item';
import couponColumns from './coupon';

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
  useCoupon: '',
  usePoint: '',
  useBalance: '',
};

const Detail: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  
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

  useEffect(() => {
    if (showPanel) {
      getOrderDetail();
    }
  }, [showPanel]);

  // 获取订单中商品列表
  const getOrderItems = async () => {
    try {
      const response = await request.get('/order/queryItemList', {
        params: {
          orderSn,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询订单商品失败');
    }
  };

  // 获取订单中的优惠券列表
  const getOrderCouponList = async () => {
    try {
      const response = await request.get('/order/queryCouponList', {
        params: {
          orderSn,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询订单优惠券失败');
    }
  };

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        detail
      </Button>
      <Drawer
        title={`Order Detail`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Descriptions
          title={`Order Info`}
          bordered
          items={
            [{
              key: '1',
              label: 'Order Code',
              children: orderInfo.orderSn,
            }, {
              key: '2',
              label: 'Order Time',
              children: dayjs(orderInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            }, {
              key: '3',
              label: 'Order Amount',
              children: orderInfo.orderAmount,
            }, {
              key: '4',
              label: 'Order Actual',
              children: orderInfo.orderActualAmount,
            }, {
              key: '5',
              label: 'Pay type',
              children: PAY_CHANNEL[orderInfo.payType] || 'unknown',
            }, {
              key: '6',
              label: 'Order items',
              children: orderInfo.orderItems,
            }, {
              key: '7',
              label: 'User',
              children: orderInfo.userPhone,
            }, {
              key: '8',
              label: 'Saler',
              children: orderInfo.salerName,
            }, {
              key: '9',
              label: 'use coupon',
              children: orderInfo.useCoupon || '--',
            }, {
              key: '10',
              label: 'use point',
              children: orderInfo.usePoint || '--',
            }, {
              key: '11',
              label: 'use balance',
              children: orderInfo.useBalance || '--',
            }, {
              key: '12',
              label: 'Remark',
              children: orderInfo.remark || '--',
            }]
          }
          column={2}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`Order Items`}
          content={
            <TableRender
              request={getOrderItems as any}
              columns={itemColumns as ProColumnsType}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          }
        />
        <Box
          title={`Order Coupons`}
          content={
            <TableRender
              request={getOrderCouponList as any}
              columns={couponColumns as ProColumnsType}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          }
        />
      </Drawer>
    </>
  );

};

export default memo(Detail);
