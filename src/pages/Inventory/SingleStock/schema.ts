export default {
  type: 'object',
  properties: {
    sn: {
      title: 'style no',
      type: 'string',
      required: true,
      placeholder: 'input item style no',
      widget: 'input'
    },
    name: {
      title: 'item name',
      placeholder: 'input item name',
      type: 'string',
      widget: 'input'
    },
    brand: {
      title: 'item brand',
      placeholder: 'input item brand',
      type: 'string',
      widget: 'input'
    },
    sku: {
      title: 'sku code',
      placeholder: 'input sku code',
      type: 'string',
      widget: 'input'
    },
    color: {
      title: 'item color',
      placeholder: 'input item color',
      type: 'string',
      widget: 'input'
    },
    size: {
      title: 'item size',
      placeholder: 'input item size',
      type: 'string',
      widget: 'input'
    },
    originalPrice: {
      title: 'item original price',
      placeholder: 'input item original price',
      type: 'number',
      widget: 'input'
    },
    costPrice: {
      title: 'item cost price',
      placeholder: 'input item cost price',
      type: 'number',
      widget: 'input'
    },
    counts: {
      title: 'item count',
      placeholder: 'input item count',
      type: 'number',
      widget: 'input'
    }
  }
};