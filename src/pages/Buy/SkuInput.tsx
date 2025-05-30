import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { Input } from 'antd';
import { ScanOutlined, SignatureOutlined } from '@ant-design/icons';
import Decimal from 'decimal.js';

import request from '@common/request';
import { userLog } from '@/common/electron';
import language from '@/common/language';
import { MainContext } from '@/common/context';
import { DEFAULT_DISCOUNT } from '@common/constant';

import { BuyContext } from './context';


const SkuInput: React.FC = () => {
  const { currentLang } = useContext(MainContext);
  const { setWaitSales } = useContext(BuyContext);

  const [scanSkuCode, setScanSkuCode] = useState('');
  const [inputType, setInputType] = useState<'scan' | 'input'>('scan');

  const debounceTimer = useRef<number>();

  const processBarCode = (value: string) => {
    request.get('/inventory/queryDetailBySku', {
      params: {
        sku: value
      }
    }).then((response: any) => {
      const result = response.data;
      userLog('query sku:', result);
      if (result.error || !result.sku) {
        // message.error(`没有找到对应的商品`);
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
            discount: DEFAULT_DISCOUNT,
            salePrice: new Decimal(result.originalPrice).times(DEFAULT_DISCOUNT).toNumber(),
            counts: 1,
            isGived: false,
          });
        }

        newBrief.totalAmount = new Decimal(newBrief.totalAmount).plus(result.originalPrice).toNumber();
        newBrief.counts += 1;
        newBrief.payAmount = new Decimal(newBrief.payAmount).plus(new Decimal(result.originalPrice).times(DEFAULT_DISCOUNT)).toNumber();

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
  };
  
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
      processBarCode(value);
    }, 300);
  }, [setWaitSales]);

  // 处理输入框的输入
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    // 更新输入框的值
    setScanSkuCode(value);
  }, [setWaitSales]);

  // 处理输入框的回车
  const handleInputSearch = useCallback(() => {
    processBarCode(scanSkuCode);
  }, [scanSkuCode, setWaitSales]);


  if (inputType === 'input') {
    return (
      <Input 
        size='middle' 
        placeholder={language[currentLang].buy.inputBarcode}
        prefix={<SignatureOutlined onClick={ () => setInputType('scan') } />} 
        autoFocus 
        onChange={handleInput}
        onPressEnter={handleInputSearch}
        value={scanSkuCode}
      />
    );
  }

  return (
    <Input 
      size='middle' 
      placeholder={language[currentLang].buy.scanBarcode}
      prefix={<ScanOutlined onClick={ () => setInputType('input') } />} 
      autoFocus 
      onChange={handleScan}
      value={scanSkuCode}
    />
  );
};

export default memo(SkuInput);
