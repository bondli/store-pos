import { InfoCircleFilled } from "@ant-design/icons";
import { Tooltip } from "antd";

const orderColumns = [
  {
    title: 'order sn',
    dataIndex: 'orderSn',
    key: 'orderSn',
    fixed: 'left',
  },
  {
    title: 'order amount',
    align: 'right',
    dataIndex: 'orderAmount',
    key: 'orderAmount',
    valueType: 'money',
  },
  {
    title: 'order actual',
    align: 'right',
    dataIndex: 'orderActualAmount',
    key: 'orderActualAmount',
    // 如果有退单，则hover上去显示有退单
    render: (row, record) => {
      if (record.status === 'refund') {
        return (
          <div>
            <Tooltip title='已退单' placement='topLeft'>
              <InfoCircleFilled style={{ color: 'red' }} />
            </Tooltip>
            <span>￥{record.orderActualAmount}</span>
          </div>
        );
      }
      return <span>￥{record.orderActualAmount}</span>;
    }
  },
  {
    title: 'order items',
    align: 'center',
    key: 'orderItems',
    dataIndex: 'orderItems',
  },
  {
    title: 'pay channel',
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
    title: 'create time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
];

export default orderColumns;