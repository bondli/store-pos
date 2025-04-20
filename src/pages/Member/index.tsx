import React, { memo, useRef, useContext } from 'react';
import { Button, App } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import PageTitle from '@/components/PageTitle';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import search from './search';
import columns from './columns';
import NewJoin from './NewJoin';

import style from './index.module.less';

const MemberPage: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

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
      <PageTitle text={`${language[currentLang].member.title}`} />
      <TableRender
        ref={tableRef}
        search={search}
        request={getMemberList as any}
        columns={columns as ProColumnsType}
        title={`${language[currentLang].member.tableTitle}`}
        scroll={{ x: 'max-content' }}
        toolbarRender={
          <>
            <Button onClick={refreshData}><RedoOutlined />{language[currentLang].member.refresh}</Button>
            <NewJoin callback={refreshData} />
          </>
        }
      />
    </div>
  );

};

export default memo(MemberPage);
