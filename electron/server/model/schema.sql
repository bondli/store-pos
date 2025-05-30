-- 用户表
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `avatar` VARCHAR(255),
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL DEFAULT '123456',
    `email` VARCHAR(255),
    `status` VARCHAR(255) NOT NULL DEFAULT 'normal',
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单表
DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `orderSn` VARCHAR(255) NOT NULL,
    `orderStatus` VARCHAR(255) NOT NULL,
    `orderItems` INT DEFAULT 0,
    `originalAmount` DECIMAL(10,2) DEFAULT 0,
    `orderAmount` DECIMAL(10,2) DEFAULT 0,
    `orderActualAmount` DECIMAL(10,2) DEFAULT 0,
    `payType` VARCHAR(255) DEFAULT 'other',
    `userPhone` VARCHAR(255) DEFAULT '',
    `usePoint` INT DEFAULT 0,
    `useBalance` DECIMAL(10,2) DEFAULT 0,
    `useCoupon` DECIMAL(10,2) DEFAULT 0,
    `salerId` INT NOT NULL DEFAULT 0,
    `salerName` VARCHAR(255) DEFAULT '',
    `remark` VARCHAR(255) DEFAULT '',
    `source` VARCHAR(255) DEFAULT 'inshop',
    `extra` TEXT,
    `showStatus` VARCHAR(255) DEFAULT 'normal',
    `printStatus` VARCHAR(255) DEFAULT 'normal',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单商品表
DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `sn` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `size` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NOT NULL DEFAULT '戴维贝拉',
    `originalPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(10,2) DEFAULT 100,
    `actualPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `counts` INT NOT NULL DEFAULT 0,
    `orderSn` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'normal',
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 会员表
DROP TABLE IF EXISTS `Member`;
CREATE TABLE `Member` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `phone` VARCHAR(255) NOT NULL UNIQUE,
    `actual` DECIMAL(10,2) DEFAULT 0,
    `point` INT DEFAULT 0,
    `balance` DECIMAL(10,2) DEFAULT 0,
    `coupon` INT DEFAULT 0,
    `name` VARCHAR(255),
    `birthday` VARCHAR(255),
    `level` VARCHAR(255) DEFAULT 'normal',
    `status` VARCHAR(255) DEFAULT 'normal',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 会员积分记录表
DROP TABLE IF EXISTS `MemberScore`;
CREATE TABLE `MemberScore` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `phone` VARCHAR(255) NOT NULL,
    `point` INT NOT NULL DEFAULT 0,
    `type` VARCHAR(255) NOT NULL DEFAULT 'earn',
    `reason` VARCHAR(255) NOT NULL,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单优惠券使用记录表
DROP TABLE IF EXISTS `OrderCoupons`;
CREATE TABLE `OrderCoupons` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `orderSn` VARCHAR(255) NOT NULL,
    `couponId` INT NOT NULL,
    `couponDesc` VARCHAR(255),
    `couponType` VARCHAR(255) NOT NULL DEFAULT 'store',
    `usedValue` DECIMAL(10,2) DEFAULT 0,
    `usedTime` DATETIME,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- 会员余额变动记录表
DROP TABLE IF EXISTS `MemberBalance`;
CREATE TABLE `MemberBalance` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `phone` VARCHAR(255) NOT NULL,
    `value` INT NOT NULL DEFAULT 0,
    `type` VARCHAR(255) NOT NULL DEFAULT 'use',
    `reason` VARCHAR(255) NOT NULL,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- 会员优惠券表
DROP TABLE IF EXISTS `MemberCoupon`;
CREATE TABLE `MemberCoupon` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `phone` VARCHAR(255) NOT NULL,
    `couponId` VARCHAR(255) NOT NULL,
    `couponCondition` DECIMAL(10,2),
    `couponDesc` VARCHAR(255),
    `couponValue` DECIMAL(10,2) NOT NULL,
    `couponCount` INT NOT NULL DEFAULT 1,
    `couponStatus` VARCHAR(255) NOT NULL DEFAULT 'active',
    `couponExpiredTime` DATETIME,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 店铺优惠券表
DROP TABLE IF EXISTS `StoreCoupon`;
CREATE TABLE `StoreCoupon` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `activityId` INT NOT NULL,
    `couponCondition` DECIMAL(10,2),
    `couponDesc` VARCHAR(255),
    `couponValue` DECIMAL(10,2) NOT NULL,
    `couponCount` INT NOT NULL DEFAULT 1,
    `couponStatus` VARCHAR(255) NOT NULL DEFAULT 'active',
    `couponExpiredTime` DATETIME,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 营销活动表
DROP TABLE IF EXISTS `Marketing`;
CREATE TABLE `Marketing` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `marketingName` VARCHAR(255) NOT NULL,
    `marketingDesc` VARCHAR(255),
    `marketingType` VARCHAR(255) NOT NULL DEFAULT 'full_send',
    `marketingCondition` DECIMAL(10,2) NOT NULL,
    `marketingValue` DECIMAL(10,2) NOT NULL,
    `startTime` DATETIME NOT NULL,
    `endTime` DATETIME NOT NULL,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 库存表
DROP TABLE IF EXISTS `Inventory`;
CREATE TABLE `Inventory` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `sn` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `size` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NOT NULL DEFAULT '戴维贝拉',
    `costPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `originalPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `counts` INT NOT NULL DEFAULT 0,
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `saleCounts` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 库存变动记录表
DROP TABLE IF EXISTS `InventoryRecord`;
CREATE TABLE `InventoryRecord` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `sku` VARCHAR(255) NOT NULL,
    `count` INT NOT NULL DEFAULT 0,
    `info` VARCHAR(255) NOT NULL DEFAULT '',
    `type` VARCHAR(255) NOT NULL DEFAULT 'sale',
    `extra` TEXT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;