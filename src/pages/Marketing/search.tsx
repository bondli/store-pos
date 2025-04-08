const schema = {
  type: 'object',
  labelWidth: 100,
  properties: {
    activityTime: {
      title: 'time',
      bind: ['startDate', 'endDate'],
      type: 'range',
      format: 'date',
    },
    activityName: {
      title: 'name',
      type: 'string',
      placeholder: 'input activity name',
      props: {
        allowClear: true,
      },
    },
    activityType: {
      title: 'type',
      type: 'string',
      widget: 'select',
      props: {
        options: [
          { label: '满送活动', value: 'full_send' },
          { label: '满减活动', value: 'full_reduce' },
          { label: '满赠活动', value: 'full_gift' },
        ],
      },
      placeholder: 'select activity type',
    },
  }
};

export default {
  schema,
  column: 3,
  layoutAuto: true,
  searchText: 'search',
  resetText: 'reset',
};