export default {
  type: 'object',
  properties: {
    payType: {
      title: 'Pay Type',
      type: 'string',
      required: true,
      placeholder: 'select pay type',
      widget: 'Select',
    },
    orderActualMount: {
      title: 'Actual Mount',
      placeholder: 'input actual mount',
      type: 'string',
      widget: 'input',
    },
    salerId: {
      title: 'Saler',
      placeholder: 'select saler',
      type: 'string',
      required: true,
      widget: 'Select',
    },
    user: {
      title: 'User',
      placeholder: 'input user phone',
      type: 'string',
      widget: 'input',
    },
  }
};