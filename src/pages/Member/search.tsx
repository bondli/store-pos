import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current >= dayjs().endOf('day');
};

const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    createdAt: {
      title: 'create time',
      bind: ['startDate', 'endDate'],
      type: 'range',
      format: 'date',
      props: {
        disabledDate,
      },
    },
    phone: {
      title: 'user phone',
      type: 'string',
      placeholder: 'input member phone',
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