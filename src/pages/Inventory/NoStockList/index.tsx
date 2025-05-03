import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';

import TableRender from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import columns from './columns';

const NoStockList: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 查询断码的商品列表
  const getNoStockList = async (t) => {
    userLog('request no stock list params:', t);
    try {
      const response = await request.get('/inventory/getNoStockList', {
        params: t,
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询断码列表失败');
    }
  };

  return (
    <>
      <Button
        type='default'
        onClick={togglePanel}
      >
        {language[currentLang].inventory.noStockListAction}
      </Button>
      <Drawer
        title={`${language[currentLang].inventory.noStockList}`}
        width={1000}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <TableRender
          request={getNoStockList as any}
          columns={columns as ProColumnsType}
          pagination={{
            showSizeChanger: true,
          }}
          scroll={{ x: 'max-content' }}
          size='small'
        />
      </Drawer>
    </>
  );

};

export default memo(NoStockList);
