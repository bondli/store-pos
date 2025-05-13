import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useSchema = () => {
  const { currentLang } = useContext(MainContext);

  const schema = {
    type: 'object',
    properties: {
      sn: {
        title: language[currentLang].inventory.tableColumnStyleNo,
        placeholder: language[currentLang].inventory.searchPlaceholderStyleNo,
        type: 'string',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      name: {
        title: language[currentLang].inventory.tableColumnName,
        placeholder: language[currentLang].inventory.searchPlaceholderName,
        type: 'string',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      brand: {
        title: language[currentLang].inventory.tableColumnBrand,
        placeholder: language[currentLang].inventory.searchPlaceholderBrand,
        type: 'string',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      sku: {
        title: language[currentLang].inventory.tableColumnSku,
        placeholder: language[currentLang].inventory.searchPlaceholderSku,
        type: 'string',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      color: {
        title: language[currentLang].inventory.tableColumnColor,
        placeholder: language[currentLang].inventory.searchPlaceholderColor,
        type: 'string',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      size: {
        title: language[currentLang].inventory.tableColumnSize,
        placeholder: language[currentLang].inventory.searchPlaceholderSize,
        type: 'string',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      originalPrice: {
        title: language[currentLang].inventory.tableColumnOriginalPrice,
        placeholder: language[currentLang].inventory.searchPlaceholderOriginalPrice,
        type: 'number',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      costPrice: {
        title: language[currentLang].inventory.tableColumnCostPrice,
        placeholder: language[currentLang].inventory.searchPlaceholderCostPrice,
        type: 'number',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
      counts: {
        title: language[currentLang].inventory.tableColumnCounts,
        placeholder: language[currentLang].inventory.searchPlaceholderCounts,
        type: 'number',
        required: true,
        widget: 'input',
        props: {
          allowClear: true,
        },
      },
    },
  };

  return schema;
};

export default useSchema;