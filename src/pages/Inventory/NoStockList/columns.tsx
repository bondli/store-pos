import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useNoStockListColumns = () => {
  const { currentLang } = useContext(MainContext);

  const columns = [
    {
      title: language[currentLang].inventory.tableColumnSku,
      dataIndex: 'sku',
      key: 'sku',
      copyable: true,
    },
    {
      title: language[currentLang].inventory.tableColumnStyleNo,
      dataIndex: 'sn',
      key: 'sn',
      copyable: true,
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
    {
      title: language[currentLang].inventory.tableColumnSaleCounts,
      align: 'center',
      dataIndex: 'saleCounts',
      key: 'saleCounts',
    },
  ];

  return columns;
};

export default useNoStockListColumns;