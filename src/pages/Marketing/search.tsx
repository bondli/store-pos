import language from '@/common/language';
import { getStore } from '@common/electron';
const currentLang = getStore('currentLang');

const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    marketingTime: {
      title: language[currentLang].marketing.searchLabelMarketingTime,
      bind: ['startDate', 'endDate'],
      type: 'range',
      format: 'date',
    },
    marketingName: {
      title: language[currentLang].marketing.searchLabelMarketingName,
      type: 'string',
      placeholder: language[currentLang].marketing.searchPlaceholderMarketingName,
      props: {
        allowClear: true,
      },
    },
    marketingType: {
      title: language[currentLang].marketing.searchLabelMarketingType,
      type: 'string',
      widget: 'select',
      props: {
        options: [
          { label: '满减活动', value: 'full_reduce' },
          { label: '满送活动', value: 'full_send' },
          { label: '满赠活动', value: 'full_gift' },
        ],
      },
      placeholder: language[currentLang].marketing.searchPlaceholderMarketingType,
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