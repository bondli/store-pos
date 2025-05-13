import { useContext } from 'react';
import { Space, Tag } from 'antd';
import dayjs from 'dayjs';

import language from '@/common/language';
import { MainContext } from '@common/context';

import Remove from './Remove';
import Editor from './Editor';
import Detail from './Detail';
import Offline from './Offline';

const useColumns = () => {
  const { currentLang, userInfo } = useContext(MainContext);

  const columns = [
    {
      title: language[currentLang].marketing.tableColumnName,
      dataIndex: 'marketingName',
      key: 'marketingName',
      fixed: 'left',
    },
    {
      title: language[currentLang].marketing.tableColumnDesc,
      dataIndex: 'marketingDesc',
      key: 'marketingDesc',
      ellipsis: true,
    },
    {
      title: language[currentLang].marketing.tableColumnType,
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
      title: language[currentLang].marketing.tableColumnStartTime,
      align: 'center',
      dataIndex: 'startTime',
      key: 'startTime',
      valueType: 'dateTime',
      valueTypeProps: {
        format: 'YYYY/MM/DD'
      }
    },
    {
      title: language[currentLang].marketing.tableColumnEndTime,
      align: 'center',
      key: 'endTime',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      valueTypeProps: {
        format: 'YYYY/MM/DD'
      }
    },
    {
      title: language[currentLang].marketing.tableColumnStatus,
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
      title: language[currentLang].marketing.tableColumnOperation,
      align: 'center',
      render: (row, record) => {
        let status = 'active';
        const now = dayjs();
        const endTime = dayjs(record.endTime);

        if (now.isAfter(endTime)) {
          status = 'offline';
        }
        return (
          <Space>
            <Detail id={record.id} />
            {
              userInfo?.role === 'admin' ? <Editor id={record.id} /> : null
            }
            {
              userInfo?.role === 'admin' ? <Offline id={record.id} status={status} /> : null
            }
            {
              userInfo?.role === 'admin' ? <Remove id={record.id} /> : null
            }
          </Space>
        );
      }
    }
  ];

  return columns;
};

export default useColumns;