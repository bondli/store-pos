import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, Flex, App, Descriptions, Input, Table, TableProps } from 'antd';
import dayjs from 'dayjs';

import { PAY_CHANNEL } from '@common/constant';
import { userLog } from '@/common/electron';
import request from '@common/request';
import Box from '@/components/Box';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import useItemColumns from './itemColumns';

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
  const { currentLang } = useContext(MainContext);
  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  const [orderItems, setOrderItems] = useState([]);

  const [refundAmount, setRefundAmount] = useState(0);
  const [refundItems, setRefundItems] = useState([]);

  const itemColumns = useItemColumns();
  
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
        {language[currentLang].order.orderRefundBtn}
      </Button>
      <Drawer
        title={language[currentLang].order.orderRefund}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
        footer={
          <Flex justify='right'>
            <Button type='primary' key='refund' onClick={handleRefund}>
              {language[currentLang].order.orderRefundSubmit}
            </Button>
          </Flex>
        }
      >
        <Descriptions
          title={language[currentLang].order.orderInfo}
          bordered
          items={
            [{
              key: 'orderSn',
              label: language[currentLang].order.tableColumnOrderNo,
              children: orderInfo.orderSn,
            }, {
              key: 'createdAt',
              label: language[currentLang].order.tableColumnOrderTime,
              children: dayjs(orderInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            }, {
              key: 'orderAmount',
              label: language[currentLang].order.tableColumnAmount,
              children: orderInfo.orderAmount,
            }, {
              key: 'orderActualAmount',
              label: language[currentLang].order.tableColumnActual,
              children: <span style={{ color: 'red' }}>￥{orderInfo.orderActualAmount}</span>,
            }, {
              key: 'payType',
              label: language[currentLang].order.tableColumnPayment,
              children: PAY_CHANNEL[orderInfo.payType] || 'unknown',
            }, {
              key: 'orderItems',
              label: language[currentLang].order.tableColumnItems,
              children: orderInfo.orderItems,
            }, {
              key: 'userPhone',
              label: language[currentLang].order.tableColumnUser,
              children: orderInfo.userPhone,
            }, {
              key: 'salerName',
              label: language[currentLang].order.tableColumnSaler,
              children: orderInfo.salerName,
            }, {
              key: 'useCoupon',
              label: language[currentLang].order.tableColumnUseCoupon,
              children: orderInfo.useCoupon || '--',
            }, {
              key: 'usePoint',
              label: language[currentLang].order.tableColumnUsePoint,
              children: orderInfo.usePoint || '--',
            }, {
              key: 'useBalance',
              label: language[currentLang].order.tableColumnUseBalance,
              children: orderInfo.useBalance || '--',
            }, {
              key: 'remark',
              label: language[currentLang].order.tableColumnRemark,
              children: orderInfo.remark || '--',
            }]
          }
          column={2}
          size='small'
          style={{ marginBottom: '24px' }}
        />
        <Box
          title={language[currentLang].order.chooseRefundItems}
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
          title={language[currentLang].order.inputRefundAmount}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Input
                type='number'
                placeholder={language[currentLang].order.inputRefundAmountPlaceholder}
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
