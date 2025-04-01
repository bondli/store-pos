export const baseInfoSchema = {
  type: 'object',
  properties: {
    phone: {
      title: 'user phone',
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
      title: 'user name',
      placeholder: 'input user name',
      type: 'string',
      widget: 'input'
    },
    birthday: {
      title: 'user brithday',
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
      title: 'user phone',
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
      title: 'user point',
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    changePoint: {
      title: 'change point',
      placeholder: 'input change point',
      required: true,
      type: 'string',
      widget: 'input',
    },
    type: {
      title: 'change type',
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
      title: 'change reason',
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
      title: 'user phone',
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
      title: 'user balance',
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    inComeBalance: {
      title: 'income balance',
      placeholder: 'input income balance',
      required: true,
      type: 'string',
      widget: 'input',
    },
    sendValue: {
      title: 'send value',
      placeholder: 'input send value',
      required: true,
      type: 'string',
      widget: 'input',
    },
    reason: {
      title: 'change reason',
      placeholder: 'input change reason',
      type: 'string',
      widget: 'input',
    },
  }
};