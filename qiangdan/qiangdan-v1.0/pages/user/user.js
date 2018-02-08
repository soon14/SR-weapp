var openId;
Page({
  data: {
    avatarUrl: '',
    nickName: '',
    isauth: '',
    shenqing: '',
    shenhe: '',

  },
  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '0531-82373988'
    })
  }
  ,
  /**avatarUrl
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('ssssssss');
    var that = this
    openId = wx.getStorageSync('openid');

    that.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName'),
    })
    //this.judgeDC(this);


  },
  onShow: function () {
    this.judgeDC(this);
  }

  ,
  /**
   * 判断是否是配送员
   */
  judgeDC: function (that) {
    wx.request({
      url: getApp().globalData.baseURL + 'User/judgeDC',
      data: {
        openId: openId,
      },
      method: 'post',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        if (res.data.data == 0) {
          that.setData({
            isauth: false,
            shenqing: true,
            shenhe: false,
          });
        } else if (res.data.data == 1) {
          that.setData({
            isauth: true,
            shenqing: false,
            shenhe: false,
          });
        } else if (res.data.data == 2) {
          that.setData({
            isauth: false,
            shenqing: false,
            shenhe: true,
          });
        }
      
      },

      fail: function () {
        console.log('数据加载失败')
      }
    })
  }
})