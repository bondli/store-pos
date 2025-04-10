import React, { memo, useEffect, useState, useContext } from 'react';
import { Flex, Radio, Input, Select, Card, Typography } from 'antd';

import { getStore } from '@common/electron';

import { BuyContext } from './context';

import style from './index.module.less';

const Payment: React.FC = () => {
  const { waitSales, setWaitSales, setStoreSaler } = useContext(BuyContext);
  const [salers, setSalers] = useState([{ value: '', label: 'please select saler' }]);

  useEffect(() => {
    const salerList = getStore('salerList') || [];
    const newSalers = [];
    salerList.forEach((item) => {
      newSalers.push({ value: item.id, label: item.name });
    });
    setSalers(newSalers);
  }, []);

  if (!waitSales?.list || !waitSales?.list.length) {
    return null;
  }

  // 输入实收处理函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      setWaitSales(prev => ({ 
        list: prev.list, brief: { ...prev.brief, actualAmount: 0 }
      }));
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return;
    }

    // 确保输入值不超过应付金额
    const maxAmount = waitSales?.brief?.payAmount || 0;
    const actualAmount = Math.min(numValue, maxAmount);
    
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
    <Card title={`Payment`} size='small' className={style.groupCard}>
      <Flex gap={`small`} vertical wrap>
        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '100px' }}>Pay Type</Typography.Text>
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
          <Typography.Text style={{ width: '100px' }}>Actual</Typography.Text>
          <Input 
            size='middle' 
            placeholder='acutal amount' 
            style={{ width: `200px` }}
            onChange={handleChange}
            value={waitSales?.brief?.actualAmount || ''}
          />
        </Flex>

        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '100px' }}>Saler</Typography.Text>
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
                return <span>please select saler</span>;
              }
            }
          />
        </Flex>

        <Flex align="center" gap="small">
          <Typography.Text style={{ width: '100px' }}>Remark</Typography.Text>
          <Input 
            size='middle' 
            placeholder='order remark' 
            style={{ width: `200px` }}
            onChange={handleRemarkChange}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default memo(Payment);
