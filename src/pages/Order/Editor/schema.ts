import { useContext } from 'react';
import { getStore } from '@common/electron';
import language from '@/common/language';
import { MainContext } from '@common/context';

const useSchema = () => {
  const { currentLang, userInfo } = useContext(MainContext);

const salerList = getStore('salerList') || [];
const newSalers = [];
salerList.forEach((item) => {
  newSalers.push({ value: item.id, label: item.name });
});

  const schema = {
    type: 'object',
    properties: {
      payType: {
        title: language[currentLang].order.tableColumnPayment,
        type: 'string',
        required: true,
        placeholder: 'select pay type',
        widget: 'select',
        props: {
          options: [
            { label: '支付宝', value: 'alipay' },
            { label: '微信', value: 'weixin' },
            { label: '现金', value: 'cash' },
            { label: '银行卡', value: 'card' },
            { label: '其他', value: 'other' },
          ]
        },
      },
      orderActualAmount: {
        title: language[currentLang].order.tableColumnActual,
        type: 'number',
        required: true,
        widget: 'input',
      },
      salerId: {
        title: language[currentLang].order.tableColumnSaler,
        placeholder: language[currentLang].order.searchPlaceholderSalerName,
        type: 'number',
        required: true,
        widget: 'select',
        props: {
          options: newSalers,
        },
        disabled: userInfo?.role !== 'admin',
      },
      userPhone: {
        title: language[currentLang].order.tableColumnUser,
        placeholder: language[currentLang].order.searchPlaceholderUserPhone,
        type: 'string',
        widget: 'input',
      },
      remark: {
        title: language[currentLang].order.tableColumnRemark,
        type: 'string',
        widget: 'input',
      },
    }
  };

  return schema;
};

export default useSchema;