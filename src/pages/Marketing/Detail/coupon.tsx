const couponColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'coupon',
    dataIndex: 'couponDesc',
    key: 'couponDesc',
  },
  {
    title: 'condition',
    align: 'center',
    dataIndex: 'couponCondition',
    key: 'couponCondition',
    valueType: 'money',
  },
  {
    title: 'coupon value',
    align: 'center',
    dataIndex: 'couponValue',
    key: 'couponValue',
    valueType: 'money',
  },
  {
    title: 'count',
    align: 'center',
    dataIndex: 'couponCount',
    key: 'couponCount',
  },
  {
    title: 'expired time',
    align: 'center',
    dataIndex: 'couponExpiredTime',
    key: 'couponExpiredTime',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
];

export default couponColumns;