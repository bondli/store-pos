import React, { memo, useContext } from 'react';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import language from '@/common/language';
import { MainContext } from '@/common/context';

import ExportOrder from './ExportOrder';
import ImportOrder from './ImportOrder';

type ComProps = {
  dataList: any[];
  callback: () => void;
};

const ExportAndImport: React.FC<ComProps> = (props) => {
  const { dataList, callback } = props;
  const { currentLang } = useContext(MainContext);

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
            {language[currentLang].order.exportAndImport}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  );

};

export default memo(ExportAndImport);
