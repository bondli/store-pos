import express from 'express';

import {
  createUser,
  updateUser,
  userLogin,
  getUserList,
} from './user-controller';

import {
  queryOrderList,
  queryOrderItemList,
  queryOrderDetail,
  changeOrderItem,
  refundOrderItem,
  queryOrderBySku,
  checkOrderBill,
  modifyOrder,
  queryOrderCouponList,
  exportOrder,
  queryOrderItemListByDate,
} from './order-controller';

import {
  queryInventoryTotal,
  queryInventoryList,
  queryDetailBySku,
  queryInventoryByStyle,
  updateInventory,
  createInventory,
  batchProcessPurchaseData,
  batchProcessReturnsData,
  batchCreateInventory,
  batchReturnsInventory,
  downloadTemplate,
  queryNoStockList,
} from './inventory-controller';

import {
  getMemberList,
  getMemberInfo,
  createMember,
  updateMember,
  deleteMember,
  queryMemberScoreList,
  queryMemberBalanceList,
  queryMemberCouponList,
  updateMemberScore,
  memberIncomeBalance,
  queryMemberBigdayCouponList,
} from './member-controller';

import {
  getCoreData,
  getOrderCharts,
  getRecentSaleList,
} from './data-controller';

import {
  submitOrder,
  getStoreCoupon,
  importOrder,
} from './buy-controller';

import {
  createMarketing,
  getMarketingList,
  updateMarketing,
  deleteMarketing,
  getMarketingDetail,
  getMarketingCouponList,
  offlineMarketing,
} from './marketing-controller';

import { uploadFile } from './common-controller';

const router = express.Router();

// 买单相关接口
router.post('/buy/submit', submitOrder); // 提交订单
router.post('/buy/importOrder', importOrder); // 导入订单
router.get('/buy/getStoreCoupon', getStoreCoupon); // 获取店铺优惠券

// 订单相关接口
router.get('/order/queryList', queryOrderList); // 获取订单列表
router.get('/order/queryItemList', queryOrderItemList); // 获取订单商品列表
router.get('/order/queryDetail', queryOrderDetail); // 获取订单详情
router.post('/order/changeItem', changeOrderItem); // 换货
router.post('/order/refundItem', refundOrderItem); // 退货
router.get('/order/queryBySku', queryOrderBySku); // 根据SKU查询订单(退换货场景用到)
router.post('/order/checkBill', checkOrderBill); // 确认订单
router.post('/order/modify', modifyOrder); // 修改订单
router.get('/order/queryCouponList', queryOrderCouponList); // 查询订单中的优惠券列表
router.post('/order/export', exportOrder); // 导出订单
router.get('/order/queryOrderItemListByDate', queryOrderItemListByDate); // 根据日期查询订单商品列表

// 商品相关接口
router.get('/inventory/queryTotal', queryInventoryTotal); // 库存总量
router.get('/inventory/queryList', queryInventoryList); // 库存列表
router.get('/inventory/queryDetailBySku', queryDetailBySku); // 单个SKU的详情
router.get('/inventory/queryByStyle', queryInventoryByStyle); // 根据款式查询下属 SKU 的列表
router.post('/inventory/update', updateInventory); // 单个更新
router.post('/inventory/create', createInventory); // 单个入库
router.post('/inventory/batchProcessPurchaseData', batchProcessPurchaseData); // 批量处理预处理数据(入库)
router.post('/inventory/batchProcessReturnsData', batchProcessReturnsData); // 批量处理预处理数据(退库)
router.post('/inventory/batchCreate', batchCreateInventory); // 批量入库
router.post('/inventory/batchReturns', batchReturnsInventory); // 批量退库
router.post('/inventory/template', downloadTemplate); // 下载模板
router.get('/inventory/getNoStockList', queryNoStockList); // 查询断码商品列表

// 会员相关接口
router.get('/member/list', getMemberList); // 会员列表
router.get('/member/detail', getMemberInfo); // 会员详情
router.post('/member/create', createMember); // 会员创建
router.post('/member/update', updateMember); // 会员更新
router.get('/member/delete', deleteMember); // 会员删除
router.get('/member/queryScoreList', queryMemberScoreList); // 会员积分记录
router.get('/member/queryBalanceList', queryMemberBalanceList); // 会员余额记录
router.get('/member/queryCouponList', queryMemberCouponList); // 会员优惠券记录
router.post('/member/updateScore', updateMemberScore); // 会员积分更新
router.post('/member/incomeBalance', memberIncomeBalance); // 会员充值
router.get('/member/queryBigdayCouponList', queryMemberBigdayCouponList); // 会员权益列表

// 导购员相关接口
router.post('/user/register', createUser); // 导购员注册
router.post('/user/login', userLogin); // 导购员登录
router.post('/user/update', updateUser); // 导购员更新
router.get('/user/list', getUserList); // 导购员列表

// 数据相关接口
router.post('/data/getCoreData', getCoreData); // 获取系统核心的统计数据
router.get('/data/getOrderCharts', getOrderCharts); // 获取订单图表数据
router.get('/data/getRecentSaleList', getRecentSaleList); // 获取最近销售数据

// 营销相关接口
router.post('/marketing/create', createMarketing); // 创建营销活动
router.get('/marketing/list', getMarketingList); // 获取营销活动列表
router.post('/marketing/update', updateMarketing); // 更新营销活动
router.post('/marketing/delete', deleteMarketing); // 删除营销活动
router.get('/marketing/queryDetail', getMarketingDetail); // 获取营销活动详情
router.get('/marketing/queryCouponList', getMarketingCouponList); // 获取营销活动下属优惠券列表
router.post('/marketing/offline', offlineMarketing); // 下线营销活动

// 上传文件
router.post('/common/uploadFile', uploadFile); // 上传文件

export default router;
