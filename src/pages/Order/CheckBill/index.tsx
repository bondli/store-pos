import React, { memo, useState } from 'react';
import { Button, Drawer, Space, Table } from 'antd';
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons';

import { PAY_CHANNEL } from '@/common/constant';

type OrderType = {
  orderSn: string;
  orderActual: number;
  payType: string;
  userPhone: string;
  orderStatus: string;
};
type CheckBillProps = {
  dataList: OrderType[];
  callback: () => void;
};

const CheckBill: React.FC<CheckBillProps> = (props) => {
  const { dataList, callback } = props;
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const closePanel = () => {
    setShowPanel(false);
    callback && callback();
  };

  const columns = [
    {
      title: 'sn',
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
    },
    {
      title: 'actual',
      align: 'right',
      dataIndex: 'orderActual',
      key: 'orderActual',
      valueType: 'money',
      fixed: 'left',
    },
    {
      title: 'payment',
      dataIndex: 'payType',
      key: 'payType',
      render: (row, record) => {
        return PAY_CHANNEL[record.payType] || 'unknown';
      }
    },
    {
      title: 'user',
      align: 'center',
      dataIndex: 'userPhone',
      key: 'userPhone',
    },
    {
      title: 'status',
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
      title: 'operation',
      align: 'center',
      render: (row, record) => {
        return (
          <Space>
            <Button type="link" disabled={row.orderStatus === 'checked'}>confirm</Button>
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
        check bill
      </Button>
      <Drawer
        title="Check Bill"
        width={700}
        open={showPanel}
        onClose={closePanel}
        destroyOnClose={true}
      >
        <Table
          dataSource={dataList}
          columns={columns as any}
          pagination={false}
        />
      </Drawer>
    </>
  );

};

export default memo(CheckBill);
