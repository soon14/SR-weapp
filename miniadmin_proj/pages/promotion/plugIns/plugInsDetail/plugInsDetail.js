/*
 * 插件购买
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-04-10 10:58:06 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-04-26 18:36:24
 */
const util = require("../../../../utils/util.js");
const app = getApp();
Page({
  data: {
    plugin_id: null, //插件ID
    plugin_item_id: null, //插件子项id
    can_buy: false, //余额是否充足

    pluging_price: null, //插件价格
    pluging_gold: null, //最大可抵扣积分

    use_gold: true, //积分默认不可抵扣

    checkIndex: 0,
    checkArray: null
  },
  onLoad: function(options) {
    this.setData({
      plugin_id: options.id
    });
    this.getdata();
  },
  onShow: function() {},
  // 积分默认不可抵扣
  switchChange: function(e) {
    this.setData({
      use_gold: e.detail.value
    });
    this.balance();
  },
  getdata: function() {
    /**单个插件信息
     * 接口URL：/shopMobile/plugin/show
     * 交互类型：POST
     * 传入参数：
        {
            id:1,//插件id
        } 
    */
    let that = this,
      params = { shopid: wx.getStorageSync("shopid"), id: that.data.plugin_id };

    util.ajaxRequest("shopMobile/plugin/show", params, function(res) {
      if (res.data.status == 1) {
        let _plugininfo = res.data.content,
          _default = _plugininfo.items.default,
          _list = _plugininfo.items.list;

        that.setData({
          plugininfo: _plugininfo,
          plugin_id: _default.plugin_id,
          plugin_item_id: _default.id,
          checkArray: _list,
          pluging_price: _default.price, //插件价格
          pluging_gold: _default.gold //最大可抵扣积分
        });

        that.balance();
      } else {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.data.msg
        });
      }
    });
  },
  bindPickerChange: function(e) {
    let checkArray = this.data.checkArray,
      index = e.detail.value, //索引
      plugin_id = checkArray[index].plugin_id, //插件ID
      plugin_item_id = checkArray[index].id, //插件子项id
      price = checkArray[index].price, //价格
      gold = checkArray[index].gold; //最大可抵扣积分

    this.setData({
      checkIndex: index,
      plugin_id: plugin_id,
      plugin_item_id: plugin_item_id,
      pluging_price: price,
      pluging_gold: gold
    });

    this.balance();
  },
  // 立即订购
  formSubmit: function(e) {
    let that = this;

    if (!that.data.can_buy) {
      wx.showModal({
        title: "提示",
        content: "余额不足，是否去充值？",
        success: function(res) {
          if (res.confirm) {
            that.recharge();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
      return;
    }

    wx.showModal({
      title: "提示",
      content: "确定开通该功能？",
      success: function(res) {
        if (res.confirm) {
          let formId = e.detail.formId; //formId
          that.buyPlugin(formId);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  },
  buyPlugin(_formid) {
    /**   
       * 插件购买-下单
       * 接口URL：/shopMobile/pluginOrder/buyPlugin
       * 交互类型：POST
       * 传入参数：
            {
                shopid:204,//店铺id，不能为空
                plugin_id:1,//插件id，不能为空
                plugin_item_id:1,//插件子项id，不能为空
            }
       */
    let that = this,
      use_gold = that.data.use_gold,
      params = {
        formId: _formid,
        shopid: wx.getStorageSync("shopid"), //店铺id，不能为空
        plugin_id: that.data.plugin_id, //插件id，不能为空
        plugin_item_id: that.data.plugin_item_id, //插件子项id，不能为空
        use_gold: use_gold ? 1 : 0 //是否使用积分抵扣,0不使用，1使用
      };

    util.ajaxRequest("shopMobile/pluginOrder/buyPlugin", params, function(res) {
      if (res.data.status == 1) {
        let id = res.data.content.id; //插件订单id，不能为空
        that.payPlugin(id);
      } else {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.data.msg
        });
      }
    });
  },
  payPlugin(_id) {
    /**
     * 插件购买-支付
     * 接口URL：/shopMobile/pluginOrder/payPlugin
     * 交互类型：POST
     * 传入参数：
        {
            id:1,//插件订单id，不能为空
        } 
      */
    let that = this,
      params = {
        id: _id
      };

    util.ajaxRequest("shopMobile/pluginOrder/payPlugin", params, function(res) {
      if (res.data.status == 1) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.data.msg,
          success: function() {
            wx.switchTab({
              url: "/pages/promotion/promotion"
            });
          }
        });
      } else {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.data.msg
        });
      }
    });
  },
  balance: function() {
    /**
     * 乐墨点余额
     * 接口URL：/shopMobile/plugin/balance
     * 交互类型：POST
     * 传入参数：
        {
            msession:"e93e3ffa74674ae383a55e04c870575c",//用户msession,不能为空
            price:5.00//插件乐墨点价格
            gold_price:5.00//插件可抵扣积分价格
        }
        */
    let that = this,
      use_gold = that.data.use_gold,
      params = {
        msession: wx.getStorageSync("msession"),
        price: that.data.pluging_price,
        gold_price: that.data.pluging_gold,
        use_gold: use_gold ? 1 : 0
      };

    util.ajaxRequest("shopMobile/plugin/balance", params, function(res) {
      if (res.data.status == 1) {
        that.setData({
          balanceinfo: res.data.content,
          can_buy: res.data.content.can_buy //余额是否充足
        });
      } else {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.data.msg
        });
      }
    });
  },
  // 余额不足，去充值
  recharge: function() {
    //打开商家中心小程序
    wx.navigateToMiniProgram({
      appId: "wx4e6a6f3858930ae6",
      path: "/pages/component/myCount/myCount", //打开的页面路径，如果为空则打开首页
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
          content: res.errMsg
        });
      }
    });
  }
});
