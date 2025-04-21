import { Space, Tag } from 'antd';

import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';

import Editor from './Editor';
import Detail from './Detail';

const columns = [
  {
    title: language[currentLang].member.tableColumnPhone,
    dataIndex: 'phone',
    key: 'phone',
    copyable: true,
    fixed: 'left',
  },
  {
    title: language[currentLang].member.tableColumnName,
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
    title: language[currentLang].member.tableColumnActual,
    align: 'center',
    dataIndex: 'actual',
    key: 'actual',
    render: (row) => {
      return `¥${row || 0}`;
    },
  },
  {
    title: language[currentLang].member.tableColumnPoints,
    align: 'center',
    dataIndex: 'point',
    key: 'point',
    valueType: 'number',
  },
  {
    title: language[currentLang].member.tableColumnBalance,
    align: 'center',
    key: 'balance',
    dataIndex: 'balance',
    valueType: 'number',
  },
  {
    title: language[currentLang].member.tableColumnCoupon,
    align: 'center',
    dataIndex: 'coupon',
    key: 'coupon',
    valueType: 'number',
  },
  {
    title: language[currentLang].member.tableColumnCreatedAt,
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD HH:mm:ss'
    }
  },
  {
    title: language[currentLang].member.tableColumnOperation,
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