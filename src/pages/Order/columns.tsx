import { useContext } from 'react';
import { Space, Popover, List, Tooltip, notification } from 'antd';
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons';

import language from '@/common/language';
import { MainContext } from '@common/context';

import Editor from './Editor';
import Detail from './Detail';
import MoreOperate from './MoreOperate';
import request from '@/common/request';

const queryOrderRate = async (record: any) => {
  const { orderSn, orderActualAmount } = record;
  const response = await request.get(`/order/queryOrderRate`, {
    params: { orderSn, orderActualAmount },
  });
  const result = response.data;
  if (result.error) {
    notification.error({
      message: '毛利率',
      description: result.error,
    });
  } else {
    notification.success({
      message: '毛利率',
      description: `该订单毛利率为：${result.rate} %`,
    });
  }
};

const useColumns = () => {
  const { currentLang, userInfo } = useContext(MainContext);

  const columns = [
    {
      title: language[currentLang].order.tableColumnOrderNo,
      dataIndex: 'orderSn',
      key: 'orderSn',
      fixed: 'left',
      render: (row, record) => {
        if (record.source === 'outlet') {
          return <Tooltip title='特卖场' placement='top'>{row}</Tooltip>;
        } else {
          return row;
        }
      },
    },
    {
      title: language[currentLang].order.tableColumnItems,
      align: 'center',
      key: 'orderItems',
      dataIndex: 'orderItems',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnAmount,
      align: 'right',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      fixed: 'left',
      render: (row, record) => {
        if (record.orderAmount <= 0 && record.orderItems <= 0) {
          return <span style={{ color: '#ccc' }}>会员充值</span>;
        }
        return record.orderAmount > 0 ? <span>￥{record.orderAmount}</span> : '--';
      },
    },
    {
      title: language[currentLang].order.tableColumnActual,
      align: 'right',
      dataIndex: 'orderActualAmount',
      key: 'orderActualAmount',
      fixed: 'left',
      render: (row, record) => {
        const displayAmount = (
          <span
            style={{ color: 'red' }}
            onClick={() => {
              if (userInfo?.role !== 'admin') { // 只有管理员可以查看订单毛利率
                return;
              }
              queryOrderRate(record);
            }}
          >￥{record.orderActualAmount}</span>
        );

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
                <InfoCircleFilled style={{ color: '#faad14' }} />
              </Popover>
              {displayAmount}
            </div>
          );
        }
        return displayAmount;
      }
    },
    {
      title: language[currentLang].order.tableColumnPayment,
      align: 'center',
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
      title: language[currentLang].order.tableColumnUser,
      align: 'center',
      dataIndex: 'userPhone',
      key: 'userPhone',
      copyable: true,
    },
    {
      title: language[currentLang].order.tableColumnTime,
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
      valueTypeProps: {
        format: 'YYYY/MM/DD HH:mm:ss'
      }
    },
    {
      title: language[currentLang].order.tableColumnSaler,
      dataIndex: 'salerName',
      key: 'salerName',
      render: (row, record) => {
        return record.salerName || '--';
      },
    },
    {
      title: language[currentLang].order.tableColumnBillStatus,
      align: 'center',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (row, record) => {
        if (record.orderStatus === 'refund') {
          return <Tooltip title='有退货' placement='right'><InfoCircleFilled style={{ color: '#666' }} /></Tooltip>
        }
        else if (record.orderStatus === 'exchange') {
          return <Tooltip title='有换货' placement='right'><InfoCircleFilled style={{ color: '#666' }} /></Tooltip>
        }
        else if (record.orderStatus === 'uncheck') {
          return <Tooltip title='未完成对账' placement='right'><InfoCircleFilled style={{ color: '#faad14' }} /></Tooltip>
        } else {
          return <Tooltip title='已对账' placement='right'><CheckCircleFilled style={{ color: 'green' }} /></Tooltip>;
        }
      }
    },
    {
      title: language[currentLang].order.tableColumnOperation,
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

  return columns;
};

export default useColumns;