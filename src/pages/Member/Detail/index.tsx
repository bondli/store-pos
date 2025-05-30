import React, { memo, useState, useEffect, useContext } from 'react';
import { Button, Drawer, Descriptions, App } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import Box from '@/components/Box';

import useOrderColumns from './order';
import usePointColumns from './point';
import useBalanceColumns from './balance';
import useCouponColumns from './coupon';

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
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { userPhone } = props;

  const orderColumns = useOrderColumns();
  const pointColumns = usePointColumns();
  const balanceColumns = useBalanceColumns();
  const couponColumns = useCouponColumns();

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
        {language[currentLang].member.detailAction}
      </Button>
      <Drawer
        title={`${language[currentLang].member.detailTitle}`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
      >
        <Descriptions
          title={`${language[currentLang].member.detailUserInfo}`}
          bordered
          items={
            [{
              key: 'phone',
              label: language[currentLang].member.tableColumnPhone,
              children: userPhone,
            }, {
              key: 'name',
              label: language[currentLang].member.tableColumnName,
              children: memberInfo.name || '--',
            }, {
              key: 'birthday',
              label: language[currentLang].member.tableColumnBirthday,
              children: memberInfo.birthday || '--',
            }, {
              key: 'actual',
              label: language[currentLang].member.tableColumnActual,
              children: memberInfo.actual,
            }, {
              key: 'point',
              label: language[currentLang].member.tableColumnPoints,
              children: memberInfo.point,
            }, {
              key: 'balance',
              label: language[currentLang].member.tableColumnBalance,
              children: memberInfo.balance,
            }, {
              key: 'coupon',
              label: language[currentLang].member.tableColumnCoupon,
              children: memberInfo.coupon,
            },]
          }
          column={2}
          size='small'
          style={{ marginBottom: '24px' }}
        />

        <Box
          title={`${language[currentLang].member.detailUserOrder}`}
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
          title={`${language[currentLang].member.detailUserPoint}`}
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
          title={`${language[currentLang].member.detailUserBalance}`}
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
          title={`${language[currentLang].member.detailUserCoupon}`}
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
