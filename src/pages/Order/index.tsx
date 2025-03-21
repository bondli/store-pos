import React, { memo, useState, useRef } from 'react';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';
import { Space } from 'antd';
import PageTitle from '@/components/PageTitle';

import search from './search';
import columns from './columns';
import Summary from './Summary';
import CheckBill from './CheckBill';

import style from './index.module.less';

const dataSource = [];
for (let i = 0; i < 60; i++) {
  dataSource.push({
    orderSn: '20250319001',
    orderStatus: i % 2 === 0 ? 'uncheck' : 'checked',
    orderItems: i,
    orderActual: 100,
    orderAmount: 100,
    payType: 'alipay',
    userPhone: '13800000000',
    salerName: 'John Doe',
    createdAt: new Date().getTime(),
  });
}

const OrderPage: React.FC = () => {
  const tableRef = useRef<TableContext>(null);
  const [dataList, setDataList] = useState([]);
  
  const getOrderList = (t) => {
    console.log(t);
    setDataList(dataSource);
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
      <PageTitle text={`Orders`} />
      <TableRender
        ref={tableRef}
        search={search}
        request={getOrderList as any}
        columns={columns as ProColumnsType}
        title={`Query Results of Orders`}
        scroll={{ x: 'max-content' }}
        toolbarRender={ 
          <Space>
            <Summary />
            <CheckBill dataList={dataList} callback={refreshData} />
          </Space>
        }
      />
    </div>
  );

};

export default memo(OrderPage);
