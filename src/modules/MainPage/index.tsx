import React, { memo, useContext } from 'react';
import { Layout, Menu, theme, Tag } from 'antd';
import type { MenuProps } from 'antd';

import { setStore } from '@common/electron';
import { MainContext } from '@common/context';
import language from '@common/language';

import Logo from '@components/Logo';
import User from '@components/User';

import OrderPage from '@pages/Order';
import DataPage from '@/pages/Data';
import InventoryPage from '@pages/Inventory';
import MemberPage from '@pages/Member';
import BuyPage from '@pages/Buy';
import MarketingPage from '@pages/Marketing';

import style from './index.module.less';

const { Header, Content } = Layout;

const MainPage: React.FC = () => {
  const { currentPage, setCurrentPage, currentLang, setCurrentLang } = useContext(MainContext);

  const { token: { colorBgContainer } } = theme.useToken();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentPage(e.key);
  };

  const mainMenuItems =  [{
    key: 'sales',
    label: language[currentLang].main.sales,
  }, {
    key: 'order',
    label: language[currentLang].main.order,
  }, {
    key: 'inventory',
    label: language[currentLang].main.inventory,
  }, {
    key: 'member',
    label: language[currentLang].main.member,
  }, {
    key: 'marketing',
    label: language[currentLang].main.marketing,
  }, {
    key: 'data',
    label: language[currentLang].main.data,
  }]

  const onLangChange = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    setStore('currentLang', newLang);
  };

  return (
    <Layout className={style.container}>
      <Header
      className={style.header}
        style={{
          background: colorBgContainer,
        }}
      >
        <Logo mode={'dark'} title={language[currentLang].common.logo} />
        <Menu
          mode={`horizontal`}
          style={{ flex: 1 }}
          defaultSelectedKeys={[currentPage]}
          items={mainMenuItems}
          onClick={onMenuClick}
        />
        <div className={style.user}>
          <Tag color="#000" onClick={onLangChange} style={{ cursor: 'pointer' }}>{currentLang === 'zh' ? '中' : '英'}</Tag>
          <User />
        </div>
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
        {
          currentPage === 'marketing' && <MarketingPage />
        }
      </Content>
    </Layout>
  );
};

export default memo(MainPage);