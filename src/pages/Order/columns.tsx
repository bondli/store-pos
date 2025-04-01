import { Space } from 'antd';
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons';

// import RemoveOrder from './RemoveOrder';
import Editor from './Editor';
import Detail from './Detail';

const columns = [
  {
    title: 'sn',
    dataIndex: 'orderSn',
    key: 'orderSn',
    copyable: true,
    fixed: 'left',
  },
  {
    title: 'amount',
    align: 'right',
    dataIndex: 'orderAmount',
    key: 'orderAmount',
    valueType: 'money',
    fixed: 'left',
  },
  {
    title: 'actual',
    align: 'right',
    dataIndex: 'orderActualAmount',
    key: 'orderActualAmount',
    valueType: 'money',
    fixed: 'left',
  },
  {
    title: 'items',
    align: 'center',
    key: 'orderItems',
    dataIndex: 'orderItems',
    fixed: 'left',
  },
  {
    title: 'payment',
    dataIndex: 'payType',
    key: 'payType',
    enum: {
      alipay: '支付宝',
      weixin: '微信',
      cash: '现金',
      card: '银行卡',
      other: '其他',
    },
  },
  {
    title: 'user',
    align: 'center',
    dataIndex: 'userPhone',
    key: 'userPhone',
    copyable: true,
  },
  {
    title: 'time',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
  {
    title: 'saler',
    dataIndex: 'salerName',
    key: 'salerName',
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
          <Detail orderSn={row.orderSn} />
          <Editor orderSn={row.orderSn} />
          {/* <RemoveOrder orderSn={row.orderSn} /> */}
        </Space>
      );
    }
  }
];

export default columns;