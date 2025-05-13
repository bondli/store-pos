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

export const useNewJoinSchema = () => {
  const { currentLang } = useContext(MainContext);

  const newJoinSchema = {
    type: 'object',
    properties: {
      phone: {
        title: language[currentLang].member.tableColumnPhone,
        type: 'string',
        required: true,
        max: 11,
        min: 11,
        placeholder: language[currentLang].member.searchPlaceholderPhone,
        widget: 'input'
      },
      name: {
        title: language[currentLang].member.tableColumnName,
        placeholder: language[currentLang].member.searchPlaceholderName,
        type: 'string',
        widget: 'input'
      },
      birthday: {
        title: language[currentLang].member.tableColumnBirthday,
        type: 'string',
        widget: 'datePicker',
        props: {
          disabledDate,
        },
      },
    },
  };

  return newJoinSchema;
};