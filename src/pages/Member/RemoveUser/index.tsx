import React, { memo } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, notification, Popconfirm } from 'antd';

type ComProps = {
  userPhone: string;
};

const RemoveUser: React.FC<ComProps> = (props) => {
  const { userPhone } = props;

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    // todo:: 执行删除
    notification.success({
      message: 'Notification',
      description: `Click on Yes: ${userPhone}`,
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
      title={`Delete Member`}
      description={`Are you sure to delete this member?`}
      onConfirm={confirm}
      onCancel={cancel}
      okText={`Yes`}
      cancelText={`No`}
    >
      <Button type='link'>delete</Button>
    </Popconfirm>
  );

};

export default memo(RemoveUser);
