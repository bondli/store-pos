import React, { memo, useRef } from 'react';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';
import { Space } from 'antd';

import { userLog } from '@/common/electron';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns';
import NewJoin from './NewJoin';
import Recharge from './Recharge';

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

const MemberPage: React.FC = () => {
  const tableRef = useRef<TableContext>(null);

  const getMemberList = (t) => {
    userLog('request member list params:', t);
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
      <PageTitle text={`Members`} />
      <TableRender
        ref={tableRef}
        search={search}
        request={getMemberList as any}
        columns={columns as ProColumnsType}
        title={`Query Results of Members`}
        scroll={{ x: 'max-content' }}
        toolbarRender={ 
          <Space>
            <Recharge />
            <NewJoin />
          </Space>
        }
      />
    </div>
  );

};

export default memo(MemberPage);
