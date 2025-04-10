import React, { memo, useState } from 'react';
import { Button, Drawer, Upload, App, Flex, Table, Space } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

import { baseURL } from '@common/request';
import Box from '@/components/Box';

const { Dragger } = Upload;

type ComProps = {
  callback: () => void;
};

const BitchStock: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();

  const [showPanel, setShowPanel] = useState(false);

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
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleBitchStock = () => {
    console.log('执行入库');
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
          title={`上传的文件中记录 (${dataList.length})`}
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
