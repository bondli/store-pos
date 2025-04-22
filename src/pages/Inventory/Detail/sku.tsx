import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';
const skuColumns = [
  {
    title: language[currentLang].inventory.tableColumnSku,
    dataIndex: 'sku',
    key: 'sku',
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
  },
];

export default skuColumns;