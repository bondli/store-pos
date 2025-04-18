import { Tag } from 'antd';

const couponColumns = [
  // {
  //   title: 'coupon id',
  //   dataIndex: 'couponId',
  //   key: 'couponId',
  //   fixed: 'left',
  //   width: 140,
  //   ellipsis: true,
  // },
  {
    title: 'coupon desc',
    dataIndex: 'couponDesc',
    key: 'couponDesc',
    fixed: 'left',
  },
  {
    title: 'coupon value',
    dataIndex: 'couponValue',
    key: 'couponValue',
    align: 'center',
  },
  {
    title: 'status',
    align: 'center',
    dataIndex: 'couponStatus',
    key: 'couponStatus',
    render: (row, record) => {
      if (record.couponStatus === 'used') {
        return <Tag color="blue">已使用</Tag>;  // 下单的时候更新这个字段
      }
      // 判断是否过期
      if (record.couponExpiredTime && record.couponExpiredTime < new Date()) {
        return <Tag color="red">已过期</Tag>;
      }
      return <Tag color="green">有效</Tag>;
    },
  },
  {
    title: 'expired time',
    key: 'couponExpiredTime',
    dataIndex: 'couponExpiredTime',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    },
  },
  {
    title: 'get time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    },
  },
];

export default couponColumns;