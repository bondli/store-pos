const skuColumns = [
  {
    title: 'sku code',
    dataIndex: 'sku',
    key: 'sku',
  },
  {
    title: 'color',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: 'size',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'original',
    align: 'right',
    key: 'originalPrice',
    dataIndex: 'originalPrice',
    valueType: 'money',
  },
  {
    title: 'counts',
    align: 'center',
    dataIndex: 'counts',
    key: 'counts',
  },
];

export default skuColumns;