import React, { memo, useContext, useEffect } from 'react';
import { GithubFilled, CloudDownloadOutlined, CloudUploadOutlined, UserSwitchOutlined, RedoOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, App } from 'antd';

import ElectronBridge from '@common/electron';
import { deleteStore } from '@common/electron';
import { MainContext } from '@common/context';

import style from './index.module.less';

const User: React.FC = () => {
  const { message } = App.useApp();
  const { userInfo, setUserInfo } = useContext(MainContext);

  useEffect(() => {
    const handleExportReply = (event: any, data: { success: boolean; error?: string }) => {
      if (data.success) {
        message.success('数据导出成功');
      } else {
        message.error(`数据导出失败: ${data.error}`);
      }
    };

    const handleImportReply = (event: any, data: { success: boolean; error?: string }) => {
      if (data.success) {
        message.success('数据导入成功，请刷新页面查看最新数据');
      } else {
        message.error(`数据导入失败: ${data.error}`);
      }
    };

    // 添加监听器
    ElectronBridge.onExportDataReply(handleExportReply);
    ElectronBridge.onImportDataReply(handleImportReply);

    // 清理监听器
    return () => {
      ElectronBridge.removeExportDataReplyListener(handleExportReply);
      ElectronBridge.removeImportDataReplyListener(handleImportReply);
    };
  }, [message]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: userInfo?.name,
      disabled: true,
      extra: <RedoOutlined onClick={() => {
        message.success('同步成功');
        window.location.reload();
      }} />
    },
    {
      type: 'divider',
    },
    {
      label: '数据备份',
      key: '2',
      icon: <CloudDownloadOutlined style={{ fontSize: '16px' }} />,
    }, {
      label: '恢复数据',
      key: '3',
      icon: <CloudUploadOutlined style={{ fontSize: '16px' }} />,
    }, {
      type: 'divider',
    }, {
      label: '退出登录',
      key: '5',
      icon: <UserSwitchOutlined style={{ fontSize: '16px' }} />,
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    // 导出数据
    if (key === '2') {
      ElectronBridge.exportData();
    }
    // 本地恢复数据
    else if (key === '3') {
      ElectronBridge.importData();
    }
    // 退出登录
    else if (key === '5') {
      deleteStore('loginData');
      deleteStore('salerList');
      message.success(`退出系统成功`);
      setUserInfo(null);
      return;
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className={style.container}>
      <Dropdown menu={menuProps} trigger={['click']}>
        <Space className={style.userInfoContainer}>
          <GithubFilled style={{ fontSize: '22px', verticalAlign: 'middle' }} />
          <div className={style.name}>{userInfo?.name}</div>
        </Space>
      </Dropdown>
    </div>
  );
};

export default memo(User);
