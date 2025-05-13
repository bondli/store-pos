import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useColumns = () => {
  const { currentLang } = useContext(MainContext);

  const columns = [
    {
      title: language[currentLang].order.tableColumnStyleNo,
      dataIndex: 'sn',
      key: 'sn',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnSkuCode,
      align: 'center',
      dataIndex: 'sku',
      key: 'sku',
      copyable: true,
    },
    {
      title: language[currentLang].order.tableColumnCounts,
      align: 'center',
      dataIndex: 'counts',
      key: 'counts',
    },
    {
      title: language[currentLang].order.tableColumnSize,
      align: 'center',
      key: 'size',
      dataIndex: 'size',
    },
    {
      title: language[currentLang].order.tableColumnColor,
      align: 'center',
      key: 'color',
      dataIndex: 'color',
    },
    {
      title: language[currentLang].order.tableColumnOriginal,
      align: 'center',
      key: 'originalPrice',
      dataIndex: 'originalPrice',
      valueType: 'money',
    },
    {
      title: language[currentLang].order.tableColumnActual,
      align: 'center',
      key: 'actualPrice',
      dataIndex: 'actualPrice',
      render: (row, record) => {
        return record.actualPrice >= 0 ? <span>￥{record.actualPrice}</span> : '--';
      },
    },
    // {
    //   title: language[currentLang].order.tableColumnDiscount,
    //   align: 'center',
    //   dataIndex: 'discount',
    //   key: 'discount',
    // },
    {
      title: language[currentLang].order.tableColumnStatus,
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        return text === 'refund' ? '已退货' : '正常';
      },
    },
  ];

  return columns;
};

export default useColumns;