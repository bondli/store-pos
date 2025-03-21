/**
 * 小程序apimap配置文件
 */

const apimap = {

  order: {
    // 查询订单总览
    queryOrderSummary: `/order/queryOrderSummary`,

    // 获取订单总数
    queryOrderTotal: `/order/queryOrderTotal`,

    // 获取订单列表
    queryOrderList: `/order/queryOrderList`,

    // 获取订单报表
    queryOrderCharts: `/order/queryOrderCharts`,

    // 获取订单商品列表
    queryAllOrderItemList: `/order/queryAllOrderItemList`,

    // 获取订单详情
    queryOrderDetail: `/order/queryOrderDetail`,

    // 修改订单
    modifyOrder: `/order/modifyOrder`,

    // 下单
    sendOrder: `/order/sendOrder`,

    // 换货
    changeOrderItem: `/order/changeOrderItem`,

    // 退货
    refundOrderItem: `/order/refundOrderItem`,

    // 退换货查询订单商品信息
    queryOrderItemList: `/order/queryOrderItemList`,

    // 退换货根据SKU查询订单
    queryOrderBySku: `/order/queryOrderBySku`,

    // 追加会员信息
    updateOrderMember: `/order/updateOrderMember`,

    // 修改成单导购员
    updateOrderSaler: `/order/updateOrderSaler`,

    // 修改订单实收金额
    updateOrderActual: `/order/updateOrderActual`,

  },

  saler: {
    // 导购员登陆
    login: `/saler/login`,

    // 导购员注销
    logout: `/saler/logout`,

    // 导购员修改密码
    chanpwd: `/saler/chanpwd`,

    // 导购员列表
    getList: `/saler/getList`,
  },

  member: {
    // 会员列表
    queryList: `/member/queryList`,

    // 会员积分记录
    queryScoreList: `/member/queryScoreList`,

    // 通过手机号查询会员
    queryByPhone: `/member/queryByPhone`,

    // 加会员
    addByPhone: `/member/addByPhone`,

    // 校正会员积分
    updateMemberScore: `/member/updateMemberScore`,
  },

  stock: {
    // 查询库存总览
    queryStockTotal: `/stock/queryStockTotal`,

    // 查询库存列表
    queryStockList: `/stock/queryStockList`,

    // 查询单款
    queryBySku: `/stock/query`,

    getDetailBySku: `/stock/getDetailBySku`,

    setInventory: `/manage/setInventory`,
  },

  draft: {
    // 查询所有
    queryAll: `/draft/queryAll`,

    // 清空所有
    clearAll: `/draft/clearAll`,

    // 新增单款
    addBySku: `/draft/addBySku`,

    // 删除单款
    deleteBySku: `/draft/deleteBySku`,

    // 更新数量
    updateNum: `/draft/updateNum`,
  },

};

export default apimap;