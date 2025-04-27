import React, { memo, useRef, useContext, useState } from 'react';
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
import BitchStock from './BitchStock';
import SingleStock from './SingleStock';

import style from './index.module.less';

const InventroyPage: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const [total, setTotal] = useState(0);

  const tableRef = useRef<TableContext>(null);

  const getInventroyList = async (t) => {
    userLog('request inventroy list params:', t);
    try {
      const response = await request.get('/inventory/queryList', {
        params: t,
      });
      const result = response.data;
      setTotal(result.count);
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
      <PageTitle
        text={`${language[currentLang].inventory.title}`}
        extra={
          <BitchStock callback={refreshData} />
        }
      />
      <TableRender
        ref={tableRef}
        search={search}
        request={getInventroyList as any}
        columns={columns as ProColumnsType}
        title={`${language[currentLang].inventory.tableTitle}`}
        scroll={{ x: 'max-content' }}
        pagination={{
          total,
          showTotal: (total, range) => `${language[currentLang].common.total}: ${total}`,
        }}
        toolbarRender={ 
          <>
            <Button onClick={refreshData}><RedoOutlined />{language[currentLang].inventory.refresh}</Button>
            <SingleStock callback={refreshData} />
          </>
        }
      />
    </div>
  );

};

export default memo(InventroyPage);
