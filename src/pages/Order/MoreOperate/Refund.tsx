import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, Flex, App, Descriptions, Input, Table, TableProps } from 'antd';
import dayjs from 'dayjs';

import { PAY_CHANNEL } from '@common/constant';
import { userLog } from '@/common/electron';
import request from '@common/request';
import Box from '@/components/Box';

import itemColumns from './itemColumns';

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

const Refund: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  const [orderItems, setOrderItems] = useState([]);

  const [refundAmount, setRefundAmount] = useState(0);
  const [refundItems, setRefundItems] = useState([]);
  
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
      if (!result.error) {
        setOrderItems(result.data.filter(item => item.status !== 'refund'));
      }
    } catch (error) {
      message.error('查询订单商品失败');
    }
  };

  // 退货
  const handleRefund = async () => {
    if (refundItems.length === 0) {
      message.error('请选择退货商品');
      return;
    }
    // 注释掉，存在使用余额等情况下，退款金额可以大于订单实际金额，除非实现余额也退回账户
    // if (refundAmount > orderInfo.orderActualAmount) {
    //   message.error('退款金额不能大于订单实际金额');
    //   return;
    // }
    try {
      const response = await request.post('/order/refundItem', {
        orderSn,
        refundAmount,
        refundItems,
      });
      const result = response.data;
      if (!result.error) {
        message.success('退货成功');
        setShowPanel(false);
      }
    } catch (error) {
      message.error('退货失败');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getOrderDetail();
      getOrderItems();
    }
  }, [showPanel]);

  const rowSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setRefundItems(selectedRows);
    },
  };

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        订单退货
      </Button>
      <Drawer
        title={`Order Refund`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='center'>
            <Button type='primary' key='refund' onClick={handleRefund}>
              执行退货
            </Button>
          </Flex>
        }
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
              children: <span style={{ color: 'red' }}>￥{orderInfo.orderActualAmount}</span>,
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
          title={`Choose Refund Items`}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Table
                rowKey='id'
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={itemColumns as any}
                dataSource={orderItems}
                size='small'
              />
            </div>
          }
        />

        <Box
          title={`Input Refund Amount`}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Input
                type='number'
                placeholder='请输入退款金额'
                onChange={(e) => {
                  setRefundAmount(Number(e.target.value.trim()));
                }}
              />
            </div>
          }
        />
      </Drawer>
    </>
  );

};

export default memo(Refund);
