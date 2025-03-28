import React, { memo, useState, useContext } from 'react';
import type { FormProps } from 'antd';
import { Layout, Row, Col, Form, Input, Button, message } from 'antd';
import { userLog, setStore } from '@common/electron';
import request from '@common/request';
import { MainContext } from '@common/context';

import Logo from '@components/Logo';

import style from './index.module.less';

const { Header, Content } = Layout;

type LoginData = {
  id: number;
  name: string;
  avatar: string;
};

type FieldType = {
  username?: string;
  password?: string;
};

type RegFieldType = {
  regname?: string;
  regpwd?: string;
  repregpwd?: string;
};

const UserPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { setUserInfo } = useContext(MainContext);

  // 登录和注册切换
  const handleSwitch = (type: string) => {
    userLog('Switch Login Action:', type);
    if (type === 'login') {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  };

  // 获取导购员列表
  const getSalerList = async () => {
    // 然后发请求获取导购员列表，保存到缓存中
    try {
      const response = await request.get('/user/list');
      const resData = response.data;

      if (resData?.error) {
        userLog(`get saler list error:`, resData?.error);
      } else {
        const salerList = response.data?.data;
        setStore('salerList', salerList);
      }
    } catch (error) {
      userLog(`get saler list error:`, error);
    }
  };

  // 执行登录
  const onLogin: FormProps<FieldType>['onFinish'] = async (values) => {
    userLog('Submit Login:', values);
    const response = await request.post('/user/login', {
      name: values.username,
      password: values.password,
    });
    userLog('Submit Login Result:', response);
    const result = response.data;
    if (result.error) {
      message.error(`请检查用户名和密码是否正确，失败原因：${result.error}`);
      return;
    }
    message.success(`登录成功`);
    setStore('loginData', result);
    setUserInfo(result);
    getSalerList();
  };

  // 执行注册
  const onRegister: FormProps<RegFieldType>['onFinish'] = async (values) => {
    userLog('Submit Register:', values);
    const response = await request.post('/user/register', {
      name: values.regname,
      password: values.regpwd,
      mail: '',
      avatar: values.regname.substring(0,1),
    });

    const result = response.data || {};

    userLog('Submit Register Result:', result);
    if (result && result.error) {
      message.error(`注册失败：${result.error}`);
      return;
    }
    message.success(`注册成功，已自动为你登录`);
    setStore('loginData', result);
    setUserInfo(result);
    getSalerList();
  };

  return (
    <Layout className={style.layout}>
      <Header className={style.header}>
        <Logo mode={'light'} />
        <div className={style.sologon}>线下实体店管理利器，快捷收银对账，商品出入库高效盘点，让你的店铺经营更简单</div>
      </Header>
      <Content className={style.content}>
        <Row style={{ width: '100%' }}>
          <Col span={12} className={style.left}>
            <img src="https://todoist.b-cdn.net/assets/images/44245fc51c3e2ab05ee6d92c13e2e08a.png" style={{ width: '450px', height: '232px' }} />
          </Col>
          <Col span={12} className={style.right}>
            {
              showLogin ? (
                <div className={style.loginForm}>
                  <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ minWidth: 400, maxWidth: 600 }}
                    onFinish={onLogin}
                    autoComplete="off"
                  >
                    <Form.Item<FieldType>
                      label="用户名"
                      name="username"
                      rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="密码"
                      name="password"
                      rules={[{ required: true, message: '密码不能为空' }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        进入
                      </Button>
                      <span className={style.userTips} onClick={() => handleSwitch('register') }>还没有账号，先注册一个</span>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <div className={style.loginForm}>
                  <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ minWidth: 400, maxWidth: 600 }}
                    onFinish={onRegister}
                    autoComplete="off"
                  >
                    <Form.Item<RegFieldType>
                      label="用户名"
                      name="regname"
                      rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item<RegFieldType>
                      label="密码"
                      name="regpwd"
                      hasFeedback
                      rules={[{ required: true, message: '密码不能为空' }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item<RegFieldType>
                      label="重复密码"
                      name="repregpwd"
                      dependencies={['regpwd']}
                      hasFeedback
                      rules={[
                        { required: true, message: '请输入重复密码' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('regpwd') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码不一致'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        注册
                      </Button>
                      <span className={style.userTips} onClick={() => handleSwitch('login') }>已有账号，返回直接登录</span>
                    </Form.Item>
                  </Form>
                </div>
              )
            }
          </Col>
        </Row>
      </Content>
    </Layout>
  );

};

export default memo(UserPage);
