import React, { memo, useState } from 'react';
import { Button, Drawer } from 'antd';

type ComProps = {
  callback: () => void;
};

const Recharge: React.FC<ComProps> = (props) => {
  const { callback } = props;
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <>
      <Button
        type='default'
        onClick={togglePanel}
      >
        recharge
      </Button>
      <Drawer
        title={`Member Recharge`}
        width={410}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
      </Drawer>
    </>
  );

};

export default memo(Recharge);
