import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang');

const pointColumns = [
  {
    title: language[currentLang].member.tableColumnChangeValue,
    dataIndex: 'point',
    key: 'point',
    fixed: 'left',
  },
  {
    title: language[currentLang].member.tableColumnChangeType,
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
    title: language[currentLang].member.tableColumnChangeReason,
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: language[currentLang].member.tableColumnUpdateTime,
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
];

export default pointColumns;