import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';

import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';

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
      title: language[currentLang].order.searchLabelCreatedAt,
      bind: ['start', 'end'],
      type: 'range',
      format: 'date',
      props: {
        disabledDate,
        defaultValue: [dayjs(), dayjs()],
      },
    },
    userPhone: {
      title: language[currentLang].order.searchLabelUserPhone,
      type: 'string',
      placeholder: language[currentLang].order.searchPlaceholderUserPhone,
    },
    payType: {
      title: language[currentLang].order.searchLabelPayType,
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
      placeholder: language[currentLang].order.searchPlaceholderPayType,
    },
    orderSn: {
      title: language[currentLang].order.searchLabelOrderSn,
      type: 'string',
      placeholder: language[currentLang].order.searchPlaceholderOrderSn,
    },
    salerId: {
      title: language[currentLang].order.searchLabelSalerName,
      type: 'string',
      widget: 'select',
      props: {
        options: newSalers,
      },
      placeholder: language[currentLang].order.searchPlaceholderSalerName,
    },
  }
};

export default {
  schema,
  column: 3,
  layoutAuto: true,
  searchText: language[currentLang].common.search,
  resetText: language[currentLang].common.reset,
};