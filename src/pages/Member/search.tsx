import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';

import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang');

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current >= dayjs().endOf('day');
};

const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    createdAt: {
      title: language[currentLang].member.searchLabelCreatedAt,
      bind: ['startDate', 'endDate'],
      type: 'range',
      format: 'date',
      props: {
        disabledDate,
      },
    },
    phone: {
      title: language[currentLang].member.searchLabelPhone,
      type: 'string',
      placeholder: language[currentLang].member.searchPlaceholderPhone,
      props: {
        allowClear: true,
      },
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