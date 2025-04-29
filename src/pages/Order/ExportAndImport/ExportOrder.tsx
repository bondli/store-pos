import React, { memo, useState, useContext } from 'react';
import { Button, Descriptions, Drawer, Flex, Table, App } from 'antd';
import dayjs from 'dayjs';

import language from '@/common/language';
import { MainContext } from '@/common/context';
import request from '@/common/request';
import { PAY_CHANNEL, PaymentChannelStats } from '@common/constant';
import { getStore } from '@common/electron';
import Box from '@/components/Box';

type ComProps = {
  dataList: any[];
};

const ExportOrder: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { dataList } = props;
  const { currentLang } = useContext(MainContext);

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    const userInfo = getStore('loginData') || {};
    // 只有管理员才有权限导入订单
    if (userInfo?.id !== 1) {
      message.error(`你没有权限执行订单的导入`);
      return;
    }
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
      label: language[currentLang].order.detailActual,
      children: orderActualAmount,
    },
    {
      key: '2',
      label: language[currentLang].order.detailOrderCount,
      children: orderCount,
    },
    {
      key: '3',
      label: language[currentLang].order.detailItemCount,
      children: itemCount,
    },
    {
      key: '4',
      label: language[currentLang].order.detailPayChannelAlipay,
      children: payChannel.alipay || '--',
    },
    {
      key: '5',
      label: language[currentLang].order.detailPayChannelWeixin,
      children: payChannel.weixin || '--',
    },
    {
      key: '6',
      label: language[currentLang].order.detailPayChannelCash,
      children: payChannel.cash || '--',
    },
    {
      key: '7',
      label: language[currentLang].order.detailPayChannelCard,
      children: payChannel.card || '--',
    },
    {
      key: '8',
      label: language[currentLang].order.detailPayChannelOther,
      children: payChannel.other || '--',
    },
  ];

  const columns = [
    {
      title: language[currentLang].order.tableColumnOrderNo,
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnItems,
      align: 'center',
      key: 'orderItems',
      dataIndex: 'orderItems',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnActual,
      align: 'center',
      dataIndex: 'orderActualAmount',
      key: 'orderActualAmount',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnPayment,
      align: 'center',
      dataIndex: 'payType',
      key: 'payType',
      render: (row, record) => {
        return PAY_CHANNEL[record.payType] || 'unknown';
      }
    },
    {
      title: language[currentLang].order.tableColumnUser,
      align: 'center',
      dataIndex: 'userPhone',
      key: 'userPhone',
      render: (row, record) => {
        return record.userPhone || '--';
      }
    },
    {
      title: language[currentLang].order.tableColumnSaler,
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
        {language[currentLang].order.exportOrderBtn}
      </Button>
      <Drawer
        title={language[currentLang].order.exportOrder}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='right'>
            <Button type='primary' key='export' onClick={handleExport}>
              {language[currentLang].order.exportOrderSubmit}
            </Button>
          </Flex>
        }
      >
        <Descriptions
          title={language[currentLang].order.orderSummary}
          size='small'
          bordered
          items={dataSource}
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={language[currentLang].order.orderList}
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
