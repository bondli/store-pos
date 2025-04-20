import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, Descriptions, App } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import Box from '@/components/Box';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import skuColumns from './sku';

type ComProps = {
  sku: string;
  sn: string;
};

const defaultItemInfo = {
  sn: '',
  name: '',
  sku: '',
  size: '',
  color: 0,
  originalPrice: 0,
  counts: 0,
};

const Detail: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { sku, sn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [itemInfo, setItemInfo] = useState(defaultItemInfo);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 获取sku信息
  const getItemDetail = async () => {
    userLog('request item detail params:', sku);
    try {
      const response = await request.get('/inventory/queryDetailBySku', {
        params: {
          sku,
        },
      });
      const result = response.data;
      if (!result.error) {
        setItemInfo(result);
      }

    } catch (error) {
      message.error('查询库存失败');
    }
  };

  // 通过 款号 获取下属所有 SKU 列表
  const getSkusByStyleNo = async () => {
    userLog('request sku list by sn params:', sn);
    try {
      const response = await request.get('/inventory/queryByStyle', {
        params: {
          sn,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询库存失败');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getItemDetail();
      getSkusByStyleNo();
    }
  }, [showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].inventory.detail}
      </Button>
      <Drawer
        title={`${language[currentLang].inventory.detail}`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Descriptions
          title={`${language[currentLang].inventory.itemInfo}`}
          bordered
          items={
            [{
              key: '1',
              label: 'name',
              children: itemInfo.name,
            },
            {
              key: '2',
              label: 'style no',
              children: itemInfo.sn,
            },
            {
              key: '3',
              label: 'sku',
              children: itemInfo.sku,
            },
            {
              key: '4',
              label: 'color',
              children: itemInfo.color,
            },
            {
              key: '5',
              label: 'size',
              children: itemInfo.size,
            },
            {
              key: '5',
              label: 'original',
              children: itemInfo.originalPrice,
            },
            {
              key: '5',
              label: 'counts',
              children: itemInfo.counts,
            }]
          }
          column={1}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`${language[currentLang].inventory.skuList}`}
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
