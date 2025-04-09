import React, { memo, useRef } from 'react';
import { Button, App } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns'; 
import NewMarketing from './NewMarketing';

import style from './index.module.less';

const MarketingPage: React.FC = () => {
  const { message } = App.useApp();

  const tableRef = useRef<TableContext>(null);

  const getMemberList = async (t) => {
    userLog('request marketing list params:', t);
    try {
      const response = await request.get('/marketing/list', {
        params: t,
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

  const refreshData = () => {
    tableRef.current?.refresh();
  };

  return (
    <div className={style.container}>
      <PageTitle text={`Marketing`} />
      <TableRender
        ref={tableRef}
        search={search}
        request={getMemberList as any}
        columns={columns as ProColumnsType}
        title={`Query Results of Marketing`}
        scroll={{ x: 'max-content' }}
        toolbarRender={
          <>
            <Button onClick={refreshData}><RedoOutlined />Refresh</Button>
            <NewMarketing callback={refreshData} />
          </>
        }
      />
    </div>
  );

};

export default memo(MarketingPage);
