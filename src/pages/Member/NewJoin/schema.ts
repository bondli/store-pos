import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current >= dayjs().endOf('day');
};

export default {
  type: 'object',
  properties: {
    phone: {
      title: 'user phone',
      type: 'string',
      required: true,
      max: 11,
      min: 11,
      placeholder: 'input user phone',
      widget: 'input'
    },
    name: {
      title: 'user name',
      placeholder: 'input user name',
      type: 'string',
      widget: 'input'
    },
    birthday: {
      title: 'user birthday',
      placeholder: 'input user birthday',
      type: 'string',
      widget: 'datePicker',
      props: {
        disabledDate,
      },
    },
  }
};