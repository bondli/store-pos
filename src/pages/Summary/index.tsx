import React, { memo } from 'react';
import type { StatisticProps } from 'antd';
import { Card, Col, Row, Statistic, Menu } from 'antd';
import { GithubFilled } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import CountUp from 'react-countup';

import PageTitle from '@/components/PageTitle';
import MenuItem from '@components/MenuItem';

import style from './index.module.less';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

const columnData = [
  {
    "month": "2024/04",
    "amounts": 38167
  },
  {
    "month": "2024/05",
    "amounts": 28145
  },
  {
    "month": "2024/06",
    "amounts": 4167
  },
  {
    "month": "2024/07",
    "amounts": 9167
  },
  {
    "month": "2024/08",
    "amounts": 8467
  },
  {
    "month": "2024/09",
    "amounts": 18167
  },
  {
    "month": "2024/10",
    "amounts": 28167
  },
  {
    "month": "2024/11",
    "amounts": 38167
  },
  {
    "month": "2024/12",
    "amounts": 48167
  }
];

const recentSaleList = [
  {
    label: <MenuItem label={'asdasdasd'} count={1111} formatMoney={true} />,
    key: 1,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 2,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 3,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 4,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 5,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 6,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 7,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 8,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 9,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
  {
    label: <MenuItem label={'asdasdasd'} count={1111} />,
    key: 10,
    icon: <GithubFilled style={{ fontSize: '16px' }} />,
  },
];

const SummaryPage: React.FC = () => {
  return (
    <div className={style.container}>
      <PageTitle text={`Dashboard`} />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Order Amounts(CNY)`}
              value={1128}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Order Counts`}
              value={9}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Inventory Counts`}
              value={89000}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={style.card}>
            <Statistic
              title={`Member Counts`}
              value={900}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title={`Overview`} className={style.card}>
            <Column xField={'month'} yField={'amounts'} data={columnData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={`Recent Sales`} className={style.card}>
            <Menu
              defaultSelectedKeys={[]}
              mode={`inline`}
              items={recentSaleList}
              style={{ borderRight: 0 }}
            >
            </Menu>
          </Card>
        </Col>
      </Row>
    </div>
  );

};

export default memo(SummaryPage);
