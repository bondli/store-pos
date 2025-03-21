import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import FormRender, { useForm } from 'form-render';

import schema from './schema';

type ComProps = {
  userPhone: string;
};

const Editor: React.FC<ComProps> = (props) => {
  const { userPhone } = props;
  
  const form = useForm();

  const onFinish = (formData) => {
    console.log('formData:', formData);
  };

  const [showPanel, setShowPanel] = useState(false);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  useEffect(() => {
    form.setValues({
      phone: userPhone,
    });
  }, [form, userPhone]);

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
