import React, { memo, useCallback, useState, useRef, useContext } from 'react';
import { Col, Input, Row, Button, message } from 'antd';
import { BarcodeOutlined, UserOutlined } from '@ant-design/icons';

import request from '@common/request';
import { userLog, setStore } from '@/common/electron';

import PageTitle from '@/components/PageTitle';
import CustomCard from '@/components/CustomCard';

import { BuyProvider, BuyContext } from './context';

import WaitSaleList from './WaitSaleList';
import WaitSaleSummary from './WaitSaleSummary';
import MemberCoupon from './MemberCoupon';
import StoreCoupon from './StoreCoupon';
import Payment from './Payment';
import BillInfo from './BillInfo';
import SubmitBar from './SubmitBar';

import style from './index.module.less';

const BuyPageContainer: React.FC = () => {
  const {
    waitSales,
    setWaitSales,
    buyer,
    setBuyer,
    storeSaler,
  } = useContext(BuyContext);

  const [scanSkuCode, setScanSkuCode] = useState('');

  const debounceTimer = useRef<number>();
  
  // 处理扫码枪的输入
  const handleScan = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    // 更新输入框的值
    setScanSkuCode(value);
    
    if (!value) {
      return;
    }
    
    // 清除之前的定时器
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    
    // 设置新的定时器，300ms 后执行查询
    debounceTimer.current = window.setTimeout(() => {
      request.get('/inventory/queryDetailBySku', {
        params: {
          sku: value
        }
      }).then((response: any) => {
        const result = response.data;
        userLog('query sku:', result);
        if (result.error || !result.sku) {
          message.error(`没有找到对应的商品`);
          return;
        }
        setWaitSales(prev => {
          const { list = [], brief } = prev;
          const newList = [ ...list ];
          const newBrief = { ...brief };
          // 是否新的一个 SKU
          let isNewSku = false;

          const existingItemIndex = list.findIndex(item => item.sku === result.sku);
          if (existingItemIndex > -1) {
            // 如果商品已存在，更新数量
            newList[existingItemIndex] = {
              ...newList[existingItemIndex],
              counts: newList[existingItemIndex].counts + 1
            };
          } else {
            // 如果是新商品，添加到列表
            isNewSku = true;
            newList.push({
              sn: result.sn,
              sku: result.sku,
              name: result.name,
              color: result.color,
              size: result.size,
              originalPrice: result.originalPrice,
              salePrice: Number((result.originalPrice * 0.6).toFixed(2)),
              counts: 1,
              isGived: false,
            });
          }

          newBrief.totalAmount += result.originalPrice;
          newBrief.counts += 1;
          newBrief.payAmount += Number((result.originalPrice * 0.6).toFixed(2));

          if (isNewSku) {
            newBrief.skuNum += 1;
          }

          return {
            list: newList,
            brief: newBrief,
          };
        });

        // 清除输入框的值
        setScanSkuCode('');
      });
    }, 300);
  }, [setWaitSales]);

  // 处理会员手机号查询
  const handleMemberSearch = async (value: string) => {
    if (!value) {
      return;
    }
    const response = await request.get('/member/detail', {
      params: {
        phone: value
      }
    });
    const result = response.data;
    if (!result.error) {
      userLog('member info:', result);
      setBuyer({
        phone: result.phone,
        point: result.point,
        balance: result.balance,
        // coupon: result.coupon,
      });
    }
  };

  // 处理挂单
  const handleHangUp = () => {
    setStore('orderCache', {
      waitSales,
      buyer,
      storeSaler,
    });
  };

  return (
    <div className={style.container}>
      <PageTitle
        text={`Sales and Payment`}
        extra={
          waitSales?.list?.length ? <Button type={`link`} onClick={handleHangUp}>hang up</Button> : null
        }
      />

      <Row gutter={16} style={{ height: `calc(100% - 40px)`}}>
        <Col span={12}>
          <CustomCard
            title={
              <Input 
                size='middle' 
                placeholder='scan barcode' 
                prefix={<BarcodeOutlined />} 
                autoFocus 
                onChange={handleScan}
                value={scanSkuCode}
              />
            }
            footer={
              <WaitSaleSummary />
            }
          >
            <WaitSaleList />
          </CustomCard>
        </Col>
        <Col span={12}>
          <CustomCard
            title={
              <Input.Search 
                size='middle' 
                placeholder='input user phone' 
                prefix={<UserOutlined />} 
                allowClear 
                onSearch={handleMemberSearch}
              />
            }
            footer={
              <SubmitBar />
            }
          >
            <MemberCoupon />

            <StoreCoupon />

            <BillInfo />

            <Payment />

          </CustomCard>
        </Col>
      </Row>
    </div>
  );
};

const BuyPage: React.FC = () => {
  return (
    <BuyProvider>
      <BuyPageContainer />
    </BuyProvider>
  );
};

export default memo(BuyPage);
