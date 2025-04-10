import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, Descriptions, App } from 'antd';
import dayjs from 'dayjs';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import Box from '@/components/Box';

import couponColumns from './coupon';

const MARKETING_TYPE_MAP = {
  'full_send': '满送活动',
  'full_reduce': '满减活动',
  'full_gift': '买赠活动',
} as const;

type ComProps = {
  id: number;
};

  const defaultMarketingInfo = {
  marketingName: '',
  marketingDesc: '',
  marketingType: '',
  startTime: '',
  endTime: '',
};

const Detail: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { id } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [marketingInfo, setMarketingInfo] = useState(defaultMarketingInfo);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 获取sku信息
  const getCouponDetail = async () => {
    userLog('request coupon detail params:', id);
    try {
      const response = await request.get('/marketing/queryDetail', {
        params: {
          id,
        },
      });
      const result = response.data;
      if (!result.error) {
        setMarketingInfo(result);
      }

    } catch (error) {
      message.error('查询营销活动失败');
    }
  };

  // 通过 活动id 获取下属所有优惠券列表
  const getCouponList = async () => {
    userLog('request coupon list params:', id);
    try {
      const response = await request.get('/marketing/queryCouponList', {
        params: {
          id,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询营销活动失败');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getCouponDetail();
    }
  }, [showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        detail
      </Button>
      <Drawer
        title={`Marketing Detail`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Descriptions
          title={`Marketing Info`}
          bordered
          items={
            [{
              key: '1',
              label: 'name',
              children: marketingInfo.marketingName,
            },
            {
              key: '2',
              label: 'description',
              children: marketingInfo.marketingDesc,
            },
            {
              key: '3',
              label: 'type',
              children: MARKETING_TYPE_MAP[marketingInfo.marketingType as keyof typeof MARKETING_TYPE_MAP] || marketingInfo.marketingType,
            },
            {
              key: '4',
              label: 'start time',
              children: dayjs(marketingInfo.startTime).format('YYYY/MM/DD'),
            },
            {
              key: '5',
              label: 'end time',
              children: dayjs(marketingInfo.endTime).format('YYYY/MM/DD'),
            }]
          }
          column={1}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`The Marketing's Coupon List`}  
          content={
            <TableRender
              request={getCouponList as any}
              columns={couponColumns as ProColumnsType}
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
