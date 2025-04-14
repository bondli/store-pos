import React, { memo, useState } from 'react';
import { Button, Descriptions, Drawer, Flex, Table, App } from 'antd';
import dayjs from 'dayjs';

import request from '@/common/request';
import { PAY_CHANNEL, PaymentChannelStats } from '@common/constant';
import Box from '@/components/Box';

type ComProps = {
  dataList: any[];
};

const ExportOrder: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { dataList } = props;

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const handleExport = async () => {
    // 将订单列表中的 orderSn 提取成一个数组
    const orderSnList = dataList.map((item) => item.orderSn);
    try {
      // 发送请求给后台去导出
      const response = await request.post('/order/export', {
        orderSnList,
      }, {
        responseType: 'blob' // 指定响应类型为 blob
      });
      
      // 创建 Blob 对象
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-${dayjs().format('YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      message.success('导出成功');
      // 关闭抽屉
      setShowPanel(false);
    } catch (error) {
      message.error('导出失败');
      console.error('Export error:', error);
    }
  };

  const orderActualAmount = dataList.reduce((acc, curr) => acc + curr.orderActualAmount, 0);
  const orderCount = dataList.length;
  const itemCount = dataList.reduce((acc, curr) => acc + curr.orderItems, 0);
  const payChannel = dataList.reduce((acc, curr) => {
    acc[curr.payType] = (acc[curr.payType] || 0) + curr.orderActualAmount;
    return acc;
  }, {} as PaymentChannelStats);

  const dataSource = [
    {
      key: '1',
      label: 'Order Actual Amount',
      children: orderActualAmount,
    },
    {
      key: '2',
      label: 'Order Count',
      children: orderCount,
    },
    {
      key: '3',
      label: 'Item Count',
      children: itemCount,
    },
    {
      key: '4',
      label: 'Pay Channel(alipay)',
      children: payChannel.alipay || '--',
    },
    {
      key: '5',
      label: 'Pay Channel(weixin)',
      children: payChannel.weixin || '--',
    },
    {
      key: '6',
      label: 'Pay Channel(cash)',
      children: payChannel.cash || '--',
    },
    {
      key: '7',
      label: 'Pay Channel(card)',
      children: payChannel.card || '--',
    },
    {
      key: '8',
      label: 'Pay Channel(other)',
      children: payChannel.other || '--',
    },
  ];

  const columns = [
    {
      title: 'sn',
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
    },
    {
      title: 'items',
      align: 'center',
      key: 'orderItems',
      dataIndex: 'orderItems',
      fixed: 'left',
    },
    {
      title: 'actual',
      align: 'center',
      dataIndex: 'orderActualAmount',
      key: 'orderActualAmount',
      fixed: 'left',
    },
    {
      title: 'payment',
      align: 'center',
      dataIndex: 'payType',
      key: 'payType',
      render: (row, record) => {
        return PAY_CHANNEL[record.payType] || 'unknown';
      }
    },
    {
      title: 'user',
      align: 'center',
      dataIndex: 'userPhone',
      key: 'userPhone',
      render: (row, record) => {
        return record.userPhone || '--';
      }
    },
    {
      title: 'saler',
      align: 'center',
      dataIndex: 'salerName',
      key: 'salerName',
      render: (row, record) => {
        return record.salerName || '--';
      }
    },
  ];

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        导出订单
      </Button>
      <Drawer
        title={`Export Order`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='center'>
            <Button type='primary' key='export' onClick={handleExport}>
              导出订单
            </Button>
          </Flex>
        }
      >
        <Descriptions
          title={`Order Summary`}
          size='small'
          bordered
          items={dataSource}
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`Order List`}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Table
                dataSource={dataList}
                columns={columns as any}
                rowKey={(record) => record.orderSn}
                pagination={false}
                scroll={{ x: 'max-content' }}
                size='small'
              />
            </div>
          }
        />
      </Drawer>
    </>
  );

};

export default memo(ExportOrder);
