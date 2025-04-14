import React, { memo, useState } from 'react';
import { Button, Drawer, Upload, App, Flex, Table, Space, Tag } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

import request, { baseURL } from '@common/request';
import Box from '@/components/Box';

const { Dragger } = Upload;

type ComProps = {
  callback: () => void;
};

const BitchStock: React.FC<ComProps> = (props) => {
  const { message, modal } = App.useApp();

  const { callback } = props;

  const [showPanel, setShowPanel] = useState(false);

  // 上传的文件数据行数
  const [dataList, setDataList] = useState([]);
  // 上传的文件中商品总数
  const [totalCount, setTotalCount] = useState(0);

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
          // setDataList(data);
          setTotalCount(total);
          // 发请求取预处理数据
          request.post('/inventory/batchProcessData', {
            dataList: data,
          }).then((res) => {  
            const result = res.data;
            if (result.success) {
              setDataList(result.dataList);
              setTotalCount(result.totalCount);
            }
            else {
              message.error(result.error);
            }
          });
        } else {
          message.error(response.error);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 执行入库
  const handleBitchStock = async () => {
    console.log('执行入库');
    const response = await request.post('/inventory/batchCreate', {
      dataList,
    });
    const result = response.data;
    if (!result.error) {
      message.success('入库成功');
      // 通过modal的方式提示用户操作成功的数量和失败的数量
      modal.success({
        title: '入库成功',
        content: `成功入库 ${result.totalCount-result.errorCount} 条数据，失败 ${result.errorCount} 条数据`,
        onOk: () => {
          callback && callback();
          setShowPanel(false);
          setDataList([]);
        },
      });
    } else {
      message.error(result.error);
    }
  };

  const handleClear = () => {
    setDataList([]);
    setShowPanel(false);
  };

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        <UploadOutlined />Bitch Stock
      </Button>
      <Drawer
        title={`Bitch Stock`}
        width={800}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='right'>
            <Space>
              <Button type='primary' key='submit' onClick={handleBitchStock}>
                执行入库
              </Button>
              <Button type='default' key='clear' onClick={handleClear}>
                取消
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

        <Box
          title={`上传的文件中记录 (${dataList.length ? `共${dataList.length}条，商品${totalCount}个` : '0条'})`}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
              <Table
                rowKey='SKU'
                columns={[
                  {
                    title: '品名',
                    dataIndex: '品名',
                  },
                  {
                    title: '货号',
                    dataIndex: '货号',
                  },
                  {
                    title: '品牌',
                    dataIndex: '品牌',
                  },
                  {
                    title: 'SKU',
                    dataIndex: 'SKU',
                  },
                  {
                    title: '尺码',
                    dataIndex: '尺码',
                  },
                  {
                    title: '颜色',
                    dataIndex: '颜色',
                  },
                  {
                    title: '吊牌价',
                    dataIndex: '吊牌价',
                  },
                  {
                    title: '进货价',
                    dataIndex: '进货价',
                  },
                  {
                    title: '数量',
                    dataIndex: '数量',
                    render: (text, record) => {
                      if (record.type === 'newStyle') {
                        return (
                          <>
                            {text}
                            <Tag color='blue' style={{ marginLeft: '10px' }}>新款</Tag>
                          </>
                        );
                      } else if (record.type === 'addSku') {
                        return (
                          <>
                            {text} 
                            <Tag color='green' style={{ marginLeft: '10px' }}>补款</Tag>
                          </>
                        );
                      } else if (record.type === 'addNum') {
                        return (
                          <>
                            {text} 
                            <Tag color='red' style={{ marginLeft: '10px' }}>补货</Tag>
                          </>
                        );
                      }
                    },
                  },
                ]}
                dataSource={dataList}
                pagination={false}
              />
            </div>
          }
        />
      </Drawer>
    </>
  );

};

export default memo(BitchStock);
