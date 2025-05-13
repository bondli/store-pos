
import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useSkuColumns = () => {
  const { currentLang } = useContext(MainContext);

  const skuColumns = [
  {
    title: language[currentLang].inventory.tableColumnSku,
    dataIndex: 'sku',
    key: 'sku',
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

  return skuColumns;
};

export default useSkuColumns;