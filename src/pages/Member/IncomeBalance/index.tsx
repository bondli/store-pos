import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Card, Drawer, Space, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { useBalanceSchema } from './schema';

type ComProps = {
  userPhone: string;
  callback?: () => void;
};

const IncomeBalance: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { userPhone, callback } = props;

  const balanceSchema = useBalanceSchema();

  const formBalance = useForm();

  // 修改会员余额
  const onBalanceFinish = async (formData) => {
    console.log('formData onn balance submit:', formData);
    try {
      const response = await request.post('/member/incomeBalance', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '会员充值失败');
      } else {
        message.success('会员充值成功');
        setShowPanel(false);
        // todo:待实现
        callback && callback();
      }
    } catch (error) {
      message.error('会员充值失败');
    }
  };


  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 查询会员详情
  const getMemberDetail = async (t) => {
    userLog('request member detail params:', t);
    try {
      const response = await request.get('/member/detail', {
        params: t,
      });
      const result = response.data || {};
      if (result.error || !result.phone) {
        message.error(`没有找到对应的会员`);
        return;
      }
      formBalance.setValues({
        phone: result.phone,
        balance: result.balance,
      });
    } catch (error) {
      message.error('查询对应的会员失败');
    }
  };

  useEffect(() => {
    if (userPhone && showPanel) {
      getMemberDetail({
        phone: userPhone,
      });
    }
  }, [formBalance, userPhone, showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].member.incomeBalanceAction}
      </Button>
      <Drawer
        title={`${language[currentLang].member.incomeBalanceTitle}`}
        width={600}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
      >
        <Space direction={`vertical`} size={`middle`}>
          <Card size='small' title={`${language[currentLang].member.modifyBalance}`}>
            <FormRender
              form={formBalance}
              schema={balanceSchema}
              onFinish={onBalanceFinish}
              footer={{
                submit: {
                  text: language[currentLang].common.confirm,
                },
                reset: {
                  text: language[currentLang].common.reset,
                  hide: true,
                }
              }}
            />
          </Card>
        </Space>
      </Drawer>
    </>
  );

};

export default memo(IncomeBalance);
