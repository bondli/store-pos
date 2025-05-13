
import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useItemColumns = () => {
  const { currentLang } = useContext(MainContext);

  const itemColumns = [
    {
      title: language[currentLang].order.tableColumnStyleNo,
      dataIndex: 'sn',
      key: 'sn',
      fixed: 'left',
    },
    {
      title: language[currentLang].order.tableColumnSkuCode,
      dataIndex: 'sku',
      key: 'sku',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{text}</span>
            <span style={{ color: 'gray', marginLeft: '5px' }}>[{record.color} / {record.size}]</span>
          </div>
        );
      },
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
      valueType: 'money',
    },
    {
      title: language[currentLang].order.tableColumnDiscount,
      align: 'center',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: language[currentLang].order.tableColumnCounts,
      align: 'center',
      dataIndex: 'counts',
      key: 'counts',
    },
  ];
  return itemColumns;
};

export default useItemColumns;