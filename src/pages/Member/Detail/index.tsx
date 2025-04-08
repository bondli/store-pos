import React, { memo, useState, useEffect } from 'react';
import { Button, Drawer, Descriptions, message } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';

import Box from '@/components/Box';

import orderColumns from './order';
import pointColumns from './point';
import balanceColumns from './balance';
import couponColumns from './coupon';

type ComProps = {
  userPhone: string;
};
const defaultMemberInfo = {
  phone: '',
  name: '',
  birthday: '',
  actual: 0,
  point: 0,
  balance: 0,
  coupon: 0,
};

const Detail: React.FC<ComProps> = (props) => {
  const { userPhone } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [memberInfo, setMemberInfo] = useState(defaultMemberInfo);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 获取用户信息
  const getMemberDetail = async () => {
    userLog('request member detail params:', userPhone);
    try {
      const response = await request.get('/member/detail', {
        params: {
          phone: userPhone,
        },
      });
      const result = response.data;
      if (!result.error) {
        setMemberInfo(result);
      }

    } catch (error) {
      message.error('查询会员失败');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getMemberDetail();
    }
  }, [showPanel]);

  // 查询会员订单
  const getUserOrders = async (t) => {
    userLog('request order list by user phone params:', t);
    try {
      const response = await request.get('/order/queryList', {
        params: {
          ...t,
          userPhone,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询会员订单失败');
    }
  };

  // 获取用户积分流水
  const getPointRecords = async (t) => {
    userLog('request point list by user phone params:', t);
    try {
      const response = await request.get('/member/queryScoreList', {
        params: {
          ...t,
          phone: userPhone,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询会员余额失败');
    }
  };

  // 获取用户余额流水
  const getBalanceRecords = async (t) => {
    userLog('request balance list by user phone params:', t);
    try {
      const response = await request.get('/member/queryBalanceList', {
        params: {
          ...t,
          phone: userPhone,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询会员积分失败');
    }
  };

  // 获取用户优惠券流水
  const getCouponRecords = async (t) => {
    userLog('request coupon list by user phone params:', t);
    try {
      const response = await request.get('/member/queryCouponList', {
        params: {
          ...t,
          phone: userPhone,
        },
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询会员优惠券失败');
    }
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
        title={`Member Detail`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Descriptions
          title={`User Info`}
          bordered
          items={
            [{
              key: '1',
              label: 'Telephone',
              children: userPhone,
            }, {
              key: '2',
              label: 'user name',
              children: memberInfo.name || '--',
            }, {
              key: '3',
              label: 'birthday',
              children: memberInfo.birthday || '--',
            }, {
              key: '4',
              label: 'order actual',
              children: memberInfo.actual,
            }, {
              key: '5',
              label: 'points',
              children: memberInfo.point,
            }, {
              key: '6',
              label: 'balance',
              children: memberInfo.balance,
            }, {
              key: '7',
              label: 'coupon',
              children: memberInfo.coupon,
            },]
          }
          column={1}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`User Order`}
          content={
            <TableRender
              request={getUserOrders as any}
              columns={orderColumns as ProColumnsType}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          }
        />
        <Box
          title={`User Point`}
          content={
            <TableRender
              request={getPointRecords as any}
              columns={pointColumns as ProColumnsType}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          }
        />
        <Box
          title={`User Balance`}
          content={
            <TableRender
              request={getBalanceRecords as any}
              columns={balanceColumns as ProColumnsType}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          }
        />

        <Box
          title={`User Coupon`}
          content={
            <TableRender
              request={getCouponRecords as any}
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
