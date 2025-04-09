import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, App } from 'antd';
import FormRender, { useForm } from 'form-render';

import { userLog } from '@/common/electron';
import request from '@common/request';

import schema from './schema';

type ComProps = {
  sku: string;
  sn: string;
  callback?: () => void;
};

const Editor: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { sku, sn, callback } = props;
  
  const form = useForm();

  // 提交修改
  const onFinish = async (formData) => {
    console.log('formData:', formData);
    try {
      const response = await request.post('/inventory/update', formData);

      if (response.data?.error) {
        message.error(response.data?.error || '更新库存失败');
      } else {
        message.success('更新库存成功');
        setShowPanel(false);
        // todo:待实现
        callback && callback();
      }
    } catch (error) {
      message.error('更新库存失败');
    }
  };

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 查询商品详情
  const getInventroyDetail = async (t) => {
    userLog('request inventroy detail params:', t);
    try {
      const response = await request.get('/inventory/queryDetailBySku', {
        params: t,
      });
      const result = response.data || {};
      if (result.error || !result.sku) {
        message.error(`没有找到对应的商品`);
        return;
      }
      form.setValues({
        sku,
        ...result,
      });
    } catch (error) {
      message.error('查询对应的商品失败');
    }
  };

  useEffect(() => {
    // 发请求得到该 SKU 下的库存，仅仅只能修改库存
    if (sku && sn && showPanel) {
      getInventroyDetail({
        sku,
      });
    }
  }, [form, sku, sn, showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        modify
      </Button>
      <Drawer
        title={`Item Modify`}
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
              hide: true,
            }
          }}
        />
      </Drawer>
    </>
  );

};

export default memo(Editor);
