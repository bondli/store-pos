import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useCouponColumns = () => {
  const { currentLang } = useContext(MainContext);

  const couponColumns = [
    {
      title: language[currentLang].order.tableColumnCouponId,
      dataIndex: 'couponId',
      key: 'couponId',
      fixed: 'left',
      align: 'center',
    },
    {
      title: language[currentLang].order.tableColumnCouponDesc,
      dataIndex: 'couponDesc',
      key: 'couponDesc',
    },
    {
      title: language[currentLang].order.tableColumnCouponType,
      key: 'couponType',
      dataIndex: 'couponType',
      align: 'center',
      enum: {
        store: '店铺优惠券',
        member: '会员优惠券',
      },
    },
    {
      title: language[currentLang].order.tableColumnUsedValue,
      key: 'usedValue',
      dataIndex: 'usedValue',
      align: 'center',
      valueType: 'money',
    },
    {
      title: language[currentLang].order.tableColumnUsedTime,
      dataIndex: 'usedTime',
      key: 'usedTime',
      align: 'center',
      valueType: 'dateTime',
    },
  ];

  return couponColumns;
};

export default useCouponColumns;