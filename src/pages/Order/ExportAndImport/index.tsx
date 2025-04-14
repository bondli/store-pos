import React, { memo } from 'react';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import ExportOrder from './ExportOrder';
import ImportOrder from './ImportOrder';

type ComProps = {
  dataList: any[];
  callback: () => void;
};

const ExportAndImport: React.FC<ComProps> = (props) => {
  const { dataList, callback } = props;

  const items = [
    {
      label: <ExportOrder dataList={dataList} />,
      key: 'export',
    },
    {
      label: <ImportOrder callback={callback} />,
      key: 'import',
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button onClick={(e) => e.preventDefault()}>
          <Space>
            more
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  );

};

export default memo(ExportAndImport);
