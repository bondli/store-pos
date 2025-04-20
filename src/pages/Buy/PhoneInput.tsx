import React, { memo, useContext, useState } from 'react';
import { App, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import request from '@common/request';
import { userLog } from '@/common/electron';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { BuyContext } from './context';


const PhoneInput: React.FC = () => {
  const { message, modal } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { setBuyer } = useContext(BuyContext);

  const [memberPhone, setMemberPhone] = useState('');

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
        point: result.point || 0,
        balance: result.balance || 0,
        coupon: result.coupon || 0,
        level: result.level || 'normal',
        status: result.status || 'normal',
      });
    } else {
      modal.confirm({
        content: `当前手机号[${value}]还不是会员，确认加入吗？`,
        onOk: async () => {
          try {
            const formData = {
              phone: value,
              name: value,
            };
            const response = await request.post('/member/create', formData);
      
            if (response.data?.error) {
              message.error(response.data?.error || '新增会员失败');
            } else {
              message.success('新增会员成功');
              setBuyer({
                phone: value,
                point: 0,
                balance: 0,
                coupon: 0,
                level: 'normal',
                status: 'normal',
              });
            }
          } catch (error) {
            message.error('新增会员失败');
          }
        },
      });
    }
    // 清除输入框的值
    setMemberPhone('');
  };
  
  return (
    <Input.Search 
      size='middle' 
      placeholder={language[currentLang].buy.inputUserPhone} 
      prefix={<UserOutlined />} 
      allowClear
      onSearch={handleMemberSearch}
      value={memberPhone}
      onChange={(e) => setMemberPhone(e.target.value)}
    />
  );

};

export default memo(PhoneInput);
