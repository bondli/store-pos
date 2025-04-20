import React, { memo, useContext } from 'react';
import { Dropdown, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import language from '@/common/language';
import { MainContext } from '@/common/context';

import Returns from './Returns';
import Purchase from './Purchase';

type ComProps = {
  callback: () => void;
};

const MoreOperate: React.FC<ComProps> = (props) => {
  const { callback } = props;
  const { currentLang } = useContext(MainContext);

  const items = [
    {
      label: <Purchase callback={callback} />,
      key: 'purchase',
    },
    {
      label: <Returns callback={callback} />,
      key: 'returns',
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <UploadOutlined />
            {language[currentLang].inventory.bitchStock}
          </Space>
        </a>
      </Dropdown>
    </>
  );

};

export default memo(MoreOperate);
