import React, { memo, useContext } from 'react';
import { GithubFilled, CloudDownloadOutlined, CloudUploadOutlined, CloudSyncOutlined, UserSwitchOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Modal, App } from 'antd';

import ElectronBridge, { deleteStore, userLog } from '@common/electron';
import { MainContext } from '@common/context';

import style from './index.module.less';

const User: React.FC = () => {
  const { message } = App.useApp();
  const { userInfo, setUserInfo } = useContext(MainContext);
  const [modalApi, modalContextHolder] = Modal.useModal();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: userInfo?.name,
      disabled: true,
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
      label: '刷新数据',
      key: '4',
      icon: <CloudSyncOutlined style={{ fontSize: '16px' }} />,
    }, {
      label: '退出登录',
      key: '5',
      icon: <UserSwitchOutlined style={{ fontSize: '16px' }} />,
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    userLog('Click MainMenu: ', key);
    // 导出数据
    if (key === '2') {
      ElectronBridge.exportData();
      message.success('数据导出成功，请在下载目录下检查是否存在文件：storepos-database.db');
    }
    // 本地恢复数据
    else if (key === '3') {
      modalApi.confirm({
        title: '确认恢复数据？',
        content: '请确认已将数据文件命名成：storepos-database.db，并放在Downloads目录下。',
        onOk() {
          ElectronBridge.importData();
          message.warning('本地数据已导入，请检查是否正确');
        }
      });
    }
    // 刷新下数据，首次进入存在一定概率的调用接口失败
    else if (key === '4') {
      message.success('同步成功');
      window.location.reload();
      return;
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
      <div>{modalContextHolder}</div>
    </div>
  );
};

export default memo(User);
