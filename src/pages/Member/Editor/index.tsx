import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Drawer, message, Space } from 'antd';
import FormRender, { useForm } from 'form-render';

import { userLog } from '@/common/electron';
import request from '@common/request';

import { baseInfoSchema, pointSchema, balanceSchema } from './schema';

type ComProps = {
  userPhone: string;
  callback?: () => void;
};

const Editor: React.FC<ComProps> = (props) => {
  const { userPhone, callback } = props;
  
  const formBaseInfo = useForm();
  const formPoint = useForm();
  const formBalance = useForm();

  // 更新会员基本信息
  const onBaseInfoFinish = async (formData) => {
    console.log('formData on base info submit:', formData);
    try {
      const response = await request.post('/member/update', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '更新会员失败');
      } else {
        message.success('更新会员成功');
        setShowPanel(false);
        // todo:待实现
        callback && callback();
      }
    } catch (error) {
      message.error('更新会员失败');
    }
  };

  // 修改会员积分
  const onPointFinish = async (formData) => {
    console.log('formData onn point submit:', formData);
    try {
      const response = await request.post('/member/updateScore', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '更新会员积分失败');
      } else {
        message.success('更新会员积分成功');
        setShowPanel(false);
        // todo:待实现
        callback && callback();
      }
    } catch (error) {
      message.error('更新会员积分失败');
    }
  };

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
      formBaseInfo.setValues({
        phone: result.phone,
        name: result.name,
        birthday: result.birthday,
      });
      formPoint.setValues({
        phone: result.phone,
        point: result.point,
      });
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
  }, [formBaseInfo, formPoint, formBalance, userPhone, showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        modify
      </Button>
      <Drawer
        title={`Member Modify`}
        width={600}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <Space direction={`vertical`} size={`middle`}>
          <Card size='small' title={`Base Info`}>
            <FormRender
              form={formBaseInfo}
              schema={baseInfoSchema}
              onFinish={onBaseInfoFinish}
              footer={{
                submit: {
                  text: 'confirm',
                },
                reset: {
                  text: 'reset',
                  hide: true,
                }
              }}
            />
          </Card>
          <Card size='small' title={`Member Point`}>
            <FormRender
              form={formPoint}
              schema={pointSchema}
              onFinish={onPointFinish}
              footer={{
                submit: {
                  text: 'confirm',
                },
                reset: {
                  text: 'reset',
                  hide: true,
                }
              }}
            />
          </Card>
          <Card size='small' title={`Member Balance`}>
            <FormRender
              form={formBalance}
              schema={balanceSchema}
              onFinish={onBalanceFinish}
              footer={{
                submit: {
                  text: 'confirm',
                },
                reset: {
                  text: 'reset',
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

export default memo(Editor);
