import React, { memo, useRef, useContext, useState } from 'react';
import { Button, App, Drawer } from 'antd';
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
import BitchStock from './BitchStock';
import SingleStock from './SingleStock';
import NoStockList from './NoStockList';
import HotSales from './HotSales';
import SkuRecord from './SkuRecord';

import SkuList from './SkuList';

import style from './index.module.less';

const InventroyPage: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang, userInfo } = useContext(MainContext);

  // 是否展示详情抽屉
  const [sku, setSku] = useState('');
  const [sn, setSn] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  const tableRef = useRef<TableContext>(null);

  const columns = useColumns();
  const search = useSearch();

  const getInventroyList = async (t) => {
    userLog('request inventroy list params:', t);
    try {
      const response = await request.get('/inventory/queryList', {
        params: t,
      });
      const result = response.data;
      // 如果有SKU，并且查询到了结果，执行自己打开详情的组件
      if (t.sku && result.count) {
        setSku(t.sku);
        setSn(result.data[0].sn);
        setShowDetail(true);
      }
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
          userInfo?.role === 'admin' ? <BitchStock callback={refreshData} /> : null
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
          showSizeChanger: true,
          showTotal: (total, range) => `${language[currentLang].common.total}: ${total}`,
        }}
        toolbarRender={ 
          <>
            <Button onClick={refreshData}><RedoOutlined />{language[currentLang].inventory.refresh}</Button>
            <HotSales />
            <NoStockList />
            <SkuRecord />
            {
              userInfo?.role === 'admin' ? <SingleStock callback={refreshData} /> : null
            }
          </>
        }
      />
      {
        showDetail ? (
          <Drawer
            title={`${language[currentLang].inventory.detail}`}
            width={800}
            open={showDetail}
            onClose={() => setShowDetail(false)}
            destroyOnHidden={true}
          >
            <SkuList sku={sku} sn={sn} />
          </Drawer>
        ) : null
      }
    </div>
  );

};

export default memo(InventroyPage);
