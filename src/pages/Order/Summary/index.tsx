import React, { memo, useEffect, useState } from 'react';
import { Drawer, Col, Row, Statistic, Card } from 'antd';
import { EyeFilled } from '@ant-design/icons';

import { OrderListProps, OrderStatistics, PaymentChannelStats } from '@common/constant';
import style from './index.module.less';

const Summary: React.FC<OrderListProps> = (props) => {
  const { dataList } = props;
  const [showPanel, setShowPanel] = useState(false);
  const [statistics, setStatistics] = useState<OrderStatistics>({
    orderActualAmount: 0,
    orderCount: 0,
    itemCount: 0,
    payChannelStats: {
      alipay: 0,
      weixin: 0,
      cash: 0,
      card: 0,
      other: 0
    }
  });

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  useEffect(() => {
    const orderActualAmount = dataList.reduce((acc, curr) => acc + curr.orderActualAmount, 0);
    const orderCount = dataList.length;
    const itemCount = dataList.reduce((acc, curr) => acc + curr.orderItems, 0);
    const payChannelStats = dataList.reduce((acc, curr) => {
      acc[curr.payType] = (acc[curr.payType] || 0) + curr.orderActualAmount;
      return acc;
    }, {} as PaymentChannelStats);

    setStatistics({
      orderActualAmount,
      orderCount,
      itemCount,
      payChannelStats
    });
  }, [dataList, showPanel]);

  return (
    <>
      <span
        className={style.summary}
        onClick={togglePanel}
      >
        <EyeFilled />
      </span>
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
                value={statistics.orderActualAmount}
                precision={2}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={`Order counts`}
                value={statistics.orderCount}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={`Item counts`}
                value={statistics.itemCount}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card title={`order amount by pay channel`} className={style.card}>
              <div className={style.cardByPayChannel}>
                <Statistic title={`alipay(CNY)`} precision={2} value={statistics.payChannelStats.alipay} />
                <Statistic title={`weixin(CNY)`} precision={2} value={statistics.payChannelStats.weixin} />
                <Statistic title={`cash(CNY)`} precision={2} value={statistics.payChannelStats.cash} />
                <Statistic title={`card(CNY)`} precision={2} value={statistics.payChannelStats.card} />
                <Statistic title={`other(CNY)`} precision={2} value={statistics.payChannelStats.other} />
              </div>
            </Card>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default memo(Summary);
