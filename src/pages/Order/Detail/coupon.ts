const couponColumns = [
  {
    title: 'coupon id',
    dataIndex: 'couponId',
    key: 'couponId',
    fixed: 'left',
    align: 'center',
  },
  {
    title: 'coupon desc',
    dataIndex: 'couponDesc',
    key: 'couponDesc',
  },
  {
    title: 'coupon type',
    key: 'couponType',
    dataIndex: 'couponType',
    align: 'center',
    enum: {
      store: '店铺优惠券',
      member: '会员优惠券',
    },
  },
  {
    title: 'used value',
    key: 'usedValue',
    dataIndex: 'usedValue',
    align: 'center',
    valueType: 'money',
  },
  {
    title: 'used time',
    dataIndex: 'usedTime',
    key: 'usedTime',
    align: 'center',
    valueType: 'dateTime',
  },
];

export default couponColumns;