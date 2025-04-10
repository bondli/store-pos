export default {
  type: 'object',
  properties: {
    marketingName: {
      title: 'marketing name',
      placeholder: 'input marketing name',
      type: 'string',
      required: true,
      widget: 'input'
    },
    marketingDesc: {
      title: 'marketing description',
      placeholder: 'input marketing description',
      type: 'string',
      required: true,
      widget: 'input',
    },
    marketingTime: {
      bind: ['startTime', 'endTime'],
      title: 'marketing time',
      placeholder: 'select marketing time',
      type: 'range',
      required: true,
      widget: 'dateRange',
    },
    marketingType: {
      title: 'marketing type',
      type: 'string',
      required: true,
      placeholder: 'select marketing type',
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
      title: 'marketing content',
      type: 'object',
      widget: 'MarketingCustom',
      props: {
        marketingType: '{{ formData.marketingType }}'
      },
    },
  },
};