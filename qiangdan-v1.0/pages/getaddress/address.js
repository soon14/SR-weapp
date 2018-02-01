// pages/getaddress/address.js
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
var bmap = require('../../libs/bmap-wx.min.js');

var lonlat;
var city;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // lonlat = options.lonlat;
    //  city = options.city;
  },

  bindInput: function (e) {
    var that = this;
    if (e.detail.value === '') {
      that.setData({
        tips: ''
      });
      return;
    }
    var BMap = new bmap.BMapWX({
      ak: 'xqcpw3Og6PBKkXyA4dR1MN3Hn5hEpn7Y'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data)

      // var sugData = '';
      // for (var i = 0; i < data.result.length; i++) {
      //   sugData = sugData + data.result[i].name + '\n';
      // }
      that.setData({
        tips: data.result
      });
    }
    BMap.suggestion({
      query: e.detail.value,
      region: wx.getStorageSync('city'),
      city_limit: true,
      fail: fail,
      success: success
    });
  }
  ,
  bindSearch: function (e) {
    console.log('eee' + e.target.dataset.location.lat);
    console.log('eee' + e.target.dataset.location.lng);

    var keywords = e.target.dataset.keywords;
    var location = e.target.dataset.location.lng + "," + e.target.dataset.location.lat;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    prevPage.setData({
      name: keywords,
      postion: location,
    })

    //  var url = '../address/address?keywords=' + keywords + '&location=' + location + '&pos=' + pos;

    var url = '../address/address';
    wx.navigateBack({
      url: url
    })
  }

  // bindInput: function (e) {
  //   var that = this; 

  //    var keywords = e.detail.value;
  //   // var keywords = e.detail.value;
  //   // var keywords = e.detail.value;

  //   var key = config.Config.key;
  //   var myAmapFun = new amapFile.AMapWX({ key: key });

  //   myAmapFun.getInputtips({
  //     keywords: keywords,
  //     location: lonlat,
  //     city: wx.getStorageSync('city'),
  //     success: function (data) {

  //       if (data && data.tips) {
  //         that.setData({
  //           tips: data.tips
  //         });
  //       }
  //     }
  //   })
  // },
  // bindSearch: function (e) {
  //    console.log('eee' + e.target.dataset.location);

  //  var keywords = e.target.dataset.keywords;
  //  var location = e.target.dataset.location;

  //  var pages = getCurrentPages();
  //  var currPage = pages[pages.length - 1];   //当前页面
  //  var prevPage = pages[pages.length - 2];  //上一个页面

  //  prevPage.setData({
  //    name: keywords,
  //    postion: location,
  //   })

  // //  var url = '../address/address?keywords=' + keywords + '&location=' + location + '&pos=' + pos;

  //  var url = '../address/address'  ;
  //  wx.navigateBack({
  //     url: url
  //   })
  // }
})