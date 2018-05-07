/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-04-09 15:14:11 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-04-26 18:33:06
 */
const utils = require("../../utils/util.js");
const pluginConfig = require("../../utils/pluginConfig.js"); //插件配置信息
const app = getApp();
Page({
  data: {
    cdnhost: app.cdnhost,
    pluginList: null, //插件列表
    isBingGuangda: 0, //是否绑定光大
    recharge: null, //客户充值信息
    sharecoupon: null, //社交立减金
    groupSetList: null, //拼团活动列表
    coupon: null, //优惠券
    goUrl: "/pages/financialManagement/financialOperation/financialOperation", //跳转到客户资料卡操作页
    isShowGroup: false, //是否显示团功能
    state: 1 //1进行中的活动 2已过期的活动
  },
  onLoad: function(options) {},
  onShow: function() {
    let that = this;

    that.setData({
      activityConfig: app.activityConfig
    });

    that.getAllList();

    that.getdata();
  },
  // 获取初始数据
  getdata: function() {
    let that = this;
    let state = that.data.state;
    let status = 2;

    if (state == 2) {
      status = 1;
    }

    let _shopid = wx.getStorageSync("shopid");
    let params = {
      shopid: _shopid,
      status: status //2有效的,1失效的 和团购列表状态相反
    };

    //判断是否显示拼团和敬请期待
    let params2 = {
      shopid: _shopid
    };
    utils.ajaxRequest("shopMobile/shopadmin/activityConfig", params2, function(
      res
    ) {
      that.setData({
        isShowGroup: res.data.content.group
      });
    });
    utils.ajaxRequest(
      "shopMobile/rechargeInfo/GetListsByStatus",
      params,
      function(res) {
        if (res.data.status == 1) {
          let data = res.data.content;
          that.setData({
            recharge: res.data.content.recharge,
            coupon: res.data.content.coupon,
            sharecoupon: res.data.content.sharecoupon
          });
        } else {
          console.log(res.data.msg);
        }
      }
    );

    that.groupSetList(); //拼团活动列表：
  },
  groupSetList: function() {
    /**
         * 拼团活动列表：
         * 接口URL：/shopMobile/groupSet/groupSetList
         * 交互类型：POST
         * 传入参数：{
                shopid:204,
                state:1,//1有效的，2失效的
                page:1,//第几页，
                limit:500//每页数据数
            }
         */
    let that = this;
    let _shopid = wx.getStorageSync("shopid");
    let params = {
      shopid: _shopid,
      state: that.data.state, //1有效的，2失效的
      page: 1, //第几页，
      limit: 500 //每页数据数
    };

    utils.ajaxRequest("shopMobile/groupSet/groupSetList", params, function(
      res
    ) {
      let data = res.data.content;
      if (res.data.status == 1) {
        that.setData({
          groupSetList: res.data.content.list
        });
      } else {
        console.log(res.data.msg);
      }
    });
  },
  // 选择活动
  changeState: function(e) {
    this.setData({
      state: e.currentTarget.dataset.state
    });

    this.getdata();
  },
  goUrl: function(e) {
    let promotion_id = e.currentTarget.dataset.promotion_id;
    wx.navigateTo({
      url:
        "/pages/promotion/customerRecharge/customerRecharge?promotion_id=" +
        promotion_id
    });
  },
  /**
   * [refresh 请求数据]
   * 是否店铺主管理员
   * mobile/shopadmin/isMainManager
   * 参数 shopid,msession
   */
  recharge: function() {
    let that = this;
    let _msession = wx.getStorageSync("msession");
    let _shopid = wx.getStorageSync("shopid");
    let params = { shopid: _shopid, msession: _msession };

    utils.ajaxRequest("shopMobile/shopadmin/isMainManager", params, function(
      res
    ) {
      if (res.data.status == 1) {
        wx.navigateTo({
          url: pluginConfig.recharge
        });
      } else {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "仅店铺主管理员才可以操作",
          success: function(res) {}
        });
      }
    });
  },
  // 社交立减金
  share_coupon() {
    wx.navigateTo({
      url:
        pluginConfig.share_coupon +
        "?promotionid=" +
        this.data.sharecoupon[0].id
    });
  },
  // 优惠券'
  coupon() {
    wx.navigateTo({
      url: pluginConfig.coupon
    });
  },
  // 评价管理
  comment() {
    wx.navigateTo({
      url: pluginConfig.comment
    });
  },
  // 拼团
  group: function() {
    wx.navigateTo({
      url: pluginConfig.group
    });
  },
  // 使用插件
  usePlugin(e) {
    let that = this,
      id = e.currentTarget.dataset.id,
      canuse = e.currentTarget.dataset.canuse,
      enkey = e.currentTarget.dataset.enkey,
      _pluginConfig = pluginConfig;

    if (canuse) {
      let _url = "";

      for (var key in _pluginConfig) {
        if (key == enkey) {
          _url = _pluginConfig[key];
        }
      }

      wx.navigateTo({
        url: _url
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "该功能暂未开通，去开通？",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: pluginConfig.payPlugin + "?id=" + id
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  },
  getAllList() {
    /**
     * 所有在售插件列表
     * 接口URL：/shopMobile/plugin/getAllList
     * 交互类型：POST
     * 传入参数：
            {
                shopid:204,//店铺id
            }
        */
    let that = this,
      params = { shopid: wx.getStorageSync("shopid") };

    utils.ajaxRequest("shopMobile/plugin/getAllList", params, function(res) {
      if (res.data.status == 1) {
        let pluginList = res.data.content;
        //插件事件名与 en_key 相同 方便处理
        that.setData({
          pluginList: pluginList
        });
      } else {
        console.log("所有在售插件列表:err", res.data.msg);
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getdata();

    wx.stopPullDownRefresh();
  }
});
