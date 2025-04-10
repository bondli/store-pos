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
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{text}</span>
          <span style={{ color: 'gray', marginLeft: '5px' }}>[{record.color} / {record.size}]</span>
        </div>
      );
    },
  },
  {
    title: 'original',
    align: 'center',
    key: 'originalPrice',
    dataIndex: 'originalPrice',
    valueType: 'money',
  },
  {
    title: 'actual',
    align: 'center',
    key: 'actualPrice',
    dataIndex: 'actualPrice',
    valueType: 'money',
  },
  {
    title: 'discount',
    align: 'center',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    title: 'counts',
    align: 'center',
    dataIndex: 'counts',
    key: 'counts',
  },
  {
    title: 'status',
    align: 'center',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => {
      return text === 'refund' ? '已退货' : '正常';
    },
  },
];

export default itemColumns;