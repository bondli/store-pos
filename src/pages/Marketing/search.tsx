import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useSearch = () => {
  const { currentLang } = useContext(MainContext);

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
            { label: language[currentLang].marketing.searchOptionFullReduce, value: 'full_reduce' },
            { label: language[currentLang].marketing.searchOptionFullSend, value: 'full_send' },
            { label: language[currentLang].marketing.searchOptionFullGift, value: 'full_gift' },
          ],
        },
        placeholder: language[currentLang].marketing.searchPlaceholderMarketingType,
      },
    }
  };

  return {
    schema,
    column: 3,
    layoutAuto: true,
    searchText: language[currentLang].common.search,
    resetText: language[currentLang].common.reset,
  };
};

export default useSearch;