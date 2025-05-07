import React, { memo, useState, useRef, useContext } from 'react';
import { Button, App } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TableRender, { TableContext } from 'table-render';
import type { ProColumnsType } from 'table-render';

import { userLog, getStore, setStore } from '@/common/electron';
import request from '@common/request';
import PageTitle from '@/components/PageTitle';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import search from './search';
import columns from './columns';
import Summary from './Summary';
import OrderItemList from './OrderItemList';
import CheckBill from './CheckBill';
import QueryBySKU from './QueryBySKU';
import ExportAndImport from './ExportAndImport';

import style from './index.module.less';

const OrderPage: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const userInfo = getStore('loginData') || {};
  const tableRef = useRef<TableContext>(null);
  const [dataList, setDataList] = useState([]);

  const getOrderList = async (t) => {
    userLog('request order list params:', t);
    try {
      if (!t.start || !t.end) {
        t.start = dayjs().format('YYYY-MM-DD');
        t.end = dayjs().format('YYYY-MM-DD');
      }
      const showStatus = getStore('orderShowStatus');
      if (showStatus === 'hidden') {
        t.showStatus = 'hidden';
      }
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

  // 点击表格标题的时候切换到隐藏订单
  const handleTableTitleClick = () => {
    const showStatus = getStore('orderShowStatus') || 'all';
    if (showStatus === 'all') {
      setStore('orderShowStatus', 'hidden');
    } else {
      setStore('orderShowStatus', 'all');
    }
    tableRef.current?.refresh();
  };

  return (
    <div className={style.container}>
      <PageTitle
        text={language[currentLang].order.title}
        extra={
          <QueryBySKU />
        }
      />
      <TableRender
        ref={tableRef}
        search={search}
        request={getOrderList as any}
        columns={columns as ProColumnsType}
        title={
          <div>
            <span onClick={handleTableTitleClick} style={{ color: getStore('orderShowStatus') === 'all' ? '#666' : 'inherit' }}>
              {language[currentLang].order.tableTitle}
            </span>
            <Summary dataList={dataList} />
          </div>
        }
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 100,
          showSizeChanger: true,
          showTotal: (total, range) => `${language[currentLang].common.total}: ${total}`,
        }}
        toolbarRender={ 
          <>
            <Button onClick={refreshData}><RedoOutlined />{language[currentLang].order.refresh}</Button>
            <OrderItemList />
            <CheckBill dataList={dataList} callback={refreshData} />
            {
              userInfo?.id === 1 && (
                <ExportAndImport dataList={dataList} callback={refreshData} />
              )
            }
          </>
        }
      />
    </div>
  );

};

export default memo(OrderPage);
