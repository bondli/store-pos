import React, { memo, useContext } from 'react';
import { Dropdown, Space } from 'antd';

import language from '@/common/language';
import { MainContext } from '@/common/context';

import Print from './Print';
import Refund from './Refund';
import Exchange from './Exchange';

type ComProps = {
  orderSn: string;
};

const MoreOperate: React.FC<ComProps> = (props) => {
  const { orderSn } = props;
  const { currentLang } = useContext(MainContext);

  const items = [
    {
      label: <Print orderSn={orderSn} />,
      key: 'print',
    },
    {
      label: <Refund orderSn={orderSn} />,
      key: 'refund',
    },
    {
      label: <Exchange orderSn={orderSn} />,
      key: 'exchange',
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {language[currentLang].order.moreOperate}
          </Space>
        </a>
      </Dropdown>
    </>
  );

};

export default memo(MoreOperate);
