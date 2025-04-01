import React, { memo, useContext } from 'react';
import { Avatar, List } from 'antd';
import { DeleteFilled, MoneyCollectFilled } from '@ant-design/icons';

import { BuyContext } from './context';

import style from './index.module.less';

const WaitSaleList: React.FC = () => {
  const { waitSales, setWaitSales, buyer, storeSaler } = useContext(BuyContext);
  console.log('WaitSaleList Component waitSales:', waitSales);
  console.log('WaitSaleList Component buyer:', buyer);
  console.log('WaitSaleList Component storeSaler:', storeSaler);

  const handleDelete = (sku) => {
    setWaitSales(prev => {
      const { list = [], brief } = prev;
      const newList = [ ...list ];
      const newBrief = {
        ...brief,
        skuNum: 0,
        counts: 0,
        totalAmount: 0,
        payAmount: 0
      };

      const existingItemIndex = list.findIndex(item => item.sku === sku);
      if (existingItemIndex > -1) {
        newList.splice(existingItemIndex, 1);
      }

      if (newList && newList.length) {
        newList.forEach((item) => {
          newBrief.skuNum += 1;
          newBrief.counts += item.counts;
          newBrief.totalAmount += item.originalPrice;
          newBrief.payAmount += Number((item.originalPrice * 0.6).toFixed(2));
        });
      }

      return {
        list: newList,
        brief: newBrief,
      };
    });
  };

  const handleGive = (sku) => {
    setWaitSales(prev => {
      const { list = [], brief } = prev;
      const newList = [ ...list ];
      const newBrief = {
        ...brief,
        skuNum: 0,
        counts: 0,
        totalAmount: 0,
        payAmount: 0
      };

      const existingItemIndex = newList.findIndex(item => item.sku === sku);
      if (existingItemIndex > -1) {
        newList[existingItemIndex] = {
          ...newList[existingItemIndex],
          isGived: !newList[existingItemIndex].isGived,
        };
      }

      newList.forEach((item) => {
        newBrief.skuNum += 1;
        newBrief.counts += item.counts;
        newBrief.totalAmount += (item.isGived) ? 0 : (item.originalPrice * item.counts);
        newBrief.payAmount += (item.isGived) ? 0 : Number((item.originalPrice * item.counts * 0.6).toFixed(2));
      });

      return {
        list: newList,
        brief: newBrief,
      };
    });
  };
  
  return (
    <div className={style.waitSaleList}>
      <List
        itemLayout={`horizontal`}
        bordered
        dataSource={waitSales?.list}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <DeleteFilled className={style.waitSaleAction} onClick={() => handleDelete(item.sku)} />,
              item.isGived ? (
                <MoneyCollectFilled className={style.waitSaleAction} style={{ color: `gray` }} onClick={() => handleGive(item.sku)} />
              ) : (
                <MoneyCollectFilled className={style.waitSaleAction} onClick={() => handleGive(item.sku)} />
              )
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<div>[{item.sku}]{item.name}</div>}
              description={`${item.color} / ${item.size} / ¥${item.originalPrice}`}
            />
            <div className={style.waitSaleItemContent}>
              {
                //todo: 商品可以修改折扣
              }
              <div>¥{item.salePrice}</div>
              <div className={style.waitSaleCount}>x{item.counts}</div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default memo(WaitSaleList);
