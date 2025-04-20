import React, { memo, useContext } from 'react';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { BuyContext } from './context';

import style from './index.module.less';


const WaitSaleSummary: React.FC = () => {
  const { currentLang } = useContext(MainContext);
  const { waitSales } = useContext(BuyContext);
  const { skuNum = 0, counts = 0, totalAmount = 0, payAmount = 0 } = waitSales?.brief || {};
  
  return (
    <div className={style.waitSaleSummary}>
      {skuNum} {language[currentLang].buy.waitingForSale}, {counts} {language[currentLang].buy.items} , {language[currentLang].buy.originAmount} ¥{totalAmount}, {language[currentLang].buy.shouldPay} ¥{payAmount}
    </div>
  );

};

export default memo(WaitSaleSummary);
