import React, { memo, useEffect, useState, useContext } from 'react';
import { Drawer, Col, Row, Statistic, Card, App } from 'antd';
import { EyeFilled } from '@ant-design/icons';

import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import { QueryParamsProps, OrderStatistics } from '@common/constant';

import style from './index.module.less';

const Summary: React.FC<QueryParamsProps> = (props) => {
  const { message } = App.useApp();

  const { currentLang } = useContext(MainContext);
  const { queryParams } = props;
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

  // 获取订单统计信息
  const getOrderSummary = async (queryParams) => {
    const response = await request.get('/order/queryOrderSummary', {
      params: queryParams,
    });
    const result = response.data;
    if (result.error) {
      message.error(result.error);
      return;
    }
    setStatistics({
      orderActualAmount: result.orderActualAmount,
      orderCount: result.orderCount,
      itemCount: result.itemCount,
      payChannelStats: result.payChannelStats,
    });
  };

  useEffect(() => {
    if (showPanel) {
      // 获取订单统计信息
      getOrderSummary(queryParams);
    }
  }, [queryParams, showPanel]);

  return (
    <>
      <span
        className={style.summary}
        onClick={togglePanel}
      >
        <EyeFilled />
      </span>
      <Drawer
        title={language[currentLang].order.summaryTitle}
        height={410}
        placement={`top`}
        open={showPanel}
        destroyOnHidden={true}
        onClose={() => setShowPanel(false)}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={language[currentLang].order.summaryOrderAmount}
                value={statistics.orderActualAmount}
                precision={2}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={language[currentLang].order.summaryOrderCount}
                value={statistics.orderCount}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={style.card}>
              <Statistic
                title={language[currentLang].order.summaryItemCount}
                value={statistics.itemCount}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card title={language[currentLang].order.summaryOrderAmountByPayChannel} className={style.card}>
              <div className={style.cardByPayChannel}>
                <Statistic title={`${language[currentLang].order.summaryAlipay}(CNY)`} precision={2} value={statistics.payChannelStats.alipay} />
                <Statistic title={`${language[currentLang].order.summaryWeixin}(CNY)`} precision={2} value={statistics.payChannelStats.weixin} />
                <Statistic title={`${language[currentLang].order.summaryCash}(CNY)`} precision={2} value={statistics.payChannelStats.cash} />
                <Statistic title={`${language[currentLang].order.summaryCard}(CNY)`} precision={2} value={statistics.payChannelStats.card} />
                <Statistic title={`${language[currentLang].order.summaryOther}(CNY)`} precision={2} value={statistics.payChannelStats.other} />
              </div>
            </Card>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default memo(Summary);
