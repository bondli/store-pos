import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import FormRender, { useForm } from 'form-render';

import schema from './schema';

type ComProps = {
  sku: string;
  sn: string;
};

const Editor: React.FC<ComProps> = (props) => {
  const { sku, sn } = props;
  
  const form = useForm();

  const onFinish = (formData) => {
    console.log('formData:', formData);
  };

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  useEffect(() => {
    // 发请求得到该 SKU 下的库存，仅仅只能修改库存
    form.setValues({
      counts: 1,
    });
  }, [form, sku, sn]);

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
            }
          }}
        />
      </Drawer>
    </>
  );

};

export default memo(Editor);
