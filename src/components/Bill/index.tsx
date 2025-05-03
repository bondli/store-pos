import React, { memo, Fragment } from 'react';
import dayjs from 'dayjs';

import StoreLogo from '@/components/StoreLogo';
import { PAY_CHANNEL } from '@/common/constant';

type ComProps = {
  orderInfo: any;
  orderItems?: any[];
  memberInfo?: any;
};

// 格式化手机号，中间四位用*代替
const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 格式化金额，保留两位小数
const formatPrice = (price: number) => {
  return Number(price).toFixed(2);
};

const Bill: React.FC<ComProps> = (props) => {
  const { orderInfo = {}, orderItems = [], memberInfo = {} } = props;

  if (!orderInfo) {
    return null;
  }

  const dataSource = [
    {
      key: '1',
      label: '订单编号',
      value: orderInfo.orderSn,
    },
    {
      key: '2',
      label: '订单时间',
      value: dayjs(orderInfo.createdAt).format('YYYY-MM-DD'),
    },
    {
      key: '3',
      label: '商品数量',
      value: orderInfo.orderItems,
    },
  ];
  // 如果有会员，则添加会员信息
  if (orderInfo.userPhone) {
    dataSource.push({
      key: '4',
      label: '会员信息',
      value: formatPhoneNumber(orderInfo.userPhone),
    });
  }
  // 如果订单金额大于0，且有会员信息，则添加积分信息
  if (orderInfo.orderActualAmount > 0 && orderInfo.userPhone) {
    dataSource.push({
      key: '5',
      label: '本次积分',
      value: orderInfo.orderActualAmount,
    });
  }
  if (orderInfo.orderAmount > 0) {
    dataSource.push({
      key: '6',
      label: '应收金额',
      value: orderInfo.orderAmount,
    });
  }
  // 如果使用了积分，则添加积分信息
  if (orderInfo.usePoint > 0) {
    dataSource.push({
      key: '7',
      label: `${orderInfo.usePoint}积分抵扣`,
      value: `-￥${Number(orderInfo.usePoint / 100).toFixed(2)}`,
    });
  }
  // 如果使用了优惠券，则添加优惠券信息
  if (orderInfo.useCoupon > 0) {
    dataSource.push({
      key: '8',
      label: '优惠券抵扣',
      value: `-￥${orderInfo.useCoupon}`,
    });
  }
  // 如果使用了余额，则添加余额信息
  if (orderInfo.useBalance > 0) {
    dataSource.push({
      key: '9',
      label: '余额抵扣',
      value: `-￥${orderInfo.useBalance}`,
    });
  }
  dataSource.push({
    key: '10',
    label: '实收金额',
    value: `￥${orderInfo.orderActualAmount} [${PAY_CHANNEL[orderInfo.payType] || '其他'}]`,
  });

  const getItemsContent = () => {
    if (orderItems.length === 0) {
      return null;
    }
    return (
      <table style={{ width: '100%', margin: '10px 0' }}>
        <thead>
          <tr style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <th style={{ textAlign: 'left' }}>款式/品名</th>
            <th style={{ textAlign: 'center' }}>数量</th>
            <th style={{ textAlign: 'center' }}>吊牌价</th>
            <th style={{ textAlign: 'center' }}>实收</th>
          </tr>
        </thead>
        <tbody>
          {
            orderItems.map((item) => (
              <Fragment key={`${item.id}-${item.sku}`}>
                <tr style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  <td colSpan={4} style={{ textAlign: 'left' }}>{item.sku}/{item.name}</td>
                </tr>
                <tr style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  <td></td>
                  <td style={{ textAlign: 'center' }}>{item.counts}</td>
                  <td style={{ textAlign: 'center' }}>{formatPrice(item.originalPrice)}</td>
                  <td style={{ textAlign: 'center' }}>{formatPrice(item.actualPrice)}</td>
                </tr>
              </Fragment>
            ))
          }
        </tbody>
      </table>
    );
  };

  const getMemberContent = () => {
    if (!orderInfo.userPhone) {
      return null;
    }
    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', fontSize: '14px', padding: '30px 0 10px' }}>
          <span>会员信息</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #999' }}>
          <span style={{ fontSize: '12px' }}>会员积分</span>
          <span style={{ fontSize: '12px' }}>{memberInfo.point}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #999' }}>
          <span style={{ fontSize: '12px' }}>优惠券</span>
          <span style={{ fontSize: '12px' }}>{memberInfo.coupon}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #999' }}>
          <span style={{ fontSize: '12px' }}>会员余额</span>
          <span style={{ fontSize: '12px' }}>{memberInfo.balance}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
      <div style={{ textAlign: 'center', fontSize: '16px', padding: '10px 0 30px' }}>
        <span>戴维贝拉世纪金源店</span>
      </div>
      {
        dataSource.map((item) => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #999' }}>
            <span style={{ fontSize: '12px' }}>{item.label}</span>
            <span style={{ fontSize: '12px' }}>{item.value}</span>
          </div>
        ))
      }
      {
        getItemsContent()
      }
      {
        getMemberContent()
      }
      <div style={{ textAlign: 'center', fontSize: '12px', padding: '10px 0', lineHeight: '1.5' }}>
        如需换货，请确保吊牌完好<br />不影响二次销售的情况下<br />携带小票到店换货
      </div>
      <div style={{ textAlign: 'center', fontSize: '12px', padding: '10px 0', lineHeight: '1.5' }}>
        店长微信：17757058183
      </div>
      <div style={{ textAlign: 'center', fontSize: '16px', padding: '10px 0 30px' }}>
        <span>谢谢惠顾</span>
      </div>
      <StoreLogo />
    </div>
  );
};

export default memo(Bill);
