import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';

// import { userLog } from '@/common/electron';
// import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import SkuList from '../SkuList';

type ComProps = {
  sku: string;
  sn: string;
};

// const defaultItemInfo = {
//   sn: '',
//   name: '',
//   sku: '',
//   size: '',
//   color: 0,
//   originalPrice: 0,
//   counts: 0,
// };

const Detail: React.FC<ComProps> = (props) => {
  // const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { sku, sn } = props;

  const [showPanel, setShowPanel] = useState(false);
  // const [itemInfo, setItemInfo] = useState(defaultItemInfo);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // // 获取sku信息
  // const getItemDetail = async () => {
  //   userLog('request item detail params:', sku);
  //   try {
  //     const response = await request.get('/inventory/queryDetailBySku', {
  //       params: {
  //         sku,
  //       },
  //     });
  //     const result = response.data;
  //     if (!result.error) {
  //       setItemInfo(result);
  //     }

  //   } catch (error) {
  //     message.error('查询库存失败');
  //   }
  // };

  // // 通过 款号 获取下属所有 SKU 列表
  // const getSkusByStyleNo = async () => {
  //   userLog('request sku list by sn params:', sn);
  //   try {
  //     const response = await request.get('/inventory/queryByStyle', {
  //       params: {
  //         sn,
  //       },
  //     });
  //     const result = response.data;
  //     return {
  //       data: result.data,
  //       total: result.count,
  //     };
  //   } catch (error) {
  //     message.error('查询库存失败');
  //   }
  // };

  // useEffect(() => {
  //   if (showPanel) {
  //     getItemDetail();
  //     getSkusByStyleNo();
  //   }
  // }, [showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].inventory.detailAction}
      </Button>
      <Drawer
        title={`${language[currentLang].inventory.detail}`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
      >
        <SkuList sku={sku} sn={sn} />
      </Drawer>
    </>
  );

};

export default memo(Detail);
