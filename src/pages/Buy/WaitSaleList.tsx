import React, { ChangeEvent, memo, useContext, useState } from 'react';
import { Avatar, List, Tag, Modal, Input, Flex, Typography, Radio, RadioChangeEvent } from 'antd';
import { DeleteFilled, MoneyCollectFilled } from '@ant-design/icons';

import { DEFAULT_DISCOUNT } from '@/common/constant';

import { BuyContext } from './context';

import style from './index.module.less';

const WaitSaleList: React.FC = () => {
  const { waitSales, setWaitSales, buyer, storeSaler, storeCoupons } = useContext(BuyContext);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [currentSku, setCurrentSku] = useState('');
  // 设置临时的折扣
  const [changeDiscount, setChangeDiscount] = useState(DEFAULT_DISCOUNT);

  // console.log('WaitSaleList Component waitSales:', waitSales);
  // console.log('WaitSaleList Component buyer:', buyer);
  // console.log('WaitSaleList Component storeSaler:', storeSaler);
  // console.log('WaitSaleList Component storeCoupons:', storeCoupons);

  // 删除商品
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

  // 商品是否已赠出
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

  // 切换折扣
  const handleChangeDiscount = (sku) => {
    setCurrentSku(sku);
    setIsDiscountModalOpen(true);
  };

  // 确认修改折扣
  const handleDiscountModalOk = () => {
    setWaitSales(prev => {
      const { list = [], brief } = prev;
      const newList = [...list];
      const newBrief = {
        ...brief,
        skuNum: 0,
        counts: 0,
        totalAmount: 0,
        payAmount: 0
      };

      const existingItemIndex = newList.findIndex(item => item.sku === currentSku);
      if (existingItemIndex > -1) {
        newList[existingItemIndex] = {
          ...newList[existingItemIndex],
          discount: changeDiscount,
          salePrice: Number((newList[existingItemIndex].originalPrice * changeDiscount).toFixed(2))
        };
      }

      newList.forEach((item) => {
        newBrief.skuNum += 1;
        newBrief.counts += item.counts;
        newBrief.totalAmount += (item.isGived) ? 0 : (item.originalPrice * item.counts);
        newBrief.payAmount += (item.isGived) ? 0 : Number((item.salePrice * item.counts).toFixed(2));
      });

      return {
        list: newList,
        brief: newBrief,
      };
    });
    setIsDiscountModalOpen(false);
  };

  // 取消修改折扣
  const handleDiscountModalCancel = () => {
    setIsDiscountModalOpen(false);
  };
  
  // 选择的折扣
  function handleDiscountSelect(e: RadioChangeEvent): void {
    setChangeDiscount(Number((Number(e.target.value) / 10).toFixed(2)));
  }

  // 自定义折扣
  function handleDiscountChange(event: ChangeEvent<HTMLInputElement>): void {
    setChangeDiscount(Number((Number(event.target.value) / 10).toFixed(2)));
  }

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
              description={
                <div>
                  {`${item.color} / ${item.size} / ¥${item.originalPrice}`}
                  <Tag color='#f50' onClick={() => handleChangeDiscount(item.sku)} style={{ marginLeft: `10px`, cursor: `pointer` }}>
                    {`${Number(item.discount * 10).toFixed(1)}折`}
                  </Tag>
                </div>
              }
            />
            <div className={style.waitSaleItemContent}>
              <div>¥{item.salePrice}</div>
              <div className={style.waitSaleCount}>x{item.counts}</div>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title={`修改折扣`}
        open={isDiscountModalOpen}
        onOk={handleDiscountModalOk}
        onCancel={handleDiscountModalCancel}
        destroyOnClose
      >
        <Flex vertical wrap>
          <Flex align="center">
            <Typography.Text style={{ width: '100px' }}>常用折扣</Typography.Text>
            <Radio.Group 
              buttonStyle={`solid`}
              onChange={handleDiscountSelect}
            >
              <Radio.Button value={6}>6折</Radio.Button>
              <Radio.Button value={5.9}>5.9折</Radio.Button>
              <Radio.Button value={5}>5折</Radio.Button>
            </Radio.Group>
          </Flex>

          <Flex align="center" style={{ marginTop: `10px` }}>
            <Typography.Text style={{ width: '100px' }}>自定义折扣</Typography.Text>
            <Input 
              size='middle' 
              placeholder='input discount'
              style={{ width: `200px` }}
              type='number'
              onChange={handleDiscountChange}
            />
          </Flex>
        </Flex>
      </Modal>
    </div>
  );
};

export default memo(WaitSaleList);
