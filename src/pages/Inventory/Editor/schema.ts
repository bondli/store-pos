export default {
  type: 'object',
  properties: {
    sku: {
      title: 'sku',
      type: 'string',
      required: true,
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    name: {
      title: 'item name',
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    brand: {
      title: 'brand',
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    color: {
      title: 'color',
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    size: {
      title: 'color',
      type: 'string',
      widget: 'input',
      readonly: true,
      disabled: true,
    },
    counts: {
      title: 'counts',
      type: 'number',
      widget: 'input',
    },
  }
};