import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, Descriptions, App } from 'antd';
import dayjs from 'dayjs';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { PAY_CHANNEL } from '@common/constant';
import { userLog } from '@/common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

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
  const { currentLang } = useContext(MainContext);
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
        {language[currentLang].order.orderDetailAction}
      </Button>
      <Drawer
        title={language[currentLang].order.orderDetail}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Descriptions
          title={language[currentLang].order.orderInfo}
          bordered
          items={
            [{
              key: '1',
              label: language[currentLang].order.tableColumnOrderNo,
              children: orderInfo.orderSn,
            }, {
              key: '2',
              label: language[currentLang].order.tableColumnOrderTime,
              children: dayjs(orderInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            }, {
              key: '3',
              label: language[currentLang].order.tableColumnAmount,
              children: orderInfo.orderAmount,
            }, {
              key: '4',
              label: language[currentLang].order.tableColumnActual,
              children: orderInfo.orderActualAmount,
            }, {
              key: '5',
              label: language[currentLang].order.tableColumnPayment,
              children: PAY_CHANNEL[orderInfo.payType] || 'unknown',
            }, {
              key: '6',
              label: language[currentLang].order.tableColumnItems,
              children: orderInfo.orderItems,
            }, {
              key: '7',
              label: language[currentLang].order.tableColumnUser,
              children: orderInfo.userPhone,
            }, {
              key: '8',
              label: language[currentLang].order.tableColumnSaler,
              children: orderInfo.salerName,
            }, {
              key: '9',
              label: language[currentLang].order.tableColumnUseCoupon,
              children: orderInfo.useCoupon || '--',
            }, {
              key: '10',
              label: language[currentLang].order.tableColumnUsePoint,
              children: orderInfo.usePoint || '--',
            }, {
              key: '11',
              label: language[currentLang].order.tableColumnUseBalance,
              children: orderInfo.useBalance || '--',
            }, {
              key: '12',
              label: language[currentLang].order.tableColumnRemark,
              children: orderInfo.remark || '--',
            }]
          }
          column={2}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={language[currentLang].order.orderItems}
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
          title={language[currentLang].order.orderCoupons}
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
