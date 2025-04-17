import { Space, Tag } from 'antd';

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
    render: (row, record) => {
      if (record.level === 'super') {
        return (
          <>
            <Tag color='green'>超级会员</Tag>
            {row && <span>{row}</span>}
          </>
        );
      } else {
        return (
          <>
            <Tag color='blue'>普通会员</Tag>
            {row && <span>{row}</span>}
          </>
        );
      }
    },
  },
  {
    title: 'actual',
    align: 'center',
    dataIndex: 'actual',
    key: 'actual',
    render: (row) => {
      return `¥${row || 0}`;
    },
  },
  {
    title: 'points',
    align: 'center',
    dataIndex: 'point',
    key: 'point',
    valueType: 'number',
  },
  {
    title: 'balance',
    align: 'center',
    key: 'balance',
    dataIndex: 'balance',
    valueType: 'number',
  },
  {
    title: 'coupon',
    align: 'center',
    dataIndex: 'coupon',
    key: 'coupon',
    valueType: 'number',
  },
  {
    title: 'createdAt',
    align: 'center',
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
        </Space>
      );
    }
  }
];

export default columns;