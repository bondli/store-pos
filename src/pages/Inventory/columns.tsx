import { Space } from 'antd';

import Editor from './Editor';
import Detail from './Detail';

import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang');

const columns = [
  {
    title: language[currentLang].inventory.tableColumnStyleNo,
    dataIndex: 'sn',
    key: 'sn',
    fixed: 'left',
    copyable: true,
  },
  {
    title: language[currentLang].inventory.tableColumnName,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: language[currentLang].inventory.tableColumnBrand,
    dataIndex: 'brand',
    key: 'brand',
    fixed: 'left',
  },
  {
    title: language[currentLang].inventory.tableColumnSku,
    dataIndex: 'sku',
    key: 'sku',
    copyable: true,
  },
  {
    title: language[currentLang].inventory.tableColumnColor,
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: language[currentLang].inventory.tableColumnSize,
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: language[currentLang].inventory.tableColumnOriginalPrice,
    align: 'right',
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
  {
    title: language[currentLang].inventory.tableColumnOperation,
    align: 'center',
    render: (row, record) => {
      return (
        <Space>
          <Detail sku={record.sku} sn={record.sn} />
          <Editor sku={record.sku} sn={record.sn} />
        </Space>
      );
    }
  }
];

export default columns;