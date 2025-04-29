import React, { memo, useState, useRef, useContext, useCallback } from 'react';
import { App, Button, Drawer, Input, Table } from 'antd';
import { CopyOutlined, ScanOutlined, SignatureOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';
import Box from '@/components/Box';

const QueryBySKU: React.FC = () => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const [showPanel, setShowPanel] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [inputType, setInputType] = useState<'scan' | 'input'>('scan');
  const [scanSkuCode, setScanSkuCode] = useState('');

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  // 处理条码提交
  const processBarCode = (value: string) => {
    request.get('/order/queryBySku', {
      params: {
        sku: value,
      },
    }).then((response: any) => {
      const result = response.data;
      if (result.error) {
        message.error(result.error);
      } else {
        setDataList(result.data);
        // 如果没有返回结果给个错误提示
        if (!result.data?.length) {
          message.error(`该商品还没有任何订单`);
        }
        // 如果是扫码模式，需要清除输入框结果
        if (inputType === 'scan') {
          setScanSkuCode('');
        }
      }
    }).catch((error: any) => {
      message.error('查询失败');
    });
  };

  const debounceTimer = useRef<number>();

  // 处理扫码枪的输入
  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    // 更新输入框的值
    setScanSkuCode(value);

    if (!value) {
      return;
    }

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      processBarCode(value);
    }, 300);
  };

  // 处理输入框的输入
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    // 更新输入框的值
    setScanSkuCode(value);
  }, [scanSkuCode]);

  // 处理输入框的回车
  const handleInputSearch = useCallback(() => {
    processBarCode(scanSkuCode);
  }, [scanSkuCode]);

  const columns = [
    {
      title: language[currentLang].order.tableColumnOrderNo,
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
      render: (text: string) => {
        // 复制
        const handleCopy = () => {
          navigator.clipboard.writeText(text);
          message.success('复制成功');
        };

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {text}
            <CopyOutlined onClick={handleCopy} style={{ cursor: 'pointer', color: '#1890ff', marginLeft: 4 }} />
          </div>
        );
      },
    },
    {
      title: language[currentLang].order.tableColumnOrderTime,
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: language[currentLang].order.tableColumnActual,
      align: 'center',
      dataIndex: 'orderActualAmount',
      key: 'orderActualAmount',
    },
    {
      title: language[currentLang].order.tableColumnUser,
      align: 'center',
      dataIndex: 'userPhone',
      key: 'userPhone',
    },
    {
      title: language[currentLang].order.tableColumnItems,
      align: 'center',
      dataIndex: 'orderItems',
      key: 'orderItems',
    },
  ];

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].order.queryBySkuCode}
      </Button>
      <Drawer
        title={language[currentLang].order.queryBySkuCode}
        width={700}
        open={showPanel}
        onClose={closePanel}
        destroyOnClose={true}
      >
        {
          inputType === 'input' ? (
            <Input 
              size='middle' 
              placeholder={language[currentLang].order.queryBySkuCodePlaceholder}
              prefix={<SignatureOutlined onClick={ () => setInputType('scan') } />}  
              onChange={handleInput}
              onPressEnter={handleInputSearch}
              value={scanSkuCode}
            />
          ) : (
            <Input
              prefix={<ScanOutlined onClick={ () => setInputType('input') } />} 
              placeholder={language[currentLang].order.queryBySkuCodePlaceholder}
              onChange={handleScan}
              autoFocus
              value={scanSkuCode}
            />
          )
        }

        <div style={{ marginTop: 24 }}>
          <Box
            title={language[currentLang].order.queryBySkuCodeTitle}
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
                <Table
                  rowKey={(record) => record.orderSn}
                  dataSource={dataList}
                  columns={columns as any}
                  pagination={false}
                />
              </div>
            }
          />
        </div>
      </Drawer>
    </>
  );

};

export default memo(QueryBySKU);
