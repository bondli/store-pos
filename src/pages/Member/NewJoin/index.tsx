import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { useNewJoinSchema } from './schema';

type ComProps = {
  callback: () => void;
};

const NewJoin: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { callback } = props;

  const schema = useNewJoinSchema();

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
        {language[currentLang].member.newJoinAction}
      </Button>
      <Drawer
        title={`${language[currentLang].member.newJoinTitle}`}
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

export default memo(NewJoin);
