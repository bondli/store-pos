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
  }
};

export default {
  schema,
  column: 3,
  layoutAuto: true,
  searchText: 'search',
  resetText: 'reset',
};