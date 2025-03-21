import React, { memo, useState } from 'react';
import { Button, Drawer } from 'antd';
import FormRender, { useForm } from 'form-render';

import schema from './schema';

const SingleStock: React.FC = (props) => {
  const form = useForm();

  const onFinish = (formData) => {
    console.log('formData:', formData);
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
