/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-04 10:40:04 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-04 10:54:36
 */
const config = require("../../../config.js");
const util = require("../../../utils/util.js");
const app = getApp();
Page({
  data: {
    msession: null,
    nowshopid: null,
    list: null,
    isshow: true
  },
  onLoad: function(options) {
    let _msession = wx.getStorageSync("msession");
    let _shopid = wx.getStorageSync("shopid");

    this.setData({
      msession: _msession,
      nowshopid: _shopid
    });

    this.refresh();
  },
  refresh() {
    /**
     * [refresh 请求数据]
     * 店铺列表
     * mobile/shopadmin/memberAllShops
     * 参数 msession
     */
    let that = this;
    let _msession = that.data.msession;
    let params = { msession: _msession };
    util.ajaxRequest("shopMobile/shopadmin/memberAllShops", params, function(
      res
    ) {
      console.log(res);
      if (res.data.content.length > 0) {
        that.setData({
          list: res.data.content,
          isshow: true
        });
        wx.setNavigationBarTitle({
          title: "切换店铺"
        });
      } else {
        that.setData({
          list: res.data.content,
          isshow: false
        });
        wx.setNavigationBarTitle({
          title: "还差一步"
        });
      }
    });
  },
  switch(e) {
    /**
     * 切换店铺记录状态
     * shopMobile/shopadmin/switchShop
     * 参数
     * {msession:'xxxx',shopid:204}
     */

    let that = this;
    let _shopid = e.currentTarget.dataset.shopid;
    let _msession = that.data.msession;
    let params = { msession: _msession, shopid: _shopid };

    util.ajaxRequest("shopMobile/shopadmin/switchShop", params, function(res) {
      if (res.data.status == 1) {
        wx.setStorage({
          key: "shopid",
          data: _shopid
        });
        app.shopid = _shopid;

        wx.reLaunch({
          url: "/pages/index/index"
        });
      } else {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.data.msg,
          success: function(res) {}
        });
      }
    });
  },
  //去商家中心
  goMinicenterAppId() {
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
  // 刷新
  onPullDownRefresh: function() {
    this.refresh();
    wx.stopPullDownRefresh();
  }
});
