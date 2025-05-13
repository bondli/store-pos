import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import useSchema from './schema';

import MarketingCustom from '../CustomWidgets';

type ComProps = {
  id: number;
  callback?: () => void;
};

const Editor: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const { id, callback } = props;

  const schema = useSchema();

  const form = useForm();

  // 提交修改
  const onFinish = async (formData) => {
    console.log('formData:', formData);
    try {
      const response = await request.post(`/marketing/update?id=${id}`, formData);

      if (response.data?.error) {
        message.error(response.data?.error || '更新营销活动失败');
      } else {
        message.success('更新营销活动成功');
        setShowPanel(false);
        // todo:待实现
        callback && callback();
      }
    } catch (error) {
      message.error('更新营销活动失败');
    }
  };

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 查询活动详情
  const getMarketingDetail = async (t) => {
    userLog('request marketing detail params:', t);
    try {
      const response = await request.get('/marketing/queryDetail', {
        params: t,
      });
      const result = response.data || {};
      if (result.error || !result.id) {
        message.error(`没有找到对应的营销活动`);
        return;
      }
      form.setValues({
        id,
        ...result,
      });
    } catch (error) {
      message.error('查询对应的营销活动失败');
    }
  };

  useEffect(() => {
    // 发请求得到该活动详情
    if (id && showPanel) {
      getMarketingDetail({
        id,
      });
    }
  }, [form, id, showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].marketing.modifyAction}
      </Button>
      <Drawer
        title={`${language[currentLang].marketing.modifyTitle}`}
        width={410}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnHidden={true}
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
              hide: true,
            }
          }}
        />
      </Drawer>
    </>
  );

};

export default memo(Editor);
