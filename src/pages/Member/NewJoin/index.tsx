import React, { memo, useState } from 'react';
import { Button, Drawer, message } from 'antd';
import FormRender, { useForm } from 'form-render';

import request from '@common/request';

import schema from './schema';

type ComProps = {
  callback: () => void;
};

const NewJoin: React.FC<ComProps> = (props) => {
  const { callback } = props;
  const form = useForm();

  const onFinish = async (formData) => {
    console.log('formData:', formData);
    try {
      const response = await request.post('/member/create', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '新增会员失败');
      } else {
        message.success('新增会员成功');
        setShowPanel(false);
        callback && callback();
      }
    } catch (error) {
      message.error('新增会员失败');
    }
  };

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <>
      <Button
        type='primary'
        onClick={togglePanel}
      >
        new member
      </Button>
      <Drawer
        title={`Member Join`}
        width={410}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <FormRender
          form={form}
          schema={schema}
          onFinish={onFinish}
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

export default memo(NewJoin);
