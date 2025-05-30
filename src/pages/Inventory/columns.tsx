import { useContext } from 'react';
import { Space } from 'antd';

import Editor from './Editor';
import Detail from './Detail';

import language from '@/common/language';
import { MainContext } from '@common/context';

const useColumns = () => {
  const { currentLang, userInfo } = useContext(MainContext);

  const columns = [
    {
      title: language[currentLang].inventory.tableColumnStyleNo,
      dataIndex: 'sn',
      key: 'sn',
      fixed: 'left',
      copyable: true,
      render: (text: string, record: any) => {
        return (
          <>
            <div>{text}</div>
            <div style={{ color: 'gray', fontSize: '12px' }}>{record.name}</div>
          </>
        );
      },
    },
    {
      title: language[currentLang].inventory.tableColumnSku,
      dataIndex: 'sku',
      key: 'sku',
      copyable: true,
    },
    {
      title: language[currentLang].inventory.tableColumnName,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    // {
    //   title: language[currentLang].inventory.tableColumnBrand,
    //   dataIndex: 'brand',
    //   key: 'brand',
    //   fixed: 'left',
    // },
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
    {
      title: language[currentLang].inventory.tableColumnSaleCounts,
      align: 'center',
      dataIndex: 'saleCounts',
      key: 'saleCounts',
    },
    {
      title: language[currentLang].inventory.tableColumnOperation,
      align: 'center',
      render: (row, record) => {
        return (
          <Space>
            <Detail sku={record.sku} sn={record.sn} />
            {
              userInfo?.role === 'admin' ? (
                <Editor sku={record.sku} sn={record.sn} />
              ) : null
            }
          </Space>
        );
      }
    }
  ];

  // 如果是管理员，在吊牌价后增加一列，显示进货价
  if (userInfo?.role === 'admin') {
    const hasCostPrice = columns.some(col => col.dataIndex === 'costPrice');
    if (!hasCostPrice) {
      const index = columns.findIndex(col => col.dataIndex === 'originalPrice');
      columns.splice(index + 1, 0, {
        title: language[currentLang].inventory.tableColumnCostPrice,
        align: 'center',
        dataIndex: 'costPrice',
        key: 'costPrice',
        valueType: 'money',
      });
    }
  }

  return columns;
};

export default useColumns;