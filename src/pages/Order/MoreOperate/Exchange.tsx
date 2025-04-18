import React, { memo, useEffect, useState, useRef, ChangeEvent } from 'react';
import { Button, Drawer, Flex, App, Descriptions, Table, Input, TableProps, Radio } from 'antd';
import { BarcodeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { userLog } from '@/common/electron';
import request from '@common/request';
import { DEFAULT_DISCOUNT, PAY_CHANNEL } from '@/common/constant';
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

const Exchange: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  const [orderItems, setOrderItems] = useState([]);

  // 扫描条形码
  const [scanSkuCode, setScanSkuCode] = useState('');
  const debounceTimer = useRef<number>();

  const [returnItems, setReturnItems] = useState([]); // 需要退回的商品
  const [exchangeItems, setExchangeItems] = useState([]); // 需要换货的商品 
  const [exchangeAmount, setExchangeAmount] = useState(0); // 换货价差金额
  const [amountType, setAmountType] = useState(''); // 价差类型

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

  // 执行换货
  const handleExchange = async () => {
    console.log(returnItems, exchangeItems, exchangeAmount, amountType);
    if (returnItems.length === 0) {
      message.error('请选择需要退回的商品');
      return;
    }
    if (exchangeItems.length === 0) {
      message.error('请选择需要换货的商品');
      return;
    }
    if (!amountType) {
      message.error('请选择价差类型');
      return;
    }
    // 发请求给服务端提交换货
    try {
      const response = await request.post('/order/changeItem', {
        orderSn,
        returnItems,
        exchangeItems,
        exchangeAmount,
        amountType,
      });
      const result = response.data;
      if (!result.error) {
        message.success('换货成功');
        setShowPanel(false);
      }
    } catch (error) {
      message.error('换货失败');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getOrderDetail();
      getOrderItems();
    }
  }, [showPanel]);

  // 选择需要退回的商品
  const rowSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setReturnItems(selectedRows);
    },
  };

  // 设置价差类型
  const handleAmountTypeChange = (e: any) => {
    setAmountType(e.target.value);
  };

  // 扫描条形码
  function handleScan(e: ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value.trim();
    // 更新输入框的值
    setScanSkuCode(value);
    
    if (!value) {
      return;
    }
    
    // 清除之前的定时器
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    
    // 设置新的定时器，300ms 后执行查询
    debounceTimer.current = window.setTimeout(() => {
      request.get('/inventory/queryDetailBySku', {
        params: {
          sku: value
        }
      }).then((response: any) => {
        const result = response.data;
        if (result.error || !result.sku) {
          message.error(`没有找到对应的商品`);
          return;
        }
        // 如果商品存在，需要添加到用户想要换取的商品数组中
        setExchangeItems(prev => [...prev, result]);
      }).catch((error: any) => {  
        message.error('查询失败');
      });
      // 清除输入框的值
      setScanSkuCode('');
    }, 300);
  }

  // 删除换货商品
  const deleteExchangeItem = (record: any) => {
    setExchangeItems(prev => prev.filter(item => item.id !== record.id));
  }

  // 换货商品列表
  const exchangeItemColumns = [
    {
      title: 'sku code',
      dataIndex: 'sku',
      key: 'sku',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{text}</span>
            <span style={{ color: 'gray', marginLeft: '5px' }}>[{record.color} / {record.size}]</span>
          </div>
        );
      },
    },
    {
      title: 'original',
      align: 'center',
      key: 'originalPrice',
      dataIndex: 'originalPrice',
      valueType: 'money',
    },
    {
      title: 'sale price',
      align: 'center',
      key: 'salePrice',
      dataIndex: 'salePrice',
      render: (text: string, record: any) => {
        return <span style={{ color: 'red' }}>￥{Number(record.originalPrice * DEFAULT_DISCOUNT).toFixed(2)}</span>;
      },
    },
    {
      title: 'discount',
      align: 'center',
      dataIndex: 'discount',
      key: 'discount',
      render: (text: string, record: any) => {
        return DEFAULT_DISCOUNT;
      },
    },
    {
      title: 'stock',
      align: 'center',
      dataIndex: 'counts',
      key: 'counts',
    },
    {
      title: 'operate',
      align: 'center',
      key: 'operate',
      dataIndex: 'operate',
      render: (text: string, record: any) => {
        return <Button type='link' onClick={() => deleteExchangeItem(record)}>移除</Button>;
      },
    },
  ];

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
        width={800}
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
          title={`Choose Return Items`}
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
          title={`Query Exchange Items`}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Input 
                placeholder='scan barcode' 
                prefix={<BarcodeOutlined />}
                onChange={handleScan}
                value={scanSkuCode}
              />
              <Table
                rowKey='id'
                columns={exchangeItemColumns as any}
                dataSource={exchangeItems}
                size='small'
              />
            </div>
          }
        />

        <Box
          title={`Input Exchange Amount`}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Radio.Group 
                defaultValue={``} 
                buttonStyle={`solid`}
                onChange={handleAmountTypeChange}
              >
                <Radio.Button value="add">补差价</Radio.Button>
                <Radio.Button value="sub">退差价</Radio.Button>
                <Radio.Button value="none">无价差</Radio.Button>
              </Radio.Group>
              <Input
                type='number'
                placeholder='请输入换货价差金额'
                onChange={(e) => {
                  setExchangeAmount(Number(e.target.value.trim()));
                }}
              />
            </div>
          }
        />
      </Drawer>
    </>
  );

};

export default memo(Exchange);
