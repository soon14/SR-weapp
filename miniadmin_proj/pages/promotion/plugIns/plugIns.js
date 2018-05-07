/*
 * 插件购买
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-04-10 10:50:04 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-04-10 17:24:20
 */
const util = require("../../../utils/util.js");
const app = getApp();
Page({
  data: {
    cdnhost: app.cdnhost,
    plugininfo: null, //插件信息
    imgslist: null //轮播图片
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.getdata();
  },
  onShow: function() {},
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
      params = { shopid: wx.getStorageSync("shopid"), id: that.data.id };

    util.ajaxRequest("shopMobile/plugin/show", params, function(res) {
      if (res.data.status == 1) {
        that.setData({
          plugininfo: res.data.content,
          imgslist: res.data.content.imgslist
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
  // 立即订购
  goUrl: function() {
    let that = this,
      _id = that.data.id;
    wx.navigateTo({
      url: "/pages/promotion/plugIns/plugInsDetail/plugInsDetail?id=" + _id
    });
  }
});
