import { getStore } from '@common/electron';

const salerList = getStore('salerList') || [];
const newSalers = [];
salerList.forEach((item) => {
  newSalers.push({ value: item.id, label: item.name });
});

export default {
  type: 'object',
  properties: {
    payType: {
      title: 'Pay Type',
      type: 'string',
      required: true,
      placeholder: 'select pay type',
      widget: 'select',
      props: {
        options: [
          { label: '支付宝', value: 'alipay' },
          { label: '微信', value: 'weixin' },
          { label: '现金', value: 'cash' },
          { label: '银行卡', value: 'card' },
          { label: '其他', value: 'other' },
        ]
      },
    },
    orderActualAmount: {
      title: 'Actual Mount',
      placeholder: 'input actual mount',
      type: 'number',
      required: true,
      widget: 'input',
    },
    salerId: {
      title: 'Saler',
      placeholder: 'select saler',
      type: 'number',
      required: true,
      widget: 'select',
      props: {
        options: newSalers,
      },
    },
    userPhone: {
      title: 'User',
      placeholder: 'input user phone',
      type: 'string',
      widget: 'input',
    },
  }
};