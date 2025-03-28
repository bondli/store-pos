import { Space } from 'antd';

import RemoveUser from './RemoveUser';
import Editor from './Editor';
import Detail from './Detail';

const columns = [
  {
    title: 'user phone',
    dataIndex: 'phone',
    key: 'phone',
    copyable: true,
    fixed: 'left',
  },
  {
    title: 'user name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'order actual',
    align: 'right',
    dataIndex: 'actual',
    key: 'actual',
    valueType: 'money',
  },
  {
    title: 'points',
    align: 'right',
    dataIndex: 'point',
    key: 'point',
    valueType: 'number',
  },
  {
    title: 'balance',
    align: 'right',
    key: 'balance',
    dataIndex: 'balance',
    valueType: 'number',
  },
  {
    title: 'birthday',
    align: 'center',
    dataIndex: 'birthday',
    key: 'birthday',
    valueType: 'date',
    valueTypeProps: {
      format: 'MM/DD'
    }
  },
  {
    title: 'create time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
  {
    title: 'operation',
    align: 'center',
    render: (row, record) => {
      return (
        <Space>
          <Detail userPhone={record.phone} />
          <Editor userPhone={record.phone} />
          <RemoveUser userPhone={record.phone} />
        </Space>
      );
    }
  }
];

export default columns;