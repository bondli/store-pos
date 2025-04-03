import React, { memo, useState, useEffect } from 'react';
import type { StatisticProps } from 'antd';
import { Card, Col, Row, Statistic, Menu, DatePicker, Empty } from 'antd';
import type { GetProps } from 'antd';
import { GithubFilled } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

import PageTitle from '@/components/PageTitle';
import MenuItem from '@components/MenuItem';
import request from '@/common/request';

import style from './index.module.less';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

const DataPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<RangePickerProps['value']>([dayjs().startOf('day').subtract(30, 'day'), dayjs().endOf('day')]);

  const [columnData, setColumnData] = useState<Array<{month: string; amounts: number}>>([]);
  const [recentSaleList, setRecentSaleList] = useState<Array<{label: React.ReactNode; key: number; icon: React.ReactNode}>>([]);

  const [statistics, setStatistics] = useState({
    orderAmount: 0,
    orderCount: 0,
    inventoryCount: 0,
    memberCount: 0
  });

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current >= dayjs().endOf('day');
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await request.post('/data/getCoreData', {
        dateRange,
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
      const response = await request.get('/data/getOrderCharts');
      if (response.data) {
        setColumnData(response.data);
      }
    } catch (error) {
      console.error('获取图表数据失败:', error);
    }
  };

  const fetchRecentSaleList = async () => {
    try {
      const response = await request.get('/data/getRecentSaleList');
      if (response.data) {
        const list = response.data.map((item: any) => ({
          label: <MenuItem label={item.userPhone || '--'} count={item.orderActualAmount} formatMoney={true} />,
          key: item.id,
          icon: <GithubFilled style={{ fontSize: '16px' }} />,
        }));
        setRecentSaleList(list);
      }
    } catch (error) {
      console.error('获取最近销售数据失败:', error);
    }
  };
  
  useEffect(() => {
    fetchChartData();
    fetchRecentSaleList();
  }, []);

  return (
    <div className={style.container}>
      <PageTitle text={`Dashboard`} extra={<RangePicker disabledDate={disabledDate} value={dateRange} onChange={setDateRange} />} />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Order Amounts(CNY)`}
              value={statistics.orderAmount}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Order Counts`}
              value={statistics.orderCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Inventory Counts`}
              value={statistics.inventoryCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Member Counts`}
              value={statistics.memberCount}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title={`Overview`} className={style.card}>
            {columnData.length > 0 ? (
              <Column xField={'month'} yField={'amounts'} data={columnData} />
            ) : (
              <Empty description='暂无数据' />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title={`Recent Sales`} className={style.card}>
            {recentSaleList.length > 0 ? (
              <Menu
                defaultSelectedKeys={[]}
                mode={`inline`}
                items={recentSaleList}
                style={{ borderRight: 0 }}
              >
              </Menu>
            ) : (
              <Empty description='暂无数据' />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

};

export default memo(DataPage);
