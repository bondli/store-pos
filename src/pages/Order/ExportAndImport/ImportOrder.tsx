import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, Flex, Upload, App, Space, Table } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import language from '@/common/language';
import { MainContext } from '@/common/context';
import request, { baseURL } from '@common/request';
import Box from '@/components/Box';
import { PAY_CHANNEL } from '@/common/constant';

const { Dragger } = Upload;

type ComProps = {
  callback: () => void;
};

const ImportOrder: React.FC<ComProps> = (props) => {
  const { message, modal } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const { callback } = props;

  const [showPanel, setShowPanel] = useState(false);
  // 定义一个变量，用来判断用户是否上传了文件
  const [isUploadFile, setIsUploadFile] = useState(false);
  // 导入的文件中订单记录
  const [dataList, setDataList] = useState([]);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const uploadConfig: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.xlsx,.xls',
    action: `${baseURL}common/uploadFile`,
    onChange(info) {
      const { status, response } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (response.success) {
          const { data, total } = response;
          // data 是解析后的Excel数据数组
          console.log(`成功解析 ${total} 条数据:`, data);
          setDataList(data);
        } else {
          message.error(response.error);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      setIsUploadFile(true);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 导入订单
  const handleImport = () => {
    // 如果没有数据，则提示用户
    if (!dataList.length) {
      message.error('请先上传文件');
      return;
    }
    // 发请求执行导入
    request.post('/buy/importOrder', {
      dataList,
    }).then((res) => {
      const result = res.data;
      if (result.success) {
        message.success('导入成功');
        modal.success({
          title: '导入成功',
          content: `成功导入 ${result.totalCount} 条数据`,
          onOk: () => {
            callback && callback();
            setShowPanel(false);
            setDataList([]);
            setIsUploadFile(false);
          },
        });
      } else {
        message.error(result.error);
      }
    });
  };

  const handleClear = () => {
    setDataList([]);
    setIsUploadFile(false);
    setShowPanel(false);
  };

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].order.importOrderBtn}
      </Button>
      <Drawer
        title={language[currentLang].order.importOrder}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='right'>
            <Space>
              <Button type='primary' key='import' onClick={handleImport}>
                {language[currentLang].order.importOrderSubmit}
              </Button>
              <Button type='default' key='clear' onClick={handleClear}>
                {language[currentLang].order.importOrderCancel}
              </Button>
            </Space>
          </Flex>
        }
      >
        <div style={{ height: '180px', marginBottom: '40px' }}>
          <Dragger {...uploadConfig}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'>
              Support for a single excel file upload.
            </p>
          </Dragger>
        </div>
        {
          isUploadFile && (
            <Box
              title={`上传的文件中记录 (${dataList.length ? `共${dataList.length}条` : '0条'})`}
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
                  <Table
                    rowKey='SKU'
                    columns={[
                      {
                        title: language[currentLang].order.tableColumnOrderNo,
                        dataIndex: 'orderSn',
                        key: 'orderSn',
                        fixed: 'left',
                      },
                      {
                        title: language[currentLang].order.tableColumnItems,
                        align: 'center',
                        key: 'orderItems',
                        dataIndex: 'orderItems',
                        fixed: 'left',
                      },
                      {
                        title: language[currentLang].order.tableColumnActual,
                        align: 'center',
                        dataIndex: 'orderActualAmount',
                        key: 'orderActualAmount',
                        fixed: 'left',
                      },
                      {
                        title: language[currentLang].order.tableColumnPayment,
                        align: 'center',
                        dataIndex: 'payType',
                        key: 'payType',
                        render: (row, record) => {
                          return PAY_CHANNEL[record.payType] || 'unknown';
                        }
                      },
                      {
                        title: language[currentLang].order.tableColumnUser,
                        align: 'center',
                        dataIndex: 'userPhone',
                        key: 'userPhone',
                        render: (row, record) => {
                          return record.userPhone || '--';
                        }
                      },
                      {
                        title: language[currentLang].order.tableColumnSaler,
                        align: 'center',
                        dataIndex: 'salerName',
                        key: 'salerName',
                        render: (row, record) => {
                          return record.salerName || '--';
                        }
                      },
                    ]}
                    dataSource={dataList}
                    pagination={false}
                  />
                </div>
              }
            />
          )
        }
      </Drawer>
    </>
  );

};

export default memo(ImportOrder);
