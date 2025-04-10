import React, { memo } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, Popconfirm, App } from 'antd';
import request from '@/common/request';

type ComProps = {
  id: number;
  status: string;
};

const OfflineMarketing: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const { id, status } = props;

  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    try {
      const response = await request.post(`/marketing/offline`, {
        id,
      });
      if (response.status === 200) {
        message.success('活动下线成功');
      } else {
        message.error('活动下线失败');
      }
    } catch (error) {
      console.log(error);
      message.error('活动下线失败');
    }
  };
  
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    // console.log(e);
  };

  if (status !== 'active') {
    return <Button type='link' disabled>offline</Button>;
  }

  return (
    <Popconfirm
      title={`Offline Marketing`}
      description={`Are you sure to offline this marketing?`}
      onConfirm={confirm}
      onCancel={cancel}
      okText={`Yes`}
      cancelText={`No`}
    >
      <Button type='link'>offline</Button>
    </Popconfirm>
  );

};

export default memo(OfflineMarketing);
