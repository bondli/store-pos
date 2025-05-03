import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import { userLog } from '@/common/electron';
import request from '@common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import schema from './schema';

type ComProps = {
  orderSn: string;
  callback?: () => void;
};

const Editor: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { orderSn, callback } = props;
  
  const form = useForm();

  // 提交修改
  const onFinish = async (formData) => {
    console.log('formData:', formData);
    try {
      const response = await request.post(`/order/modify?orderSn=${orderSn}`, formData);

      if (response.data?.error) {
        message.error(response.data?.error || '更新订单失败');
      } else {
        message.success('更新订单成功');
        setShowPanel(false);
        // todo:待实现
        callback && callback();
      }
    } catch (error) {
      message.error('更新订单失败');
    }
  };

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 查询订单详情
  const getOrderDetail = async (t) => {
    userLog('request order detail params:', t);
    try {
      const response = await request.get('/order/queryDetail', {
        params: t,
      });
      const result = response.data || {};
      if (result.error || !result.orderSn) {
        message.error(`没有找到对应的订单`);
        return;
      }
      form.setValues({
        ...result,
      });
    } catch (error) {
      message.error('查询对应的订单失败');
    }
  };

  useEffect(() => {
    if (orderSn && showPanel) {
      getOrderDetail({
        orderSn,
      });
    }
  }, [form, orderSn, showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].order.orderModifyAction}
      </Button>
      <Drawer
        title={language[currentLang].order.orderModify}
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
