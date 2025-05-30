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
      render: (row, record) => {
        return record.actualPrice >= 0 ? <span>￥{record.actualPrice}</span> : '--';
      },
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

  return itemColumns;
};

export default useItemColumns;