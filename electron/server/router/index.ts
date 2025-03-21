import express from 'express';

import {
  createUser,
  updateUser,
  userLogin,
  getUserList
} from './user-controller';

import {
  queryOrderSummary,
  queryOrderTotal,
  queryOrderList,
  queryOrderCharts,
  queryOrderItemList,
  queryOrderDetail,
  modifyOrder,
  submitOrder,
  changeOrderItem,
  refundOrderItem,
  queryOrderBySku,
  updateOrderMember,
  updateOrderSaler,
  updateOrderActual
} from './order-controller';

import {
  queryInventoryTotal,
  queryInventoryList,
  queryInventoryDetailBySku,
  queryInventoryByStyle
} from './inventory-controller';

import {
  getMemberList,
  getMemberInfo,
  createMember,
  updateMember,
  deleteMember,
  queryMemberScoreList,
  updateMemberScore
} from './member-controller';

const router = express.Router();

// 订单相关接口
router.post('/order/querySummary', queryOrderSummary); // 查询订单总览
router.get('/order/queryTotal', queryOrderTotal); // 获取订单总数
router.get('/order/queryList', queryOrderList); // 获取订单列表
router.post('/order/queryCharts', queryOrderCharts); // 获取订单报表
router.get('/order/queryItemList', queryOrderItemList); // 获取订单商品列表
router.post('/order/queryDetail', queryOrderDetail); // 获取订单详情
router.post('/order/modify', modifyOrder); // 修改订单
router.get('/order/submit', submitOrder); // 提交订单
router.get('/order/changeItem', changeOrderItem); // 换货
router.get('/order/refundItem', refundOrderItem); // 退货
router.get('/order/queryBySku', queryOrderBySku); // 根据SKU查询订单(退换货场景用到)
router.get('/order/updateMember', updateOrderMember); // 追加会员信息
router.get('/order/updateSaler', updateOrderSaler); // 修改成单导购员
router.get('/order/updateActual', updateOrderActual); // 修改订单实收金额

// 商品相关接口
router.post('/inventory/queryTotal', queryInventoryTotal); // 库存总量
router.post('/inventory/queryList', queryInventoryList); // 库存列表
router.post('/inventory/queryDetailBySku', queryInventoryDetailBySku); // 单个SKU的详情
router.post('/inventory/queryByStyle', queryInventoryByStyle); // 根据款式查询下属 SKU 的列表

// 会员相关接口
router.get('/member/list', getMemberList); // 会员列表
router.get('/member/detail', getMemberInfo); // 会员详情
router.post('/member/create', createMember); // 会员创建
router.post('/member/update', updateMember); // 会员更新
router.get('/member/delete', deleteMember); // 会员删除
router.get('/member/queryScoreList', queryMemberScoreList); // 会员积分记录
router.get('/member/updateScore', updateMemberScore); // 会员积分更新

// 导购员相关接口
router.post('/user/register', createUser); // 导购员注册
router.post('/user/login', userLogin); // 导购员登录
router.post('/user/logout', updateUser); // 导购员注销
router.post('/user/update', updateUser); // 导购员更新
router.post('/user/list', getUserList); // 导购员列表

export default router;
