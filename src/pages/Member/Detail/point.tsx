const pointColumns = [
  {
    title: 'change value',
    dataIndex: 'point',
    key: 'point',
    fixed: 'left',
  },
  {
    title: 'change type',
    dataIndex: 'type',
    key: 'type',
    enum: {
      earn: `购物赚取`,
      use: `购物抵扣`,
      refund: `退货回滚`,
      exchange: `换货退补`,
      manualAdd: `手动增加`,
      manualReduce: `手动减少`,
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

export default pointColumns;