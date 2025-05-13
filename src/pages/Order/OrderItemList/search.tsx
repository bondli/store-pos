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
        title: language[currentLang].order.searchLabelCreatedAt,
        bind: ['start', 'end'],
        type: 'range',
        format: 'date',
        props: {
          disabledDate,
          defaultValue: [dayjs(), dayjs()],
        },
      },
    }
  };

  return {
    schema,
    column: 2,
    layoutAuto: true,
    searchText: language[currentLang].common.search,
    resetText: language[currentLang].common.reset,
  };
};

export default useSearch;