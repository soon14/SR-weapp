var Api = require("../../utils/util.js");
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = wx.getStorageSync('openid');
    wx.request({
      url: getApp().globalData.baseURL + 'Money/getUserMoneyDetail',
      data: {
        openid: openid,
      },
      method: 'post',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        // that.setData({
        //   datas: res.data.data
        // });
        if (res.data.code == 1) {
          console.log(res.data.data.orderid);
          var datas = res.data.data;
          for (var i = 0; i < datas.length; i++) {
            console.log(Api.js_date_time(res.data.data[i].time)) ;
            
            datas[i].time = Api.js_date_time(res.data.data[i].time); 
             
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})