import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import schema from './schema';

import MarketingCustom from '../CustomWidgets';

type ComProps = {
  callback: () => void;
};

const NewMarketing: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { callback } = props;
  const form = useForm();

  const onFinish = async (formData) => {
    console.log('formData:', formData);
    try {
      const response = await request.post('/marketing/create', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '新增营销活动失败');
      } else {
        message.success('新增营销活动成功');
        setShowPanel(false);
        callback && callback();
      }
    } catch (error) {
      message.error('新增营销活动失败');
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
        {language[currentLang].marketing.newMarketingAction}
      </Button>
      <Drawer
        title={`${language[currentLang].marketing.newMarketingTitle}`}
        width={500}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <FormRender
          form={form}
          widgets={{
            MarketingCustom,
          }}
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

export default memo(NewMarketing);
