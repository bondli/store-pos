const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    sn: {
      title: 'style no',
      type: 'string',
      placeholder: 'input style no',
    },
    name: {
      title: 'item name',
      type: 'string',
      placeholder: 'input item name',
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