import React, { memo, useContext } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, Popconfirm, App } from 'antd';

import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

type ComProps = {
  id: number;
};

const RemoveMarketing: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const { id } = props;

  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    try {
      const response = await request.post(`/marketing/delete`, {
        id,
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
      title={`${language[currentLang].marketing.deleteMarketing}`}
      description={`${language[currentLang].marketing.deleteMarketingDescription}`}
      onConfirm={confirm}
      onCancel={cancel}
      okText={`${language[currentLang].common.yes}`}
      cancelText={`${language[currentLang].common.no}`}
    >
      <Button type='link'>{language[currentLang].marketing.deleteMarketingAction}</Button>
    </Popconfirm>
  );

};

export default memo(RemoveMarketing);
