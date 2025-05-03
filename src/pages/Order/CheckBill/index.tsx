import React, { memo, useEffect, useState, useContext } from 'react';
import { Button, Drawer, Space, Table, App } from 'antd';
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons';

import { PAY_CHANNEL } from '@/common/constant';
import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

type OrderType = {
  orderSn: string;
  orderActual: number;
  payType: string;
  userPhone: string;
  orderStatus: string;
};
type ComProps = {
  dataList: OrderType[];
  callback: () => void;
};

const CheckBill: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);

  const { callback } = props;
  const [showPanel, setShowPanel] = useState(false);
  const [dataList, setDataList] = useState(props.dataList);
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const closePanel = () => {
    setShowPanel(false);
    callback && callback();
  };

  useEffect(() => {
    setDataList(props.dataList);
  }, [showPanel, props.dataList]);

  // 确认订单
  const confirmOrder = async (orderSn: string) => {
    // console.log('confirmOrder', orderSn);
    try {
      const response = await request.post(`/order/checkBill?orderSn=${orderSn}`);
      if (response.data.error) {
        message.error(response.data.error);
      } else {
        message.success('确认订单成功');
        // 对当前的dataList进行处理，更新orderStatus为checked 
        const newDataList = dataList.map((item) => {
          if (item.orderSn === orderSn) {
            item.orderStatus = 'checked';
          }
          return item;
        });
        setDataList(newDataList);
      }
    } catch (error) {
      console.error('confirmOrder error', error);
    }
  };

  const columns = [
    {
      title: language[currentLang].order.tableColumnOrderNo,
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnActual,
      align: 'center',
      dataIndex: 'orderActualAmount',
      key: 'orderActualAmount',
      valueType: 'money',
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
    },
    {
      title: language[currentLang].order.tableColumnStatus,
      align: 'center',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (row, record) => {
        if (record.orderStatus === 'uncheck') {
          return <InfoCircleFilled style={{ color: '#666' }} />
        } else {
          return <CheckCircleFilled style={{ color: 'green' }} />;
        }
      }
    },
    {
      title: language[currentLang].order.tableColumnOperation,
      align: 'center',
      render: (row, record) => {
        return (
          <Space>
            <Button
              type='link'
              disabled={row.orderStatus === 'checked'}
              onClick={() => {
                confirmOrder(record.orderSn);
              }}
            >
              {language[currentLang].common.confirm}
            </Button>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <Button
        type='default'
        onClick={togglePanel}
      >
        {language[currentLang].order.checkBillAction}
      </Button>
      <Drawer
        title={language[currentLang].order.checkBill}
        width={700}
        open={showPanel}
        onClose={closePanel}
        destroyOnClose={true}
      >
        <Table
          rowKey={(record) => record.orderSn}
          dataSource={dataList}
          columns={columns as any}
          pagination={false}
        />
      </Drawer>
    </>
  );

};

export default memo(CheckBill);
