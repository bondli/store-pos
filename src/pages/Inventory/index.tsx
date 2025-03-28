import React, { memo, useRef } from 'react';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';
import { message, Space } from 'antd';

import { userLog } from '@/common/electron';
import request from '@common/request';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns';
import BitchStock from './BitchStock';
import SingleStock from './SingleStock';

import style from './index.module.less';

const InventroyPage: React.FC = () => {
  const tableRef = useRef<TableContext>(null);

  const getInventroyList = async (t) => {
    userLog('request inventroy list params:', t);
    try {
      const response = await request.get('/inventory/queryList', {
        params: t,
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

  const refreshData = () => {
    tableRef.current?.refresh();
  };

  return (
    <div className={style.container}>
      <PageTitle text={`Inventroys`} />
      <TableRender
        ref={tableRef}
        search={search}
        request={getInventroyList as any}
        columns={columns as ProColumnsType}
        title={`Query Results of Inventroys`}
        scroll={{ x: 'max-content' }}
        toolbarRender={ 
          <Space>
            <BitchStock callback={refreshData} />
            <SingleStock callback={refreshData} />
          </Space>
        }
      />
    </div>
  );

};

export default memo(InventroyPage);
