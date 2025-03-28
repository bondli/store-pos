import React, { memo, useState } from 'react';
import { Button, Drawer, message } from 'antd';
import FormRender, { useForm } from 'form-render';

import request from '@common/request';

import schema from './schema';

type ComProps = {
  callback: () => void;
};

const SingleStock: React.FC<ComProps> = (props) => {
  const { callback } = props;
  const form = useForm();

  const onFinish = async (formData) => {
    console.log('inventory create formData:', formData);
    try {
      const response = await request.post('/inventory/create', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '新增商品入库失败');
      } else {
        message.success('新增入库成功');
        setShowPanel(false);
        callback && callback();
      }
    } catch (error) {
      message.error('新增入库失败');
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
        single stock
      </Button>
      <Drawer
        title={`Single Stock`}
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

export default memo(SingleStock);
