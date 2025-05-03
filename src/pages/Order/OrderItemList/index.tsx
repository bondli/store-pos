import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';

import dayjs from 'dayjs';
import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';
import { userLog } from '@/common/electron';

import search from './search';
import columns from './columns';

const OrderItemList: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const getOrderItemList = async (t) => {
    userLog('request order item list params:', t);
    try {
      if (!t.start || !t.end) {
        t.start = dayjs().format('YYYY-MM-DD');
        t.end = dayjs().format('YYYY-MM-DD');
      }
      const response = await request.get('/order/queryOrderItemListByDate', {
        params: t,
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询订单商品失败');
    }
  };

  return (
    <>
      <Button
        type='default'
        onClick={togglePanel}
      >
        {language[currentLang].order.orderItemListAction}
      </Button>
      <Drawer
        title={language[currentLang].order.orderItemList}
        width={1000}
        open={showPanel}
        onClose={closePanel}
        destroyOnClose={true}
      >
        <TableRender
          search={search}
          request={getOrderItemList as any}
          columns={columns as ProColumnsType}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            hideOnSinglePage: true,
            showTotal: (total, range) => `${language[currentLang].common.total}: ${total}`,
          }}
        />
      </Drawer>
    </>
  );

};

export default memo(OrderItemList);
