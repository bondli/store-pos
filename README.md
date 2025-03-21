# store-pos
线下店铺收银进销存系统

electron + sqlite3 + express + react + antd

### introduct

- 订单：
  - 买单收银（含退换货）
  - 订单查询
  - 修改订单（付款方式，实收，会员，备注）
  - 删除订单（比较高危，慎用）
  - 对账（对账 OK 了的订单，状态显示绿色）
- 商品：
  - 商品查询（查询会带出同款其他 SKU 的列表，方便比对）
  - 修改商品（价格，库存）
  - 单品入库
  - 批量入库
- 会员：
  - 会员查询
  - 修改会员（基本信息）
  - 积分调整（加减积分）
  - 会员充值

### dev
npm run dev:pack

### build
npm run pack:mac

edit by 2025-03-12 by init project

