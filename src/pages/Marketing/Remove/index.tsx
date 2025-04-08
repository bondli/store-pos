import React, { memo } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, message, Popconfirm } from 'antd';
import request from '@/common/request';

type ComProps = {
  id: number;
};

const RemoveMarketing: React.FC<ComProps> = (props) => {
  const { id } = props;

  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    console.log(e);
    try {
      const response = await request.post(`/marketing/delete`, {
        data: {
          id,
        },
      });
      if (response.status === 200) {
        message.success('活动删除成功');
      } else {
        message.error('活动删除失败');
      }
    } catch (error) {
      console.log(error);
      message.error('活动删除失败');
    }
  };
  
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    // console.log(e);
  };

  return (
    <Popconfirm
      title={`Delete Marketing`}
      description={`Are you sure to delete this marketing?`}
      onConfirm={confirm}
      onCancel={cancel}
      okText={`Yes`}
      cancelText={`No`}
    >
      <Button type='link'>delete</Button>
    </Popconfirm>
  );

};

export default memo(RemoveMarketing);
