var Api = require("../../utils/util.js");
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
  },


  onShow: function (options) {
    openid = wx.getStorageSync('openid');
    var that = this;
    wx.request({
      url: getApp().globalData.baseURL + 'order/getMyOrder',
      data: {
        openid: openid,
      },
      method: 'post',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var datas = res.data.data;
          for (var i = 0; i < datas.length; i++) {
            datas[i].time = Api.js_date_time(res.data.data[i].time);
            console.log(datas[i].time)

          }
          that.setData({
            datas: datas,
          })
        }


      },

      fail: function () {
        console.log('数据加载失败')
      }
    })
  }
})