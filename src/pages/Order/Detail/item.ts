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
    render: (text: string, record: any) => {
      return `${text}[${record.color} / ${record.size}]`;
    },
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
    title: 'discount',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    title: 'counts',
    dataIndex: 'counts',
    key: 'counts',
  },
];

export default itemColumns;