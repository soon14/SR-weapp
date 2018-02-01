// pages/peisongyuan/peisongyuan.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    latitudes: '',
    longitudes: '',
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '4R5BZ-GHWWR-YV6WW-WR2P7-GZRM5-SRBCW'
    });
    this.getPostion(this);
  },
  getPostion: function (that) {

    wx.request({
      url: getApp().globalData.baseURL + 'user/getPostion',
      data: {
        openId: wx.getStorageSync('openid'),
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        console.log(res.data.data.lat);
        console.log(res.data.data.lon);

   

        // // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.data.data.lat,
            longitude: res.data.data.lon,
          },
          coord_type: 3,//baidu经纬度
          success: function (res) {
            var location = res.result.ad_info.location;
        
            console.log(location.lat);
            console.log(location.lng);

            that.setData({
              latitudes: location.lat,
              longitudes: location.lng,
              markers: [{
                iconPath: "../../images/pei.png",
                id: 0,
                latitude: location.lat,
                longitude: location.lng,
                // width: 30,
                // height: 50
              }],
            })



          }
        });



      }
    })




  },
})