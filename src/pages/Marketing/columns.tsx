import { Space, Tag } from 'antd';
import dayjs from 'dayjs';

import Remove from './Remove';
import Editor from './Editor';
import Detail from './Detail';
import Offline from './Offline';

const columns = [
  {
    title: 'activity name',
    dataIndex: 'marketingName',
    key: 'marketingName',
    fixed: 'left',
  },
  {
    title: 'description',
    dataIndex: 'marketingDesc',
    key: 'marketingDesc',
    ellipsis: true,
  },
  {
    title: 'activity type',
    align: 'center',
    dataIndex: 'marketingType',
    key: 'marketingType',
    enum: {
      'full_send': '满送活动',
      'full_reduce': '满减活动',
      'full_gift': '买赠活动',
    }
  },
  {
    title: 'start time',
    align: 'center',
    dataIndex: 'startTime',
    key: 'startTime',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD'
    }
  },
  {
    title: 'end time',
    align: 'center',
    key: 'endTime',
    dataIndex: 'endTime',
    valueType: 'dateTime',
    valueTypeProps: {
      format: 'YYYY/MM/DD'
    }
  },
  {
    title: 'status',
    align: 'center',
    dataIndex: 'id',
    key: 'id',
    render: (row, record) => {
      const now = dayjs();
      const startTime = dayjs(record.startTime);
      const endTime = dayjs(record.endTime);

      if (now.isBefore(startTime)) {
        return <Tag color="success">未开始</Tag>;
      } else if (now.isAfter(endTime)) {
        return <Tag color="error">已结束</Tag>;
      } else {
        return <Tag color="processing">进行中</Tag>;
      }
    }
  },
  {
    title: 'operation',
    align: 'center',
    render: (row, record) => {
      return (
        <Space>
          <Detail id={record.id} />
          <Editor id={record.id} />
          <Offline id={record.id} />
          <Remove id={record.id} />
        </Space>
      );
    }
  }
];

export default columns;