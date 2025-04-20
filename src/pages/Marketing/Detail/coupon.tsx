import { Tag } from 'antd';
import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang');

const couponColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: language[currentLang].marketing.marketingCoupon,
    dataIndex: 'couponDesc',
    key: 'couponDesc',
  },
  {
    title: language[currentLang].marketing.marketingCouponCondition,
    align: 'center',
    dataIndex: 'couponCondition',
    key: 'couponCondition',
    valueType: 'money',
  },
  {
    title: language[currentLang].marketing.marketingCouponValue,
    align: 'center',
    dataIndex: 'couponValue',
    key: 'couponValue',
    valueType: 'money',
  },
  {
    title: language[currentLang].marketing.marketingCouponCount,
    align: 'center',
    dataIndex: 'couponCount',
    key: 'couponCount',
  },
  {
    title: language[currentLang].marketing.marketingCouponStatus,
    align: 'center',
    dataIndex: 'couponStatus',
    key: 'couponStatus',
    render: (row, record) => {
      return record.couponStatus === 'active' ? <Tag color='success'>有效</Tag> : <Tag color='error'>无效</Tag>;
    }
  },
  {
    title: language[currentLang].marketing.marketingCouponExpiredTime,
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