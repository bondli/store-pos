import { Space, Popover, List } from 'antd';
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons';

import Editor from './Editor';
import Detail from './Detail';
import MoreOperate from './MoreOperate';

const columns = [
  {
    title: 'order code',
    dataIndex: 'orderSn',
    key: 'orderSn',
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
    fixed: 'left',
    render: (row, record) => {
      // 如果存在使用优惠券，积分，余额等，需要加多一个图标，点击图标展示优惠使用的详情
      if (record.useCoupon || record.usePoint || record.useBalance) {
        const dataSource = [];
        if (record.useCoupon) {
          dataSource.push({
            key: '1',
            label: '优惠券',
            value: record.useCoupon,
          });
        }
        if (record.usePoint) {
          dataSource.push({
            key: '2',
            label: '积分',
            value: record.usePoint,
          });
        }
        if (record.useBalance) {
          dataSource.push({
            key: '3',
            label: '余额',
            value: record.useBalance,
          });
        }
        return (
          <div>
            <Popover
              content={
                <List
                  dataSource={dataSource}
                  renderItem={(item) => (
                    <List.Item>
                      <div>{item.label}</div>
                      <div>{item.value}</div>
                    </List.Item>
                  )}
                />
              }
              title={`优惠使用详情`}
              trigger='click'
              placement='bottomLeft'
            >
              <InfoCircleFilled style={{ color: 'red' }} />
            </Popover>
            <span>￥{record.orderActualAmount}</span>
          </div>
        );
      }
      return <span>￥{record.orderActualAmount}</span>;
    }
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
          <MoreOperate orderSn={row.orderSn} />
        </Space>
      );
    }
  }
];

export default columns;