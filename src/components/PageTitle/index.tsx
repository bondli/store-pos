import React, { memo } from 'react';
import style from './index.module.less';

type PageTitleProps = {
  text: string;
  extra?: React.ReactNode;
};

const PageTitle: React.FC<PageTitleProps> = (props) => {
  const { text, extra } = props;
  return (
    <div className={style.pageHeader}>
      <div className={style.pageTitle}>{text}</div>
      <div className={style.extra}>
        {extra}
      </div>
    </div>
  );

};

export default memo(PageTitle);
