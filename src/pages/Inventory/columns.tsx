import { Space } from 'antd';

import Editor from './Editor';
import Detail from './Detail';

const columns = [
  {
    title: 'style no',
    dataIndex: 'sn',
    key: 'sn',
    fixed: 'left',
    copyable: true,
  },
  {
    title: 'item name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'brand',
    dataIndex: 'brand',
    key: 'brand',
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
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'original',
    align: 'right',
    key: 'originalPrice',
    dataIndex: 'originalPrice',
    valueType: 'money',
  },
  {
    title: 'counts',
    align: 'center',
    dataIndex: 'counts',
    key: 'counts',
  },
  {
    title: 'operation',
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