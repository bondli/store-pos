import React, { memo, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';

import { mainMenuItems } from '@/common/constant';

import Logo from '@components/Logo';
import User from '@components/User';

import OrderPage from '@pages/Order';
import DataPage from '@/pages/Data';
import InventoryPage from '@pages/Inventory';
import MemberPage from '@pages/Member';
import BuyPage from '@pages/Buy';

import style from './index.module.less';

const { Header, Content } = Layout;

const MainPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('sales');

  const { token: { colorBgContainer } } = theme.useToken();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentPage(e.key);
  };

  return (
    <Layout className={style.container}>
      <Header
      className={style.header}
        style={{
          background: colorBgContainer,
        }}
      >
        <Logo mode={'dark'} />
        <Menu
          mode={`horizontal`}
          style={{ flex: 1 }}
          defaultSelectedKeys={[currentPage]}
          items={mainMenuItems}
          onClick={onMenuClick}
        />
        <User />
      </Header>
      <Content className={style.content}>
        {
          currentPage === 'sales' && <BuyPage />
        }
        {
          currentPage === 'order' && <OrderPage />
        }
        {
          currentPage === 'inventory' && <InventoryPage />
        }
        {
          currentPage === 'member' && <MemberPage />
        }
        {
          currentPage === 'data' && <DataPage />
        }
      </Content>
    </Layout>
  );
};

export default memo(MainPage);