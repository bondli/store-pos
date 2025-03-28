import { message } from 'antd';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { userLog, getStore } from '@common/electron';

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9527/', // api的base_url
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加请求头部，例如token
    config.headers['X-From'] = 'Store-Pos-Client';
    const loginData = getStore('loginData') || {};
    config.headers['X-User-Id'] = loginData.id || 0;
    return config;
  },
  error => {
    // 请求错误处理
    userLog('request error:', error);
    message.error(error?.message || `unknown error`);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data?.error) {
      message.error(response.data?.error || `unknown error`);
    }
    return response;
  },
  error => {
    userLog('response error:', error);
    message.error(error?.message || `unknown error`);
    return Promise.reject(error);
  }
);

export default service;
