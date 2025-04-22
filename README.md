# store-pos
线下店铺收银进销存系统

electron + sqlite3 + express + react + antd

### introduct

- 订单：
  - 买单收银
  - 订单查询
  - 修改订单（付款方式，实收，会员，导购员，备注）
  - 删除订单（比较高危，慎用）
  - 对账（对账 OK 了的订单，状态显示绿色）
  - 退单
  - 换货
- 商品：
  - 商品查询（查询会带出同款其他 SKU 的列表，方便比对）
  - 修改商品（库存数量）
  - 单品入库
  - 批量入库
- 会员：
  - 会员查询
  - 修改会员（基本信息）
  - 积分调整（加减积分）
  - 会员充值
  - 优惠券（系统活动具备券能力，在下单后如果满足送券自己发到用户账户）

- 营销：
  - 店铺券：下单的时候根据用户实际的支付金额，做满减（如满300减30）
  - 用户券：如满减券，下单的时候选择消费
  - 满赠：直接在待售的商品列表上，选择N件商品做赠送（常规活动满三送一）
  - 用户如何获得券：
    - 下单的时候根据支付金额 + 当前系统是否有活动（满多少送多少，可以是满减券，或者现金红包），直接发到用户的账单中
    - 自行领取（后续配合用户端小程序中领取）

- 数据库中几个coupon表解释：
  - marketing 活动表，根据活动类型，在创建的时候会在 storeCoupon表中生成记录，通过activityId 和 marketing表形成关联
  - storeCoupon 店铺优惠券表，用于承接店铺活动，会在满足条件的情况下给用户发券，和在满减活动的时候直接下单时可以使用
  - memberCoupon 会员优惠券表，从店铺满送活动中，满足条件的时候，实例化到这个表中，成为用户的券资产，下单的时候可以使用
  - orderCoupon 订单关联优惠券，用于保存订单中使用的券记录，方便追溯

### dev
yarn run dev

### build
yarn run pack:mac
yarn run pack:win

### windows下开发需要注意：

```shell
# 安装 windows-build-tools（需要管理员权限运行 PowerShell）
npm install --global --production windows-build-tools

# 安装 node-gyp
npm install --global node-gyp

# 设置 Python 版本
npm config set python python3

# 设置 Visual Studio 版本
npm config set msvs_version 2019
```

如果还是出错，可以执行
```shell
# 1. 清理之前的安装
rm -rf node_modules
rm yarn.lock

# 2. 清理 npm 缓存
npm cache clean --force

# 3. 安装依赖
yarn install

# 4. 如果还有问题，可以尝试单独安装 sqlite3
yarn add sqlite3@5.1.6 --build-from-source
```
