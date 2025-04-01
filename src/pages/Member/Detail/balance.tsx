const balanceColumns = [
  {
    title: 'change value',
    dataIndex: 'value',
    key: 'value',
    fixed: 'left',
  },
  {
    title: 'change type',
    dataIndex: 'type',
    key: 'type',
    enum: {
      use: `消费`,
      income: `充值`,
      send: `充值赠送`
    },
  },
  {
    title: 'change reason',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'update time',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
];

export default balanceColumns;