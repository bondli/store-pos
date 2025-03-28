import React, { memo, useContext } from 'react';

import { BuyContext } from './context';

import style from './index.module.less';


const WaitSaleSummary: React.FC = () => {
  const { waitSales } = useContext(BuyContext);
  const { skuNum = 0, counts = 0, totalAmount = 0, payAmount = 0 } = waitSales?.brief || {};
  
  return (
    <div className={style.waitSaleSummary}>
      {skuNum} waiting for sale, {counts} items, origin amount ¥{totalAmount}, should pay ¥{payAmount}
    </div>
  );

};

export default memo(WaitSaleSummary);
