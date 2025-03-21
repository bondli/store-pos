import React, { memo } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, notification, Popconfirm } from 'antd';

type ComProps = {
  orderSn: string;
};

const RemoveOrder: React.FC<ComProps> = (props) => {
  const { orderSn } = props;

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    // todo:: 执行删除
    notification.success({
      message: 'Notification',
      description: `Click on Yes: ${orderSn}`,
      onClick: () => {
        // console.log('Notification Clicked!');
      },
    });
  };
  
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    // console.log(e);
  };

  return (
    <Popconfirm
      title={`Delete Order`}
      description={`Are you sure to delete this order?`}
      onConfirm={confirm}
      onCancel={cancel}
      okText={`Yes`}
      cancelText={`No`}
    >
      <Button type='link'>delete</Button>
    </Popconfirm>
  );

};

export default memo(RemoveOrder);
