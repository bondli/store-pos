const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    sku: {
      title: 'sku code',
      type: 'string',
      placeholder: 'input sku code',
    },
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
    brand: {
      title: 'item brand',
      type: 'string',
      placeholder: 'input item brand',
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