import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';

const columns = [
  {
    title: language[currentLang].inventory.tableColumnSku,
    dataIndex: 'sku',
    key: 'sku',
    copyable: true,
  },
  {
    title: language[currentLang].inventory.tableColumnStyleNo,
    dataIndex: 'sn',
    key: 'sn',
    copyable: true,
  },
  {
    title: language[currentLang].inventory.tableColumnColor,
    align: 'center',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: language[currentLang].inventory.tableColumnSize,
    align: 'center',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: language[currentLang].inventory.tableColumnOriginalPrice,
    align: 'center',
    key: 'originalPrice',
    dataIndex: 'originalPrice',
    valueType: 'money',
  },
  {
    title: language[currentLang].inventory.tableColumnCounts,
    align: 'center',
    dataIndex: 'counts',
    key: 'counts',
    render: (row, record) => {
      return <div style={{ color: record.counts <= 1 ? 'red' : 'green' }}>{record.counts || 0}</div>;
    }
  },
  {
    title: language[currentLang].inventory.tableColumnSaleCounts,
    align: 'center',
    dataIndex: 'saleCounts',
    key: 'saleCounts',
    render: (row, record) => {
      return <div style={{ color: record.saleCounts > 5 ? 'red' : 'green' }}>{record.saleCounts || 0}</div>;
    }
  },
];

export default columns;