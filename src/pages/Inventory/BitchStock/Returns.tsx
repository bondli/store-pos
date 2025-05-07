import React, { memo, useState, useContext } from 'react';
import { Button, Drawer, Upload, App, Flex, Table, Space } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import language from '@/common/language';
import { MainContext } from '@/common/context';
import request, { baseURL } from '@common/request';
import Box from '@/components/Box';

const { Dragger } = Upload;

type ComProps = {
  callback: () => void;
};

const Returns: React.FC<ComProps> = (props) => {
  const { message, modal } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { callback } = props;

  const [showPanel, setShowPanel] = useState(false);

  // 定义一个变量，用来判断用户是否上传了文件
  const [isUploadFile, setIsUploadFile] = useState(false);
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
          // setTotalCount(total);
          // 发请求取预处理数据
          request.post('/inventory/batchProcessReturnsData', {
            dataList: data,
          }, {
            timeout: 30000, // 设置30秒超时，因为这是批量处理数据，需要更长的处理时间
          }).then((res) => {  
            const result = res.data;
            if (result.success) {
              setDataList(result.dataList);
              setTotalCount(result.totalCount);
              setIsUploadFile(true);
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

  // 执行退库
  const handleBitchStock = async () => {
    // 如果没有数据，则提示用户
    if (!dataList.length) {
      message.error('请先上传文件');
      return;
    }
    const response = await request.post('/inventory/batchReturns', {
      dataList,
    }, {
      timeout: 30000, // 设置30秒超时，因为这是批量处理数据，需要更长的处理时间
    });
    const result = response.data;
    if (!result.error) {
      message.success('退货成功');
      // 通过modal的方式提示用户操作成功的数量和失败的数量
      modal.success({
        title: '退货成功',
        content: `成功退货 ${result.totalCount-result.errorCount} 个商品，失败 ${result.errorCount} 个商品`,
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
  };

  const handleClear = () => {
    setDataList([]);
    setShowPanel(false);
    setIsUploadFile(false);
  };

  const handleDownloadTemplate = async () => {
    try {
      // 发送请求给后台去导出
      const response = await request.post('/inventory/template', {
        type: 'returns',
      }, {
        responseType: 'blob' // 指定响应类型为 blob
      });
      
      // 创建 Blob 对象
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `退库单.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      message.success('下载成功');
    } catch (error) {
      message.error('下载失败');
      console.error('Download error:', error);
    }
  };

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].inventory.bitchStockReturnAction}
      </Button>
      <Drawer
        title={`${language[currentLang].inventory.bitchStockReturnTitle}`}
        width={1000}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='right'>
            <Space>
              <Button type='primary' key='submit' onClick={handleBitchStock}>
                {language[currentLang].inventory.bitchStockReturnSubmit}
              </Button>
              <Button type='default' key='clear' onClick={handleClear}>
                {language[currentLang].inventory.bitchStockReturnCancel}
              </Button>
            </Space>
          </Flex>
        }
        extra={<Button type='link' onClick={handleDownloadTemplate}>{language[currentLang].inventory.bitchStockDownloadTemplate}</Button>}
      >
        <div style={{ height: '180px', marginBottom: '40px' }}>
          <Dragger {...uploadConfig}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>{language[currentLang].common.uploadTips1}</p>
            <p className='ant-upload-hint'>
              {language[currentLang].common.uploadTips2}
            </p>
          </Dragger>
        </div>
        {
          isUploadFile && (
            <Box
              title={`上传的文件中记录 (${dataList.length ? `共${dataList.length}条，商品${totalCount}个` : '0条'})`}
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
                  <Table
                    rowKey='sku'
                    columns={[
                      {
                        title: '品名',
                        dataIndex: 'name',
                      },
                      {
                        title: '货号',
                        dataIndex: 'sn',
                      },
                      {
                        title: '品牌',
                        dataIndex: 'brand',
                      },
                      {
                        title: 'SKU',
                        dataIndex: 'sku',
                      },
                      {
                        title: '尺码',
                        align: 'center',
                        dataIndex: 'size',
                      },
                      {
                        title: '颜色',
                        align: 'center',
                        dataIndex: 'color',
                      },
                      {
                        title: '吊牌价',
                        align: 'center',
                        dataIndex: 'originalPrice',
                      },
                      {
                        title: '库存',
                        align: 'center',
                        dataIndex: 'counts',
                      },
                      {
                        title: '退货数量',
                        align: 'center',
                        dataIndex: 'returnCounts',
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

export default memo(Returns);
