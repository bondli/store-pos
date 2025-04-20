import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang');

export const baseInfoSchema = {
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
    name: {
      title: language[currentLang].member.tableColumnName,
      placeholder: 'input user name',
      type: 'string',
      widget: 'input'
    },
    birthday: {
      title: language[currentLang].member.tableColumnBirthday,
      placeholder: 'input user brithday',
      type: 'string',
      widget: 'datePicker'
    },
  }
};

export const pointSchema = {
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
      placeholder: 'input change point',
      required: true,
      type: 'string',
      widget: 'input',
    },
    type: {
      title: language[currentLang].member.tableColumnChangeType,
      placeholder: 'input change type',
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
      placeholder: 'input change reason',
      type: 'string',
      widget: 'input',
    },
  }
};

export const balanceSchema = {
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
    balance: {
      title: language[currentLang].member.tableColumnBalance,
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    inComeBalance: {
      title: language[currentLang].member.tableColumnInComeBalance,
      placeholder: 'input income balance',
      required: true,
      type: 'string',
      widget: 'input',
    },
    sendValue: {
      title: language[currentLang].member.tableColumnSendValue,
      placeholder: 'input send value',
      required: true,
      type: 'string',
      widget: 'input',
    },
    reason: {
      title: language[currentLang].member.tableColumnChangeReason,
      placeholder: 'input change reason',
      type: 'string',
      widget: 'input',
    },
  }
};