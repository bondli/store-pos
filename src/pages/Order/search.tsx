const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    createdAt: {
      title: 'create time',
      bind: ['startDate', 'endDate'],
      type: 'range',
      format: 'dateTime'
    },
    userPhone: {
      title: 'user phone',
      type: 'string',
      placeholder: 'input member phone',
    },
    payType: {
      title: 'pay channel',
      type: 'string',
      widget: 'select',
      props: {
        options: [
          { label: '全部', value: '' },
          { label: '微信', value: 'weixin' },
          { label: '支付宝', value: 'alipay' },
          { label: '现金', value: 'cash' },
          { label: '银行卡', value: 'card' },
          { label: '其他', value: 'other' },
        ],
      },
      placeholder: 'select pay channel',
    },
    orderSn: {
      title: 'order sn',
      type: 'string',
      placeholder: 'input order sn',
    },
    salerName: {
      title: 'saler name',
      type: 'string',
      placeholder: 'input saler name',
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