import React, { memo, useContext } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, Popconfirm, App } from 'antd';

import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

type ComProps = {
  id: number;
  status: string;
};

const OfflineMarketing: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

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
    return <Button type='link' disabled>{language[currentLang].marketing.offlineAction}</Button>;
  }

  return (
    <Popconfirm
      title={`${language[currentLang].marketing.offlineMarketing}`}
      description={`${language[currentLang].marketing.offlineMarketingDescription}`}
      onConfirm={confirm}
      onCancel={cancel}
      okText={`${language[currentLang].common.yes}`}
      cancelText={`${language[currentLang].common.no}`}
    >
      <Button type='link'>{language[currentLang].marketing.offlineAction}</Button>
    </Popconfirm>
  );

};

export default memo(OfflineMarketing);
