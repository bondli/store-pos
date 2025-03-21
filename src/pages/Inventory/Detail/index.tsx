import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import Box from '@/components/Box';

import skuColumns from './sku';

type ComProps = {
  sku: string;
  sn: string;
};

const Detail: React.FC<ComProps> = (props) => {
  const { sku, sn } = props;

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'name',
      children: '连衣裙',
    },
    {
      key: '2',
      label: 'style no',
      children: '1810000000',
    },
    {
      key: '3',
      label: 'sku',
      children: '2012/02/02',
    },
    {
      key: '4',
      label: 'color',
      children: 'red',
    },
    {
      key: '5',
      label: 'size',
      children: '90',
    },
    {
      key: '5',
      label: 'original',
      children: '0.00',
    },
    {
      key: '5',
      label: 'counts',
      children: '2',
    },
  ];

  // 通过 款号 获取下属所有 SKU 列表
  const getSkusByStyleNo = () => {
    const dataSource = [];
    for (let i = 0; i < 6; i++) {
      dataSource.push({
        orderSn: '20250319001',
        orderStatus: i % 2 === 0 ? 'uncheck' : 'checked',
        orderItems: i,
        orderActual: 100,
        orderAmount: 100,
        payType: 'alipay',
        userPhone: '13800000000',
        salerName: 'John Doe',
        createdAt: new Date().getTime(),
      });
    }
    return {
      data: dataSource,
      total: dataSource.length
    };
  };

  useEffect(() => {
    // todo:发请求获取数据，该 SKU 的详情，该 SKU 对应的款号下面的更多 SKU 列表
  }, [sku, sn]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        detail
      </Button>
      <Drawer
        title={`Inventory Detail`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Descriptions
          title="Item Info"
          bordered
          items={items}
          column={1}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`The Style's SKU List`}
          content={
            <TableRender
              request={getSkusByStyleNo as any}
              columns={skuColumns as ProColumnsType}
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
