import React, { memo, useState, useRef } from 'react';
import { App, Button, Drawer, Input, Table } from 'antd';
import dayjs from 'dayjs';

import request from '@/common/request';
import { BarcodeOutlined, CopyOutlined } from '@ant-design/icons';

const QueryBySKU: React.FC = () => {
  const { message } = App.useApp();

  const [showPanel, setShowPanel] = useState(false);
  const [dataList, setDataList] = useState([]);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const debounceTimer = useRef<number>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
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
      title: 'item count',
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
        query order by sku code
      </Button>
      <Drawer
        title='Query Order by SKU Code'
        width={700}
        open={showPanel}
        onClose={closePanel}
        destroyOnClose={true}
      >
        <Input prefix={<BarcodeOutlined />}  placeholder='input sku code' onChange={handleChange} autoFocus />

        <div style={{ marginTop: 24 }}>
          {dataList.length > 0 && (
            <Table
              rowKey={(record) => record.orderSn}
              title={() => <span style={{ fontSize: 16, fontWeight: 600 }}>Order List</span>}
              dataSource={dataList}
              columns={columns as any}
              pagination={false}
            />
          )}
        </div>
      </Drawer>
    </>
  );

};

export default memo(QueryBySKU);
