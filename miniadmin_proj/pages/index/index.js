/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-04 11:14:25 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-04 11:14:55
 */

const config = require("../../config.js");
const utils = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    // 本月累计金额
    total: "0.00",
    //订单金额
    month: "0.00",
    //二维码收款
    code: "0.00",
    //充值金额
    recharge: "0.00",

    // 是否显示没有店铺信息
    infoisshow: true,

    // 公告栏内容
    noticetitle: null,

    //商品订单里面是否显示拼团订单
    // isShowGroup: false,

    //店铺页面固定数据
    indexpageData: {
      //头部跳转地址
      goUrl: "/pages/index/operatingReport/operatingReport",
      cumulativeMonth: "本月累计金额(元)",
      orderAmount: "订单金额",
      qrsReceivables: "二维码收款",
      rechargeAmount: "充值金额",
      // 公告栏内容
      bulletinData: {
        bulletinimgUrl: "/images/gb.png",
        bulletinmsg: "这里是公告和运营技巧。",
        bulletinGoUrl: "/pages/index/notice/notice"
      }
    },
    // 日常经营数据
    columnData: [
      {
        columnname: "日常经营",
        columns: [
          {
            goUrl: "/pages/index/shopPosters/shopPosters",
            openType: "navigate",
            imgUrl: "/images/dphb.png",
            columntext: "店铺海报",
            isShow: true
          },
          {
            goUrl: "/pages/index/shopDecoration/shopDecoration",
            openType: "navigate",
            imgUrl: "/images/lbt.png",
            columntext: "店铺装修",
            isShow: true
          },
          {
            goUrl: "",
            openType: "navigate",
            imgUrl: "/images/lmxt.png",
            columntext: "商家中心",
            bindtap: "bindMinicenter",
            isShow: true
          },
          {
            // goUrl: '/pages/index/shopColumn/shopColumn',
            // openType: 'navigate',
            // imgUrl: '/images/lmsp.png',
            // columntext: '栏目商品'
          }
        ]
      },
      // 商品订单数据
      {
        columnname: "商品订单",
        columns: [
          {
            goUrl: "/pages/index/products/products",
            openType: "navigate",
            imgUrl: "/images/spgl.png",
            columntext: "商品管理",
            isShow: true
          },
          {
            goUrl:
              "/pages/index/orderManagement/orderManagement?state=1&type=1",
            openType: "navigate",
            imgUrl: "/images/dcldd.png",
            columntext: "普通订单",
            num: "0",
            type: "order",
            isShow: true
          },
          {
            goUrl:
              "/pages/index/orderManagement/orderManagement?state=3&type=2",
            openType: "navigate",
            imgUrl: "/images/hd.png",
            columntext: "活动订单",
            num: "0",
            type: "order",
            isShow: true
          },
          {
            goUrl: "/pages/promotion/groupon/grouponOrder/grouponOrder?type=3",
            openType: "navigate",
            imgUrl: "/images/v2.3.0/icon.png",
            columntext: "拼团订单",
            num: "0",
            type: "order",
            name: "groupOrder",
            isShow: false
          }
        ]
      },
      // 经营信息数据
      {
        columnname: "经营信息",
        columns: [
          {
            goUrl: "/pages/index/operatingReport/operatingReport",
            openType: "navigate",
            imgUrl: "/images/jybb.png",
            columntext: "经营报表",
            isShow: true
          },
          {
            goUrl: "/pages/index/revenueDetails/revenueDetails",
            openType: "navigate",
            imgUrl: "/images/szmx.png",
            columntext: "收支明细",
            isShow: true
          },
          {
            goUrl: "",
            openType: "navigate",
            imgUrl: "/images/fwsj.png",
            columntext: "访问数据",
            bindtap: "previewImage",
            isShow: true
          },
          {
            goUrl: "/pages/customer/customer",
            openType: "switchTab",
            imgUrl: "/images/khfx.png",
            columntext: "客户分析",
            isShow: true
          }
        ]
      }
      // 没有店铺时候数据
      // noshopData: {
      //     imgurl: '/images/sad_icon.png',
      //     txt: '欢迎使用乐墨花时光',
      //     btntxt: '开始使用',
      // },
    ]
  },
  onLoad: function(options) {},
  onShow: function() {
    app.custormer_topNavbarcurrentTab = 0;

    // 获取金额数据
    this.getdata();
  },
  // 获取金额数据
  getdata: function() {
    let that = this;
    let _shopid = wx.getStorageSync("shopid");
    let params = { shopid: _shopid };

    //判断商品订单是否显示拼团订单
    let params2 = {
      shopid: _shopid
    };
    utils.ajaxRequest("shopMobile/shopadmin/activityConfig", params2, function(
      res
    ) {
      let columnData = that.data.columnData;
      columnData[1].columns[3].isShow = res.data.content.group;
      that.setData({
        columnData: columnData
      });
    });
    utils.ajaxRequest("shopMobile/poster/totalMoneyByShopid", params, function(
      res
    ) {
      if (res.data.content.shopName) {
        wx.setNavigationBarTitle({
          title: res.data.content.shopName
        });
      }
      let columnData = that.data.columnData;
      let _default = res.data.content.default + "";
      let _virtual = res.data.content.virtual + "";
      let _group = res.data.content.group + "";

      if (parseInt(_default) > 99) {
        _default = "...";
      } else if (parseInt(_virtual) > 99) {
        _virtual = "...";
      } else if (parseInt(_group) > 99) {
        _group = "...";
      }

      columnData[1].columns[1].num = _default; //普通订单
      columnData[1].columns[2].num = _virtual; //活动订单
      columnData[1].columns[3].num = _group; //拼团订单

      that.setData({
        total: res.data.content.total,
        month: res.data.content.month,
        code: res.data.content.code,
        recharge: res.data.content.recharge,
        columnData: columnData,
        noticetitle: res.data.content.noticetitle
      });
    });
  },
  //客户分析
  goUrl: function(e) {
    // console.log(e.currentTarget.dataset.name);
    let name = e.currentTarget.dataset.name;
    if (name == "客户分析") {
      app.custormer_topNavbarcurrentTab = 2;
    }
  },
  bindMinicenter: function() {
    //打开商家中心小程序
    wx.navigateToMiniProgram({
      appId: config.minicenterAppId,
      path: "", //打开的页面路径，如果为空则打开首页
      extraData: {
        // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
      },
      success(res) {
        console.log(res);
        // 打开成功
      },
      fail(res) {
        //接口调用失败的回调函数
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.errMsg,
          success: function(res) {}
        });
      }
    });
  },
  //访问数据
  previewImage: function() {
    let urls = [app.cdnhost + "/resMobile/img/data_help.png"];
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.getdata();
    wx.stopPullDownRefresh();
  }
});
