import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, Descriptions, App } from 'antd';
import dayjs from 'dayjs';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import Box from '@/components/Box';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import useCouponColumns from './coupon';

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
  const { currentLang } = useContext(MainContext);

  const { id } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [marketingInfo, setMarketingInfo] = useState(defaultMarketingInfo);

  const couponColumns = useCouponColumns();
  
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
        {language[currentLang].marketing.detailAction}
      </Button>
      <Drawer
        title={`${language[currentLang].marketing.detailTitle}`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
      >
        <Descriptions
          title={`${language[currentLang].marketing.marketingInfo}`}
          bordered
          items={
            [{
              key: '1',
              label: language[currentLang].marketing.marketingName,
              children: marketingInfo.marketingName,
            },
            {
              key: '2',
              label: language[currentLang].marketing.marketingDesc,
              children: marketingInfo.marketingDesc,
            },
            {
              key: '3',
              label: language[currentLang].marketing.marketingType,
              children: MARKETING_TYPE_MAP[marketingInfo.marketingType as keyof typeof MARKETING_TYPE_MAP] || marketingInfo.marketingType,
            },
            {
              key: '4',
              label: language[currentLang].marketing.marketingStartTime,
              children: dayjs(marketingInfo.startTime).format('YYYY/MM/DD'),
            },
            {
              key: '5',
              label: language[currentLang].marketing.marketingEndTime,
              children: dayjs(marketingInfo.endTime).format('YYYY/MM/DD'),
            }]
          }
          column={1}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`${language[currentLang].marketing.marketingCouponList}`}  
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
