import React, { memo, useState } from 'react';
import { Button, Drawer, Col, Row, Statistic, Card } from 'antd';

import style from './index.module.less';


const Summary: React.FC = (props) => {
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
        summary
      </Button>
      <Drawer
        title={`Query Result of Order's Summary`}
        height={410}
        placement={`top`}
        open={showPanel}
        onClose={() => setShowPanel(false)}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={`Order amounts(CNY)`}
                value={1128}
                precision={2}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={`Order counts`}
                value={9}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={`inventory counts`}
                value={89000}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card title={`order amount by pay channel`} className={style.card}>
              <div className={style.cardByPayChannel}>
                <Statistic title={`alipay(CNY)`} precision={2} value={6000} />
                <Statistic title={`weixin(CNY)`} precision={2} value={7500} />
                <Statistic title={`cash(CNY)`} precision={2} value={800} />
                <Statistic title={`card(CNY)`} precision={2} value={2121} />
              </div>
            </Card>
          </Col>
        </Row>
      </Drawer>
    </>
  );

};

export default memo(Summary);
