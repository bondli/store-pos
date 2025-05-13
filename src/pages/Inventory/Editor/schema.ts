import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useSchema = () => {
  const { currentLang } = useContext(MainContext);

  const schema = {
    type: 'object',
    properties: {
      sku: {
        title: language[currentLang].inventory.tableColumnSku,
        type: 'string',
        required: true,
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      name: {
        title: language[currentLang].inventory.tableColumnName,
        type: 'string',
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      brand: {
        title: language[currentLang].inventory.tableColumnBrand,
        type: 'string',
        required: true,
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      color: {
        title: language[currentLang].inventory.tableColumnColor,
        type: 'string',
        required: true,
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      size: {
        title: language[currentLang].inventory.tableColumnSize,
        type: 'string',
        required: true,
        widget: 'input',
        readonly: true,
        disabled: true,
      },
      counts: {
        title: language[currentLang].inventory.tableColumnCounts,
        type: 'number',
        required: true,
        widget: 'input',
      },
    }
  };

  return schema;
};

export default useSchema;