import React, { memo, useState, useRef } from 'react';
import { Button, App } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns';
import Summary from './Summary';
import CheckBill from './CheckBill';
import QueryBySKU from './QueryBySKU';

import style from './index.module.less';

const OrderPage: React.FC = () => {
  const { message } = App.useApp();

  const tableRef = useRef<TableContext>(null);
  const [dataList, setDataList] = useState([]);

  const getOrderList = async (t) => {
    userLog('request order list params:', t);
    try {
      const response = await request.get('/order/queryList', {
        params: t,
      });
      const result = response.data;
      setDataList(result.data);
      return {
        data: result.data,
        total: result.count,
      };
    } catch (error) {
      message.error('查询订单失败');
    }
  };

  const refreshData = () => {
    tableRef.current?.refresh();
  };

  return (
    <div className={style.container}>
      <PageTitle
        text={`Orders`}
        extra={
          <QueryBySKU />
        }
      />
      <TableRender
        ref={tableRef}
        search={search}
        request={getOrderList as any}
        columns={columns as ProColumnsType}
        title={`Query Results of Orders`}
        scroll={{ x: 'max-content' }}
        toolbarRender={ 
          <>
            <Button onClick={refreshData}><RedoOutlined />Refresh</Button>
            <Summary dataList={dataList} />
            <CheckBill dataList={dataList} callback={refreshData} />
          </>
        }
      />
    </div>
  );

};

export default memo(OrderPage);
