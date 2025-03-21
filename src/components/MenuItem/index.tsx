import React, { memo } from 'react';
import style from './index.module.less';

type MenuItemProps = {
  label: string;
  count: number;
  formatMoney?: boolean;
};

const formatAmount = (amount: number): string => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { label, count } = props;
  return (
    <div className={style.container}>
      <span>{label}</span>
      <span className={style.count}>
        {props.formatMoney ? `¥${formatAmount(count)}` : count}</span>
    </div>
  );

};

export default memo(MenuItem);
