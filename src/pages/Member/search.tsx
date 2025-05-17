import { useContext } from 'react';
import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';

import language from '@/common/language';
import { MainContext } from '@common/context';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current >= dayjs().endOf('day');
};

const useSearch = () => {
  const { currentLang } = useContext(MainContext);

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
      level: {
        title: language[currentLang].member.searchLabelLevel,
        type: 'string',
        widget: 'select',
        placeholder: language[currentLang].member.searchPlaceholderLevel,
        props: {
          options: [
            { label: '全部', value: '' },
            { label: '普通会员', value: 'normal' },
            { label: '超级会员', value: 'super' },
          ],
        },
      },
    }
  };

  return {
    schema,
    column: 3,
    layoutAuto: true,
    searchText: language[currentLang].common.search,
    resetText: language[currentLang].common.reset,
  };
};

export default useSearch;