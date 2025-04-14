import React, { memo, useState, useRef } from 'react';
import { App, Button, Drawer, Input, Table } from 'antd';
import { CopyOutlined, ScanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import request from '@/common/request';
import Box from '@/components/Box';

const QueryBySKU: React.FC = () => {
  const { message } = App.useApp();

  const [showPanel, setShowPanel] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [scanSkuCode, setScanSkuCode] = useState('');

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const debounceTimer = useRef<number>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    // 更新输入框的值
    setScanSkuCode(value);

    if (!value) {
      return;
    }

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      request.get('/order/queryBySku', {
        params: {
          sku: value,
        },
      }).then((response: any) => {
        const result = response.data;
        if (result.error) {
          message.error(result.error);
        } else {
          setDataList(result.data);
        }
        // 清除输入框的值
        setScanSkuCode('');
      }).catch((error: any) => {
        message.error('查询失败');
      });
    }, 300);
  };

  const columns = [
    {
      title: 'order code',
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
      render: (text: string) => {
        // 复制
        const handleCopy = () => {
          navigator.clipboard.writeText(text);
          message.success('复制成功');
        };

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {text}
            <CopyOutlined onClick={handleCopy} style={{ cursor: 'pointer', color: '#1890ff', marginLeft: 4 }} />
          </div>
        );
      },
    },
    {
      title: 'order time',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'actual',
      align: 'center',
      dataIndex: 'orderActualAmount',
      key: 'orderActualAmount',
    },
    {
      title: 'user',
      align: 'center',
      dataIndex: 'userPhone',
      key: 'userPhone',
    },
    {
      title: 'items',
      align: 'center',
      dataIndex: 'orderItems',
      key: 'orderItems',
    },
  ];

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        Query Order by Sku Code
      </Button>
      <Drawer
        title='Query Order by Sku Code'
        width={700}
        open={showPanel}
        onClose={closePanel}
        destroyOnClose={true}
      >
        <Input
          prefix={<ScanOutlined />} 
          placeholder='scan sku code'
          onChange={handleChange}
          autoFocus
          value={scanSkuCode}
        />

        <div style={{ marginTop: 24 }}>
          <Box
            title={`Order List`}
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
                <Table
                  rowKey={(record) => record.orderSn}
                  dataSource={dataList}
                  columns={columns as any}
                  pagination={false}
                />
              </div>
            }
          />
        </div>
      </Drawer>
    </>
  );

};

export default memo(QueryBySKU);
function setScanSkuCode(arg0: string) {
  throw new Error('Function not implemented.');
}

