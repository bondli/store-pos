import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang') || 'en';

const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    sku: {
      title: language[currentLang].inventory.searchLabelSku,
      type: 'string',
      placeholder: language[currentLang].inventory.searchPlaceholderSku,
      props: {
        allowClear: true,
      },
    },
    sn: {
      title: language[currentLang].inventory.searchLabelStyleNo,
      type: 'string',
      placeholder: language[currentLang].inventory.searchPlaceholderStyleNo,
      props: {
        allowClear: true,
      },
    },
    name: {
      title: language[currentLang].inventory.searchLabelName,
      type: 'string',
      placeholder: language[currentLang].inventory.searchPlaceholderName,
      props: {
        allowClear: true,
      },
    },
    brand: {
      title: language[currentLang].inventory.searchLabelBrand,
      type: 'string',
      placeholder: language[currentLang].inventory.searchPlaceholderBrand,
      props: {
        allowClear: true,
      },
    },
  }
};

export default {
  schema,
  column: 3,
  layoutAuto: true,
  searchText: language[currentLang].common.search,
  resetText: language[currentLang].common.reset,
};