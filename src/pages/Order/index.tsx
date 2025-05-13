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

import useSearch from './search';
import useColumns from './columns';
import Summary from './Summary';
import OrderItemList from './OrderItemList';
import CheckBill from './CheckBill';
import QueryBySKU from './QueryBySKU';
import ExportAndImport from './ExportAndImport';

import style from './index.module.less';

const OrderPage: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang, userInfo } = useContext(MainContext);
  const tableRef = useRef<TableContext>(null);
  const [dataList, setDataList] = useState([]);

  const columns = useColumns();
  const search = useSearch();

  const [queryParams, setQueryParams] = useState({});

  const getOrderList = async (t) => {
    userLog('request order list params:', t);
    try {
      // 只要有其他的其他的查询，时间为空的时候不设置为当天，其他情况下时间为空的时候就默认是今天
      if (t.userPhone || t.orderSn || t.payType || t.salerId) {

      } else {
        // 如果start和end为空，则设置为当天
        if (!t.start || !t.end) {
          t.start = dayjs().format('YYYY-MM-DD');
          t.end = dayjs().format('YYYY-MM-DD');
        }
      }
      const showStatus = getStore('orderShowStatus');
      if (showStatus === 'hidden') {
        t.showStatus = 'hidden';
      }
      setQueryParams(t);
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
            <Summary queryParams={queryParams} />
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
              userInfo?.role === 'admin' && (
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
