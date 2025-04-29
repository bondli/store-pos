import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';

export const balanceSchema = {
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
    balance: {
      title: language[currentLang].member.tableColumnBalance,
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    inComeBalance: {
      title: language[currentLang].member.tableColumnInComeBalance,
      placeholder: language[currentLang].member.searchPlaceholderIncomeBalance,
      required: true,
      type: 'string',
      widget: 'input',
    },
    sendValue: {
      title: language[currentLang].member.tableColumnSendValue,
      placeholder: language[currentLang].member.searchPlaceholderSendValue,
      required: true,
      type: 'string',
      widget: 'input',
    },
    sendValueType: {
      title: language[currentLang].member.tableColumnSendValueType,
      placeholder: language[currentLang].member.searchPlaceholderSendValueType,
      required: true,
      type: 'string',
      widget: 'select',
      props: {
        options: [
          { label: '现金余额', value: 'balance' },
          { label: '商品吊牌价值', value: 'goodsValue' },
        ]
      }
    },
    reason: {
      title: language[currentLang].member.tableColumnChangeReason,
      placeholder: language[currentLang].member.searchPlaceholderChangeReason,
      type: 'string',
      widget: 'input',
    },
  }
};