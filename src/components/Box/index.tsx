import React, { memo } from 'react';
import style from './index.module.less';

type ComProps = {
  title: string;
  content: React.ReactNode;
};

const Box: React.FC<ComProps> = (props) => {
  const { title, content } = props;
  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.titleText}>{title}</div>
      </div>
      <div className={style.content}>
        {content}
      </div>
    </div>
  );

};

export default memo(Box);
