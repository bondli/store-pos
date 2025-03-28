import React, { memo, useRef } from 'react';
import { message, Space } from 'antd';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns';
import NewJoin from './NewJoin';
import Recharge from './Recharge';

import style from './index.module.less';

const MemberPage: React.FC = () => {
  const tableRef = useRef<TableContext>(null);

  const getMemberList = async (t) => {
    userLog('request member list params:', t);
    try {
      const response = await request.get('/member/list', {
        params: t,
      });
      const result = response.data;
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询会员失败');
    }
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
            <Recharge callback={refreshData} />
            <NewJoin callback={refreshData} />
          </Space>
        }
      />
    </div>
  );

};

export default memo(MemberPage);
