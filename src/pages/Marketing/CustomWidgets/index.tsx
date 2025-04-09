import { Space, Input, Button } from 'antd';
import { useState } from 'react';

// 满送活动
export const MarketingFullSend = (props: any) => {
  const { value, onChange } = props;
  const [full, setFull] = useState(value?.full || '');
  const [reduce, setReduce] = useState(value?.reduce || '');
  const [distributionRules, setDistributionRules] = useState<Array<{ full: string; reduce: string; count: string }>>(
    value?.distributionRules || [{ full: '', reduce: '', count: '' }]
  );

  // 满送活动（满的部分输入处理）
  const handleFullChange = (e) => {
    setFull(e.target.value);
    onChange({
      full: e.target.value,
      reduce: reduce,
      distributionRules,
    });
  };

  // 满送活动（送的部分输入处理）
  const handleReduceChange = (e) => {
    setReduce(e.target.value);
    onChange({
      full: full,
      reduce: e.target.value,
      distributionRules,
    });
  };

  // 满送活动（分配规则输入处理）
  const handleDistributionRuleChange = (index: number, field: 'full' | 'reduce' | 'count', newValue: string) => {
    const newRules = [...distributionRules];
    newRules[index] = {
      ...newRules[index],
      [field]: newValue,
    };
    setDistributionRules(newRules);
    onChange({
      full,
      reduce,
      distributionRules: newRules,
    });
  };

  // 满送活动（添加分配规则）
  const addDistributionRule = () => {
    const newRules = [...distributionRules, { full: '', reduce: '', count: '' }];
    setDistributionRules(newRules);
    onChange({
      full,
      reduce,
      distributionRules: newRules,
    });
  };

  // 满送活动（删除分配规则）
  const removeDistributionRule = (index: number) => {
    if (distributionRules.length === 1) return;
    const newRules = distributionRules.filter((_, i) => i !== index);
    setDistributionRules(newRules);
    onChange({
      full,
      reduce,
      distributionRules: newRules,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <Space>
          <Input
            addonBefore={`满`}
            addonAfter={`元`}
            value={full}
            onChange={handleFullChange}
          />
          <Input
            addonBefore={`送`}
            addonAfter={`元`}
            value={reduce}
            onChange={handleReduceChange}
          />
        </Space>
      </div>
      <div>
        送的钱如何分配成满减优惠券？
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {distributionRules.map((rule, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Space>
              <Input
                addonBefore={`满`}
                addonAfter={`元`}
                value={rule.full}
                onChange={(e) => handleDistributionRuleChange(index, 'full', e.target.value)}
              />
              <Input
                addonBefore={`减`}
                addonAfter={`元`}
                value={rule.reduce}
                onChange={(e) => handleDistributionRuleChange(index, 'reduce', e.target.value)}
              />
              <Input
                addonAfter={`张`}
                value={rule.count}
                onChange={(e) => handleDistributionRuleChange(index, 'count', e.target.value)}
              />
            </Space>
            {distributionRules.length > 1 && (
              <Button type="link" danger onClick={() => removeDistributionRule(index)}>
                删除
              </Button>
            )}
          </div>
        ))}
        <Button type="dashed" onClick={addDistributionRule}>
          添加分配规则
        </Button>
      </div>
    </div>
  );
};

// 满减活动
export const MarketingFullReduce = (props: any) => {
  const { value, onChange } = props;
  const [rules, setRules] = useState<Array<{ full: string; reduce: string }>>(
    value?.rules || [{ full: '', reduce: '' }]
  );

  // 满减活动整体数据输入处理
  const handleRuleChange = (index: number, field: 'full' | 'reduce', newValue: string) => {
    const newRules = [...rules];
    newRules[index] = {
      ...newRules[index],
      [field]: newValue,
    };
    setRules(newRules);
    onChange({ rules: newRules });
  };

  // 满减活动（添加满减规则）
  const addRule = () => {
    const newRules = [...rules, { full: '', reduce: '' }];
    setRules(newRules);
    onChange({ rules: newRules });
  };

  // 满减活动（删除满减规则）
  const removeRule = (index: number) => {
    if (rules.length === 1) return;
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    onChange({ rules: newRules });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {rules.map((rule, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Space>
            <Input
              addonBefore={`满`}
              addonAfter={`元`}
              value={rule.full}
              onChange={(e) => handleRuleChange(index, 'full', e.target.value)}
            />
            <Input
              addonBefore={`减`}
              addonAfter={`元`}
              value={rule.reduce}
              onChange={(e) => handleRuleChange(index, 'reduce', e.target.value)}
            />
          </Space>
          {rules.length > 1 && (
            <Button type="link" danger onClick={() => removeRule(index)}>
              删除
            </Button>
          )}
        </div>
      ))}
      <Button type="dashed" onClick={addRule}>
        添加满减规则
      </Button>
    </div>
  );
};

// 买赠活动
export const MarketingFullGift = (props: any) => {
  const { value, onChange } = props;
  const [full, setFull] = useState(value?.full || '');
  const [gift, setGift] = useState(value?.gift || '');

  // 买赠活动（满的部分输入处理）
  const handleFullChange = (e) => {
    setFull(e.target.value);
    onChange({
      full: e.target.value,
      gift: gift,
    });
  };

  // 买赠活动（送的部分输入处理）
  const handleGiftChange = (e) => {
    setGift(e.target.value);
    onChange({
      full: full,
      gift: e.target.value,
    });
  };

  return (
    <Space>
      <Input
        addonBefore={`买`}
        addonAfter={`件`}
        value={full}
        onChange={handleFullChange}
      />
      <Input
        addonBefore={`送`}
        addonAfter={`件`}
        value={gift}
        onChange={handleGiftChange}
      />
    </Space>
  );
};

const MarketingCustom = (props: any) => {
  const { value, onChange, activityType } = props;

  if (activityType === 'full_send') {
    return <MarketingFullSend {...props} />;
  } else if (activityType === 'full_reduce') {
    return <MarketingFullReduce {...props} />;
  } else if (activityType === 'full_gift') {
    return <MarketingFullGift {...props} />;
  } else {
    return <span style={{ color: '#ccc' }}>请选择活动类型，再设置活动内容</span>;
  }
};

export default MarketingCustom;