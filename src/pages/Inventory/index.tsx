import React, { memo, useRef } from 'react';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';
import { Space } from 'antd';

import { userLog } from '@/common/electron';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns';
import BitchStock from './BitchStock';
import SingleStock from './SingleStock';

import style from './index.module.less';

const dataSource = [];
for (let i = 0; i < 60; i++) {
  dataSource.push({
    userId: 20250319001,
    userPoint: 1000,
    userAmount: 100,
    userPhone: '13800000000',
    userName: 'John Doe',
    userBalance: 100,
    userBirthday: '1990-01-01',
    createdAt: new Date().getTime(),
  });
}

const InventroyPage: React.FC = () => {
  const tableRef = useRef<TableContext>(null);

  const getInventroyList = (t) => {
    userLog('request inventroy list params:', t);
    return {
      data: dataSource,
      total: dataSource.length
    };
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
            <BitchStock />
            <SingleStock />
          </Space>
        }
      />
    </div>
  );

};

export default memo(InventroyPage);
