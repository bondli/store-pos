export default {
  type: 'object',
  properties: {
    sn: {
      title: 'style no',
      placeholder: 'input item style no',
      type: 'string',
      required: true,
      widget: 'input'
    },
    name: {
      title: 'item name',
      placeholder: 'input item name',
      type: 'string',
      required: true,
      widget: 'input'
    },
    brand: {
      title: 'item brand',
      placeholder: 'input item brand',
      type: 'string',
      required: true,
      widget: 'input'
    },
    sku: {
      title: 'sku code',
      placeholder: 'input sku code',
      type: 'string',
      required: true,
      widget: 'input'
    },
    color: {
      title: 'item color',
      placeholder: 'input item color',
      type: 'string',
      required: true,
      widget: 'input'
    },
    size: {
      title: 'item size',
      placeholder: 'input item size',
      type: 'string',
      required: true,
      widget: 'input'
    },
    originalPrice: {
      title: 'item original price',
      placeholder: 'input item original price',
      type: 'number',
      required: true,
      widget: 'input'
    },
    costPrice: {
      title: 'item cost price',
      placeholder: 'input item cost price',
      type: 'number',
      required: true,
      widget: 'input'
    },
    counts: {
      title: 'item count',
      placeholder: 'input item count',
      type: 'number',
      required: true,
      widget: 'input'
    }
  }
};