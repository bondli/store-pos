import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import useSchema from './schema';

type ComProps = {
  callback: () => void;
};

const SingleStock: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const { callback } = props;
  const form = useForm();

  const schema = useSchema();

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
        {language[currentLang].inventory.singleStockAction}
      </Button>
      <Drawer
        title={`${language[currentLang].inventory.singleStock}`}
        width={410}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
      >
        <FormRender
          form={form}
          schema={schema}
          onFinish={onFinish}
          footer={{
            submit: {
              text: language[currentLang].common.confirm,
            },
            reset: {
              text: language[currentLang].common.reset,
            }
          }}
        />
      </Drawer>
    </>
  );

};

export default memo(SingleStock);
