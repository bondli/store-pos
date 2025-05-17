import React, { memo, useState, useEffect, useContext } from 'react';
import type { StatisticProps } from 'antd';
import { Card, Col, Row, Statistic, DatePicker, Empty, Spin } from 'antd';
import type { GetProps } from 'antd';
import { Column, DualAxes } from '@ant-design/plots';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

import PageTitle from '@/components/PageTitle';
import request from '@/common/request';
import language from '@/common/language';
import { MainContext } from '@/common/context';

import style from './index.module.less';
import { getStore } from '@/common/electron';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

const DataPage: React.FC = () => {
  const { currentLang, userInfo } = useContext(MainContext);
  
  const [dateRange, setDateRange] = useState<RangePickerProps['value']>([
    dayjs().startOf('day').subtract(30, 'day'),
    dayjs().endOf('day')
  ]);

  const [columnData, setColumnData] = useState<Array<{month: string; amounts: number; cost: number, rate: number}>> ([]);
  const [salerColumnData, setSalerColumnData] = useState<Array<{month: string; amounts: number;}>> ([]);

  // 数据请求是否发送完成
  const [isFetchDone, setIsFetchDone] = useState(false);
  const [isSalerFetchDone, setIsSalerFetchDone] = useState(false);

  const [statistics, setStatistics] = useState({
    orderAmount: 0,
    orderCount: 0,
    inventoryCount: 0,
    saledItemCount: 0,
    memberCount: 0,
    memberBalance: 0,
    salerOrderAmount: 0,
  });

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const showStatus = getStore('orderShowStatus');

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await request.post('/data/getCoreData', {
        dateRange,
        showStatus,
      });
      if (response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]); // 当日期范围改变时重新获取数据

  const fetchChartData = async () => {
    try {
      const response = await request.get('/data/getOrderCharts', {
        params: {
          showStatus,
        },
        timeout: 30000,
      });
      if (response.data) {
        setColumnData(response.data);
      }
    } catch (error) {
      console.error('获取图表数据失败:', error);
    } finally {
      setIsFetchDone(true);
    }
  };

  const fetchSalerChartData = async () => {
    try {
      const response = await request.get('/data/getSalerCharts', {
        params: {
          showStatus,
        },
      });
      if (response.data) {
        setSalerColumnData(response.data);
      }
    } catch (error) {
      console.error('获取导购员图表数据失败:', error);
    } finally {
      setIsSalerFetchDone(true);
    }
  };
  
  useEffect(() => {
    fetchChartData();
    fetchSalerChartData();
  }, []);

  // 渲染店铺营业额图表
  const getChartContent = () => {
    if (userInfo.role === 'admin') {
      // 将columnData转换为amountsData和rateData
      const amountsData = [];
      const rateData = [];
      columnData.forEach(item => {
        amountsData.push({
          month: item.month,
          value: item.amounts,
          type: '销售额',
        });
        amountsData.push({
          month: item.month,
          value: item.cost,
          type: '成本',
        });
        rateData.push({
          month: item.month,
          value: item.rate,
          type: '利润率',
        });
      });

      return (
        <DualAxes
          height={370}
          xField='month'
          legend={true}
          children={[
            {
              data: amountsData,
              type: 'interval',
              yField: 'value',
              colorField: 'type',
              group: true,
              style: {
                radiusTopLeft: 10,
                radiusTopRight: 10,
                maxWidth: 80,
              },
              interaction: { elementHighlight: { background: true } },
            },
            {
              data: rateData,
              type: 'line',
              yField: 'value',
              colorField: 'type',
              style: { lineWidth: 2 },
              axis: { y: { position: 'right' } },
              interaction: {
                tooltip: {
                  crosshairs: false,
                  marker: false,
                },
              },
            },
          ]}
        />
      );
    } else {
      return (
        <Column
          height={370}
          xField={'month'}
          yField={'amounts'}
          data={columnData}
          style={{
            radiusTopLeft: 10,
            radiusTopRight: 10,
            maxWidth: 80,
          }}
        />
      );
    }
  };

  // 渲染导购员业绩图表
  const getSalerChartContent = () => {
    return (
      <Column
        height={370}
        xField={'month'}
        yField={'amounts'}
        data={salerColumnData}
        style={{
          radiusTopLeft: 10,
          radiusTopRight: 10,
          maxWidth: 80,
        }}
      />
    );
  };

  return (
    <div className={style.container}>
      <PageTitle
        text={`${language[currentLang].data.title}`}
        extra={
          <RangePicker
            disabledDate={disabledDate}
            value={dateRange}
            onChange={setDateRange}
          />
        }
      />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className={style.card}>
            <Statistic
              title={`${language[currentLang].data.orderAmount}`}
              value={statistics.orderAmount}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className={style.card}>
            <Statistic
              title={`${language[currentLang].data.orderCount}`}
              value={statistics.orderCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className={style.card}>
            <Statistic
              title={`${language[currentLang].data.soldItemCount}`}
              value={statistics.saledItemCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className={style.card}>
            <Statistic
              title={`${language[currentLang].data.itemCount}`}
              value={statistics.inventoryCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className={style.card}>
            <Statistic
              title={`${language[currentLang].data.memberCount}`}
              value={statistics.memberCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className={style.card}>
            <Statistic
              title={`${language[currentLang].data.memberBalance}`}
              value={statistics.memberBalance}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card title={`${language[currentLang].data.overview}`} className={style.card}>
            {columnData.length > 0 ? (
              getChartContent()
            ) : (
              isFetchDone ? <Empty description='暂无数据' /> : <div className={style.loading}><Spin /></div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title={`${language[currentLang].data.salerOrderAmount}`} className={style.card}>
            {salerColumnData.length > 0 ? (
              getSalerChartContent()
            ) : (
              isSalerFetchDone ? <Empty description='暂无数据' /> : <div className={style.loading}><Spin /></div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

};

export default memo(DataPage);
