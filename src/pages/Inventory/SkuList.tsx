import React, { memo, useEffect, useState, useContext } from 'react';
import { Descriptions, App } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog, getStore } from '@/common/electron';
import request from '@common/request';
import Box from '@/components/Box';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import skuColumns from './skuColumns';

type ComProps = {
  sku: string;
  sn: string;
};

const defaultItemInfo = {
  sn: '',
  name: '',
  brand: '',
  sku: '',
  size: '',
  color: 0,
  originalPrice: 0,
  costPrice: 0,
  counts: 0,
};

const SkuList: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { sku, sn } = props;

  const [itemInfo, setItemInfo] = useState(defaultItemInfo);
  const userInfo = getStore('loginData') || {};

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
    if (sku && sn) {
      getItemDetail();
      // getSkusByStyleNo();
    }
  }, [sku, sn]);

  return (
    <>
      <Descriptions
        title={`${language[currentLang].inventory.itemInfo}`}
        bordered
        items={
          [{
            key: 'name',
            label: language[currentLang].inventory.tableColumnName,
            children: itemInfo.name,
          },
          {
            key: 'brand',
            label: language[currentLang].inventory.tableColumnBrand,
            children: itemInfo.brand,
          },
          {
            key: 'sn',
            label: language[currentLang].inventory.tableColumnStyleNo,
            children: itemInfo.sn,
          },
          {
            key: 'sku',
            label: language[currentLang].inventory.tableColumnSku,
            children: itemInfo.sku,
          },
          {
            key: 'color',
            label: language[currentLang].inventory.tableColumnColor,
            children: itemInfo.color,
          },
          {
            key: 'size',
            label: language[currentLang].inventory.tableColumnSize,
            children: itemInfo.size,
          },
          {
            key: 'originalPrice',
            label: language[currentLang].inventory.tableColumnOriginalPrice,
            children: itemInfo.originalPrice,
          },
          {
            key: 'costPrice',
            label: language[currentLang].inventory.tableColumnCostPrice,
            children: userInfo?.id === 1 ? itemInfo.costPrice : '**',
          },
          {
            key: 'counts',
            label: language[currentLang].inventory.tableColumnCounts,
            children: itemInfo.counts,
          }]
        }
        column={2}
        size='small'
        style={{ marginBottom: '24px' }}
      />

      <Box
        title={`${language[currentLang].inventory.skuList}`}
        content={
          <TableRender
            request={getSkusByStyleNo as any}
            columns={skuColumns as ProColumnsType}
            pagination={{
              pageSize: 100,
              showSizeChanger: true,
              showTotal: (total, range) => `${language[currentLang].common.total}: ${total}`,
            }}
            scroll={{ x: 'max-content' }}
            size='small'
          />
        }
      />
    </>
  );

};

export default memo(SkuList);
