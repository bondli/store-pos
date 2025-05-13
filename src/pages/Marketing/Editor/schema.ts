import { useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useSchema = () => {
  const { currentLang } = useContext(MainContext);

  const schema = {
    type: 'object',
    properties: {
      marketingName: {
        title: language[currentLang].marketing.tableColumnName,
        placeholder: language[currentLang].marketing.searchPlaceholderMarketingName,
        type: 'string',
        required: true,
        widget: 'input'
      },
      marketingDesc: {
        title: language[currentLang].marketing.tableColumnDesc,
        placeholder: language[currentLang].marketing.searchPlaceholderMarketingDesc,
        type: 'string',
        required: true,
        widget: 'input',
      },
      marketingTime: {
        bind: ['startTime', 'endTime'],
        title: language[currentLang].marketing.searchLabelMarketingTime,
        type: 'range',
        required: true,
        widget: 'dateRange',
      },
      marketingType: {
        title: language[currentLang].marketing.tableColumnType,
        type: 'string',
        required: true,
        disabled: true,
        placeholder: language[currentLang].marketing.searchPlaceholderMarketingType,
        widget: 'select',
        props: {
          options: [
            { label: '满减活动', value: 'full_reduce' },
            { label: '满送活动', value: 'full_send' },
            { label: '买赠活动', value: 'full_gift' },
          ],
        },
      },
      marketingContent: {
        title: language[currentLang].marketing.tableColumnContent,
        type: 'object',
        widget: 'MarketingCustom',
        props: {
          marketingType: '{{ formData.marketingType }}'
        },
      },
    },
  };

  return schema;
};

export default useSchema;