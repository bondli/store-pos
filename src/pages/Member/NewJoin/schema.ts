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
      title: 'user brithday',
      placeholder: 'input user brithday',
      type: 'string',
      widget: 'datePicker'
    },
  }
};