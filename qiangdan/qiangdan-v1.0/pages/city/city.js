
Page({

  data: {
    "cityList": null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.request({
      url: getApp().globalData.baseURL+'Address/getCity',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);

        that.setData({
          cityList: res.data.data
        })
      },
      fail: function () {
        console.log('数据加载失败')
      }
    })


  },
  tapCity:function(e){

    var that = this;
    console.log(e)
    getApp().globalData.city = e.currentTarget.dataset.city;
    getApp().globalData.lat = e.currentTarget.dataset.lat;
    getApp().globalData.lon = e.currentTarget.dataset.lon;
    wx.setStorageSync('city', e.currentTarget.dataset.city)
    wx.setStorageSync('lat', e.currentTarget.dataset.lat)
    wx.setStorageSync('lon', e.currentTarget.dataset.lon)

    wx.navigateTo({
      url: "/pages/index/index"
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