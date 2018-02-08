/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost
 Source Database       : getorder

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : utf-8

 Date: 02/01/2018 11:53:53 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `gt_all_money`
-- ----------------------------
DROP TABLE IF EXISTS `gt_all_money`;
CREATE TABLE `gt_all_money` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `allMoney` decimal(28,2) DEFAULT NULL,
  `openid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `gt_city`
-- ----------------------------
DROP TABLE IF EXISTS `gt_city`;
CREATE TABLE `gt_city` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `city` varchar(10) DEFAULT NULL,
  `lon` varchar(50) DEFAULT NULL COMMENT '经度',
  `lat` varchar(50) DEFAULT NULL COMMENT '维度',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `gt_city`
-- ----------------------------
BEGIN;
INSERT INTO `gt_city` VALUES ('2', '济南市', '117.120098', '36.6512'), ('3', '济宁市', '116.587245', '35.415393'), ('4', '上海市', '121.473658', '31.230378');
COMMIT;

-- ----------------------------
--  Table structure for `gt_getorder`
-- ----------------------------
DROP TABLE IF EXISTS `gt_getorder`;
CREATE TABLE `gt_getorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(50) DEFAULT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `gt_jc_fee`
-- ----------------------------
DROP TABLE IF EXISTS `gt_jc_fee`;
CREATE TABLE `gt_jc_fee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `yijia` decimal(50,2) DEFAULT NULL COMMENT '溢价金额',
  `status` varchar(10) DEFAULT NULL COMMENT '0是关闭溢价 1是开启溢价',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `gt_jc_fee`
-- ----------------------------
BEGIN;
INSERT INTO `gt_jc_fee` VALUES ('1', '3.00', '0');
COMMIT;

-- ----------------------------
--  Table structure for `gt_jcfee`
-- ----------------------------
DROP TABLE IF EXISTS `gt_jcfee`;
CREATE TABLE `gt_jcfee` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `jc_zl` varchar(30) NOT NULL DEFAULT '0' COMMENT '基础重量',
  `yi_gl` varchar(20) NOT NULL DEFAULT '0' COMMENT '一公里钱数',
  `yi_gj` varchar(20) NOT NULL DEFAULT '0' COMMENT '一公斤钱数',
  `jcfee` varchar(20) DEFAULT NULL,
  `jc_lc` varchar(30) DEFAULT NULL COMMENT '基础路程',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `gt_jcfee`
-- ----------------------------
BEGIN;
INSERT INTO `gt_jcfee` VALUES ('1', '5', '3', '2', '14', '5');
COMMIT;

-- ----------------------------
--  Table structure for `gt_money_detail`
-- ----------------------------
DROP TABLE IF EXISTS `gt_money_detail`;
CREATE TABLE `gt_money_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` decimal(28,0) DEFAULT NULL COMMENT '金额',
  `is_ti` tinyint(2) DEFAULT NULL COMMENT '是否提现 0是提现中 1是已提现',
  `time` varchar(50) DEFAULT NULL COMMENT '时间',
  `openid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `gt_order`
-- ----------------------------
DROP TABLE IF EXISTS `gt_order`;
CREATE TABLE `gt_order` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `orderid` varchar(50) NOT NULL COMMENT '订单号',
  `ji_lon` varchar(20) DEFAULT NULL COMMENT '寄件人精度',
  `ji_lat` varchar(20) DEFAULT NULL COMMENT '寄件人维度',
  `shou_lon` varchar(20) DEFAULT NULL COMMENT '收件人经度',
  `shou_lat` varchar(20) DEFAULT NULL COMMENT '收件人维度',
  `ji_name` varchar(20) DEFAULT NULL COMMENT '寄件人姓名',
  `ji_tel` varchar(11) DEFAULT NULL COMMENT '寄件人电话',
  `shou_name` varchar(20) DEFAULT NULL COMMENT '收件人姓名',
  `shou_tel` varchar(20) DEFAULT NULL COMMENT '收件人电话',
  `jia_price` decimal(50,0) DEFAULT NULL,
  `isjia` tinyint(2) DEFAULT '0' COMMENT '是否加价    0是不加价  1是加价',
  `payprice` decimal(50,0) DEFAULT NULL COMMENT '支付钱数',
  `shou_address` varchar(50) DEFAULT NULL,
  `ji_address` varchar(50) DEFAULT NULL,
  `order_status` varchar(10) DEFAULT NULL COMMENT '订单状态id 1.未支付   2.已支付 3.已送货 4.已到达',
  `goodsname` varchar(50) DEFAULT NULL COMMENT '物品名称',
  `remark` varchar(100) DEFAULT NULL COMMENT '备注',
  `openid` varchar(100) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL COMMENT '插入时间',
  `getorder_status` int(2) DEFAULT '0' COMMENT '抢单状态  0表示没被抢  1表示被抢了',
  `gl` varchar(20) DEFAULT NULL COMMENT '公里数',
  `zl` varchar(20) DEFAULT NULL COMMENT '重量数',
  `jiedancode` int(6) DEFAULT NULL,
  `querencode` int(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `gt_orderstatus`
-- ----------------------------
DROP TABLE IF EXISTS `gt_orderstatus`;
CREATE TABLE `gt_orderstatus` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `gt_orderstatus`
-- ----------------------------
BEGIN;
INSERT INTO `gt_orderstatus` VALUES ('1', '未支付'), ('2', '已支付'), ('3', '配送中'), ('4', '已完成');
COMMIT;

-- ----------------------------
--  Table structure for `gt_pspos`
-- ----------------------------
DROP TABLE IF EXISTS `gt_pspos`;
CREATE TABLE `gt_pspos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openId` varchar(255) DEFAULT NULL,
  `lon` varchar(50) DEFAULT NULL,
  `lat` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `gt_psuser`
-- ----------------------------
DROP TABLE IF EXISTS `gt_psuser`;
CREATE TABLE `gt_psuser` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `realname` varchar(20) DEFAULT NULL,
  `openId` varchar(50) DEFAULT NULL,
  `isauth` tinyint(3) DEFAULT '0' COMMENT '是否审核   0是未审核    1是已审核 2审核中',
  `cardpic_z` varchar(255) DEFAULT NULL COMMENT '身份证正面照片',
  `cardpic_f` varchar(255) DEFAULT NULL COMMENT '身份证反面',
  `cardnum` varchar(50) DEFAULT NULL COMMENT '身份证号码',
  `wename` varchar(50) DEFAULT NULL COMMENT '微信名称',
  `weimage` varchar(255) DEFAULT NULL COMMENT '微信头像',
  `retime` varchar(20) DEFAULT NULL COMMENT '注册时间',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `status` tinyint(2) DEFAULT NULL COMMENT '0表示正常   1表示禁用',
  `jj_tel` varchar(11) DEFAULT '' COMMENT '紧急联系人',
  `tel_yz` tinyint(1) DEFAULT NULL COMMENT '验证手机号  0是未验证   1是验证',
  `cards` varchar(18) DEFAULT NULL COMMENT '银行卡号',
  `bankName` varchar(50) DEFAULT NULL COMMENT '银行名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `gt_user`
-- ----------------------------
DROP TABLE IF EXISTS `gt_user`;
CREATE TABLE `gt_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `gt_user`
-- ----------------------------
BEGIN;
INSERT INTO `gt_user` VALUES ('1', 'admin1', '21232f297a57a5a743894a0e4a801fc3');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
