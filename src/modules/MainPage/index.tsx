import React, { memo, useState, useEffect } from 'react';
import { Layout, Menu, theme, FloatButton } from 'antd';
import type { MenuProps } from 'antd';

import { mainMenuItems } from '@/common/constant';
import { DataContext } from '@/common/context';
import request from '@common/request';

import Logo from '@components/Logo';
import User from '@components/User';

import OrderPage from '@pages/Order';
import SummaryPage from '@pages/Summary';
import InventoryPage from '@pages/Inventory';
import MemberPage from '@pages/Member';
import BuyPage from '@pages/Buy';

import style from './index.module.less';

const { Header, Content } = Layout;

type MainPageProps = {
  userInfo: {
    id: number;
    name: string;
    avatar: string;
  };
};

const MainPage: React.FC<MainPageProps> = (props) => {
  const { userInfo } = props;
  const [salerList, setSalerList] = useState([]);
  const [currentPage, setCurrentPage] = useState('summary');

  const { token: { colorBgContainer } } = theme.useToken();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentPage(e.key);
  };

  // 获取导购员列表
  const getSalerList = () => {
    request
      .get('/user/list')
      .then((res) => {
        setSalerList(res.data);
      });
  };

  useEffect(() => {
    getSalerList();
  }, []);

  const goToBuyPage = () => {
    setCurrentPage('buy');
  };

  return (
    <DataContext.Provider
      value={{
        salerList,
      }}
    >
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
          <User info={userInfo} />
        </Header>
        <Content className={style.content}>
          {
            currentPage === 'summary' && <SummaryPage />
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
            currentPage === 'buy' && <BuyPage />
          }
          <FloatButton
            type="primary"
            tooltip={`restore the hold's sales`}
            badge={{ dot: true }}
            onClick={goToBuyPage}
          />
        </Content>
      </Layout>
    </DataContext.Provider>
  );
};

export default memo(MainPage);