import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

export const useBaseInfoSchema = () => {
  const { currentLang } = useContext(MainContext);

  const baseInfoSchema = {
    type: 'object',
    properties: {
      phone: {
        title: language[currentLang].member.tableColumnPhone,
        type: 'string',
        required: true,
        max: 11,
        min: 11,
        placeholder: language[currentLang].member.searchPlaceholderPhone,
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      name: {
        title: language[currentLang].member.tableColumnName,
        placeholder: language[currentLang].member.searchPlaceholderName,
        type: 'string',
        widget: 'input'
      },
      birthday: {
        title: language[currentLang].member.tableColumnBirthday,
        placeholder: language[currentLang].member.searchPlaceholderBirthday,
        type: 'string',
        widget: 'datePicker'
      },
    }
  };

  return baseInfoSchema;
};

export const usePointSchema = () => {
  const { currentLang } = useContext(MainContext);

  const pointSchema = {
    type: 'object',
    properties: {
      phone: {
        title: language[currentLang].member.tableColumnPhone,
        type: 'string',
        required: true,
        max: 11,
        min: 11,
        placeholder: 'input user phone',
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      point: {
        title: language[currentLang].member.tableColumnCurrentPoint,
        type: 'string',
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      changePoint: {
        title: language[currentLang].member.tableColumnChangePoint,
        placeholder: language[currentLang].member.searchPlaceholderChangePoint,
        required: true,
        type: 'string',
        widget: 'input',
      },
      type: {
        title: language[currentLang].member.tableColumnChangeType,
        placeholder: language[currentLang].member.searchPlaceholderChangeType,
        required: true,
        type: 'string',
        widget: 'select',
        props: {
          options: [
            { label: '手动增加', value: 'manualAdd' },
            { label: '手动减少', value: 'manualReduce' },
          ]
        }
      },
      reason: {
        title: language[currentLang].member.tableColumnChangeReason,
        placeholder: language[currentLang].member.searchPlaceholderChangeReason,
        type: 'string',
        widget: 'input',
      },
    },
  };

  return pointSchema;
};
