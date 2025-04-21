import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';

const balanceColumns = [
  {
    title: language[currentLang].member.tableColumnChangeValue,
    dataIndex: 'value',
    key: 'value',
    fixed: 'left',
  },
  {
    title: language[currentLang].member.tableColumnChangeType,
    dataIndex: 'type',
    key: 'type',
    enum: {
      use: `消费`,
      income: `充值`,
      send: `充值赠送`
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

export default balanceColumns;