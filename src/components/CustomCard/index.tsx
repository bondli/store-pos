import React, { memo } from 'react';
import style from './index.module.less';

type ComProps = {
  title: string | React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

const Box: React.FC<ComProps> = (props) => {
  const { title, content, footer, children } = props;
  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>{title}</div>
      </div>
      <div className={style.content}>
        {
          content ? content : children
        }
      </div>
      {
        footer ? <div className={style.footer}>
          {footer}
        </div> : null
      }
    </div>
  );

};

export default memo(Box);
