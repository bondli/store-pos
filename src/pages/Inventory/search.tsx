const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    sku: {
      title: 'sku code',
      type: 'string',
      placeholder: 'input sku code',
      props: {
        allowClear: true,
      },
    },
    sn: {
      title: 'style no',
      type: 'string',
      placeholder: 'input style no',
      props: {
        allowClear: true,
      },
    },
    name: {
      title: 'item name',
      type: 'string',
      placeholder: 'input item name',
      props: {
        allowClear: true,
      },
    },
    brand: {
      title: 'item brand',
      type: 'string',
      placeholder: 'input item brand',
      props: {
        allowClear: true,
      },
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