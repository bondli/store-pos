import React, { memo, useEffect, useState, useContext } from 'react';
import { Flex, Radio, Input, Select, Card, Typography, App } from 'antd';

import { getStore } from '@common/electron';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { BuyContext } from './context';

import style from './index.module.less';

const Payment: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const { waitSales, setWaitSales, setStoreSaler } = useContext(BuyContext);
  const [salers, setSalers] = useState([{ value: '', label: language[currentLang].buy.pleaseSelectSaler }]);
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const salerList = getStore('salerList') || [];
    const newSalers = [];
    salerList.forEach((item) => {
      newSalers.push({ value: item.id, label: item.name });
    });
    setSalers(newSalers);
  }, []);

  useEffect(() => {
    if (waitSales?.brief?.actualAmount === undefined || waitSales.brief.actualAmount === null || waitSales.brief.actualAmount === 0) {
      setInputValue('');
    } else {
      setInputValue(waitSales.brief.actualAmount.toString());
    }
  }, [waitSales?.brief?.actualAmount]);

  if (!waitSales?.list || !waitSales?.list.length) {
    return null;
  }

  // 输入实收处理函数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 输入法开始
  const handleCompositionStart = () => {
    setIsComposing(true);
  };
  // 输入法结束
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    // composition 结束时同步一次
    handleInputBlur(e as any);
  };

  // 失焦时校验并写入 waitSales
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isComposing) return;
    const value = e.target.value;
    if (value === '') {
      setWaitSales(prev => ({ 
        list: prev.list, brief: { ...prev.brief, actualAmount: undefined }
      }));
      return;
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return;
    }
    // 确保输入值不超过应付金额
    const maxAmount = waitSales?.brief?.payAmount || 0;
    // 如果输入的大于应付金额，给个消息提示
    // if (numValue > maxAmount) {
    //   message.error(`输入的实收金额不能大于应付金额`);
    // }
    // const actualAmount = Math.min(numValue, maxAmount);
    const actualAmount = numValue;
    setWaitSales(prev => ({ 
      list: prev.list, brief: { ...prev.brief, actualAmount }
    }));
  };

  // 导购员选择处理函数
  const handleSalerChange = (value: string) => {
    if (!value) {
      setStoreSaler(null);
      return;
    }
    const selectedSaler = salers.find(item => item.value === value);
    if (selectedSaler) {
      setStoreSaler({
        id: Number(selectedSaler.value),
        name: selectedSaler.label
      });
    }
  };

  // 支付方式选择处理函数
  const handlePayTypeChange = (e: any) => {
    setWaitSales(prev => ({ 
      list: prev.list, brief: { ...prev.brief, payType: e.target.value }
    }));
  };

  // 备注处理函数
  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaitSales(prev => ({ 
      list: prev.list, brief: { ...prev.brief, remark: e.target.value }
    }));
  };
  return (
    <Card title={language[currentLang].buy.payment} size='small' className={style.groupCard}>
      <Flex gap={`small`} vertical wrap>
        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '80px' }}>{language[currentLang].buy.payType}</Typography.Text>
          <Radio.Group 
            defaultValue={``} 
            buttonStyle={`solid`}
            onChange={handlePayTypeChange}
          >
            <Radio.Button value='weixin'>微信</Radio.Button>
            <Radio.Button value='alipay'>支付宝</Radio.Button>
            <Radio.Button value='cash'>现金</Radio.Button>
            <Radio.Button value='card'>银行卡</Radio.Button>
            <Radio.Button value='other'>其他</Radio.Button>
          </Radio.Group>
        </Flex>

        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '80px' }}>{language[currentLang].buy.actual}</Typography.Text>
          <Input 
            size='middle' 
            placeholder={language[currentLang].buy.actual} 
            style={{ width: `200px` }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
        </Flex>

        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '80px' }}>{language[currentLang].buy.saler}</Typography.Text>
          <Select
            defaultValue={``}
            style={{ width: `200px` }}
            options={salers}
            onChange={handleSalerChange}
            labelRender={
              (props) => {
                const { label } = props;
                if (label) {
                  return label;
                }
                return <span>{language[currentLang].buy.pleaseSelectSaler}</span>;
              }
            }
          />
        </Flex>

        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '80px' }}>{language[currentLang].buy.remark}</Typography.Text>
          <Input 
            size='middle' 
            placeholder={language[currentLang].buy.orderRemark} 
            style={{ width: `200px` }}
            onChange={handleRemarkChange}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default memo(Payment);
