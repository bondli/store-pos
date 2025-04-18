import React, { memo } from 'react';
import { Dropdown, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import Returns from './Returns';
import Purchase from './Purchase';

type ComProps = {
  callback: () => void;
};

const MoreOperate: React.FC<ComProps> = (props) => {
  const { callback } = props;

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
            bitch stock
          </Space>
        </a>
      </Dropdown>
    </>
  );

};

export default memo(MoreOperate);
