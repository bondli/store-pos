export default {
  type: 'object',
  properties: {
    activityName: {
      title: 'activity name',
      placeholder: 'input activity name',
      type: 'string',
      required: true,
      widget: 'input'
    },
    activityDesc: {
      title: 'activity description',
      placeholder: 'input activity description',
      type: 'string',
      required: true,
      widget: 'input',
    },
    activityTime: {
      title: 'activity time',
      placeholder: 'select activity time',
      type: 'range',
      required: true,
      widget: 'dateRange',
    },
    activityType: {
      title: 'activity type',
      type: 'string',
      required: true,
      placeholder: 'select activity type',
      widget: 'select',
      props: {
        options: [
          { label: '满送活动', value: 'full_send' },
          { label: '满减活动', value: 'full_reduce' },
          { label: '买赠活动', value: 'full_gift' },
        ],
      },
    },
    activityContent: {
      title: 'activity content',
      type: 'object',
      widget: 'MarketingCustom',
      props: {
        activityType: '{{ formData.activityType }}'
      },
    },
  },
};