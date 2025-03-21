import { Space } from 'antd';

import RemoveUser from './RemoveUser';
import Editor from './Editor';
import Detail from './Detail';

const columns = [
  {
    title: 'user phone',
    dataIndex: 'userPhone',
    key: 'userPhone',
    copyable: true,
    fixed: 'left',
  },
  {
    title: 'order actual',
    align: 'right',
    dataIndex: 'userAmount',
    key: 'userAmount',
    valueType: 'money',
    fixed: 'left',
  },
  {
    title: 'points',
    align: 'right',
    dataIndex: 'userPoint',
    key: 'userPoint',
    valueType: 'number',
    fixed: 'left',
  },
  {
    title: 'balance',
    align: 'right',
    key: 'userBalance',
    dataIndex: 'userBalance',
    valueType: 'money',
    fixed: 'left',
  },
  {
    title: 'brithday',
    align: 'center',
    dataIndex: 'userBirthday',
    key: 'userBirthday',
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
          <Detail userPhone={record.userPhone} />
          <Editor userPhone={record.userPhone} />
          <RemoveUser userPhone={record.userPhone} />
        </Space>
      );
    }
  }
];

export default columns;