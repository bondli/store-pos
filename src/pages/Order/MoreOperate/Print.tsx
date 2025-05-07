import React, { memo, useEffect, useState, useRef, useContext } from 'react';
import { Button, Drawer, Flex, App } from 'antd';

import { userLog } from '@/common/electron';
import request from '@common/request';
import Bill from '@/components/Bill';
import { printStr } from '@/common/electron';
import language from '@/common/language';
import { MainContext } from '@/common/context';

type ComProps = {
  orderSn: string;
};

const defaultOrderInfo = {
  orderSn: '',
  createdAt: '',
  orderAmount: 0,
  orderActualAmount: 0,
  orderItems: 0,
  payType: '',
  userPhone: '',
  salerName: '',
  remark: '',
  usePoint: 0,
  useBalance: 0,
  useCoupon: 0,
};

const Print: React.FC<ComProps> = (props) => {
  const { message } = App.useApp();
  const { currentLang } = useContext(MainContext);
  const { orderSn } = props;

  const [showPanel, setShowPanel] = useState(false);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  const [orderItems, setOrderItems] = useState([]);
  const [memberInfo, setMemberInfo] = useState({});

  const printRef = useRef<HTMLDivElement>(null);
  
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  // 获取订单信息
  const getOrderDetail = async () => {
    userLog('request order detail params:', orderSn);
    try {
      const response = await request.get('/order/queryDetail', {
        params: {
          orderSn,
        },
      });
      const result = response.data;
      if (!result.error) {
        setOrderInfo(result);
        if (result.userPhone) {
          getMemberInfo(result.userPhone);
        }
      }

    } catch (error) {
      message.error('查询订单失败');
    }
  };

  // 获取订单中商品列表
  const getOrderItems = async () => {
    try {
      const response = await request.get('/order/queryItemList', {
        params: {
          orderSn,
        },
      });
      const result = response.data;
      setOrderItems(result.data);
    } catch (error) {
      message.error('查询订单商品失败');
    }
  };

  // 获取会员信息
  const getMemberInfo = async (phone: string) => {
    const response = await request.get('/member/detail', {
      params: {
        phone,
      },
    });
    const result = response.data;
    if (!result.error) {
      setMemberInfo(result);
    }
  };

  // 打印小票
  const handlePrint = async () => {
    if (printRef.current) {
      printStr(printRef.current.innerHTML);
      // 调用接口，让订单的打印状态更新为已打印
      await request.post('/order/updatePrintStatus', {
        orderSn,
        printStatus: 'printed',
      });
    } else {
      message.error('小票内容为空');
    }
  };

  useEffect(() => {
    if (showPanel) {
      getOrderDetail();
      getOrderItems();
    }
  }, [showPanel]);

  return (
    <>
      <Button
        type='link'
        onClick={togglePanel}
      >
        {language[currentLang].order.printBillAction}
      </Button>
      <Drawer
        title={language[currentLang].order.billInfo}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
        footer={
          <Flex justify='right'>
            <Button type='primary' key='print' onClick={handlePrint}>
              {language[currentLang].order.printBillAction}
            </Button>
          </Flex>
        }
      >
        <div ref={printRef}>
          <Bill orderInfo={orderInfo} orderItems={orderItems} memberInfo={memberInfo} />
        </div>
      </Drawer>
    </>
  );

};

export default memo(Print);
