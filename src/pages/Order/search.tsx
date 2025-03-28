import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';

import { getStore } from '@common/electron';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current >= dayjs().endOf('day');
};

const salerList = getStore('salerList') || [];
const newSalers = [];
salerList.forEach((item) => {
  newSalers.push({ value: item.id, label: item.name });
});

const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    createdAt: {
      title: 'create time',
      bind: ['start', 'end'],
      type: 'range',
      format: 'date',
      props: {
        disabledDate,
      },
    },
    userPhone: {
      title: 'user phone',
      type: 'string',
      placeholder: 'input member phone',
    },
    payType: {
      title: 'pay channel',
      type: 'string',
      widget: 'select',
      props: {
        options: [
          { label: '全部', value: '' },
          { label: '微信', value: 'weixin' },
          { label: '支付宝', value: 'alipay' },
          { label: '现金', value: 'cash' },
          { label: '银行卡', value: 'card' },
          { label: '其他', value: 'other' },
        ],
      },
      placeholder: 'select pay channel',
    },
    orderSn: {
      title: 'order sn',
      type: 'string',
      placeholder: 'input order sn',
    },
    salerId: {
      title: 'saler name',
      type: 'string',
      widget: 'select',
      props: {
        options: newSalers,
      },
      placeholder: 'select saler name',
    },
  }
};

export default {
  schema,
  column: 3,
  layoutAuto: true,
  searchText: 'search',
  resetText: 'reset',
};