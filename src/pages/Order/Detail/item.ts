const itemColumns = [
  {
    title: 'style no',
    dataIndex: 'sn',
    key: 'sn',
    fixed: 'left',
  },
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
    key: 'size',
    dataIndex: 'size',
  },
  {
    title: 'original',
    key: 'originalPrice',
    dataIndex: 'originalPrice',
    valueType: 'money',
  },
  {
    title: 'actual',
    key: 'actualPrice',
    dataIndex: 'actualPrice',
    valueType: 'money',
  },
  {
    title: 'disCout',
    dataIndex: 'counts', // todo:待实现
    key: 'counts1',
  },
  {
    title: 'counts',
    dataIndex: 'counts',
    key: 'counts',
  },
];

export default itemColumns;