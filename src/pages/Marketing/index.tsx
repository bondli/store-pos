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

import useSearch from './search';
import useColumns from './columns'; 
import NewMarketing from './NewMarketing';

import style from './index.module.less';

const MarketingPage: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang, userInfo } = useContext(MainContext);

  const search = useSearch();
  const columns = useColumns();

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
      <PageTitle text={`${language[currentLang].marketing.title}`} />
      <TableRender
        ref={tableRef}
        search={search}
        request={getMemberList as any}
        columns={columns as ProColumnsType}
        title={`${language[currentLang].marketing.tableTitle}`}
        scroll={{ x: 'max-content' }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => `${language[currentLang].common.total}: ${total}`,
        }}
        toolbarRender={
          <>
            <Button onClick={refreshData}><RedoOutlined />{language[currentLang].marketing.refresh}</Button>
            {
              userInfo?.role === 'admin' ? <NewMarketing callback={refreshData} /> : null
            }
          </>
        }
      />
    </div>
  );

};

export default memo(MarketingPage);
