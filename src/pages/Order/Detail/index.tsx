import React, { memo, useState } from 'react';
import { Button, Drawer, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';

import Box from '@/components/Box';

import itemColumns from './item';

type ComProps = {
  orderSn: string;
};

const Detail: React.FC<ComProps> = (props) => {
  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Telephone',
      children: orderSn,
    },
    {
      key: '2',
      label: 'user name',
      children: '1810000000',
    },
    {
      key: '3',
      label: 'brithday',
      children: '2012/02/02',
    },
    {
      key: '4',
      label: 'points',
      children: '1000',
    },
    {
      key: '5',
      label: 'balance',
      children: '0.00',
    },
  ];

  const getOrderItems = () => {
    const dataSource = [];
    for (let i = 0; i < 6; i++) {
      dataSource.push({
        orderSn: '20250319001',
        orderStatus: i % 2 === 0 ? 'uncheck' : 'checked',
        orderItems: i,
        orderActual: 100,
        orderAmount: 100,
        payType: 'alipay',
        salerName: 'John Doe',
        createdAt: new Date().getTime(),
      });
    }
    return {
      data: dataSource,
      total: dataSource.length
    };
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
          items={items}
          column={1}
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
      </Drawer>
    </>
  );

};

export default memo(Detail);
