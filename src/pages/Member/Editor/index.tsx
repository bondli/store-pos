import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, message } from 'antd';
import FormRender, { useForm } from 'form-render';

import { userLog } from '@/common/electron';
import request from '@common/request';

import schema from './schema';

type ComProps = {
  userPhone: string;
  callback?: () => void;
};

const Editor: React.FC<ComProps> = (props) => {
  const { userPhone, callback } = props;
  
  const form = useForm();

  const onFinish = async (formData) => {
    console.log('formData:', formData);
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
      form.setValues({
        ...result,
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
  }, [form, userPhone, showPanel]);

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
        width={410}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <FormRender
          form={form}
          schema={schema}
          onFinish={onFinish}
          // todo:待实现 onReset={() => setShowPanel(false)}
          footer={{
            submit: {
              text: 'confirm',
            },
            reset: {
              text: 'reset',
            }
          }}
        />
      </Drawer>
    </>
  );

};

export default memo(Editor);
