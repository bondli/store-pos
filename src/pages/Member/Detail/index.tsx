import React, { memo, useState, useEffect } from 'react';
import { Button, Drawer, Descriptions, message } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';

import Box from '@/components/Box';

import orderColumns from './order';

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

  const getUserOrders = () => {
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
              children: memberInfo.name,
            }, {
              key: '3',
              label: 'birthday',
              children: memberInfo.birthday,
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
            }]
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
          content={'asdasdasd'}
        />
        <Box
          title={`User Balance`}
          content={'asdasdasd'}
        />
      </Drawer>
    </>
  );

};

export default memo(Detail);
