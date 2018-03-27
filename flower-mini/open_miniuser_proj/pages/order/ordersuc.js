var md5 = require('../../utils/md5.js');
var app = getApp();
Page({

  data: {
    item: null,
    addtimestr:'',
    paytimestr:''
  },

  onLoad: function (e) {
    var _id = e.id;
    var that = this;
    var _timestamp = app.getTimeStamp();
    var _params = JSON.stringify({ id: _id });
    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
    wx.request({
      url: app.host + '/buyerMobile/order/newGet',
      data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      complete: function (res) {
        that.setData({
          item: res.data,
          addtimestr:app.getLocalTime(res.data.addtime),
          paytimestr: app.getLocalTime(res.data.paytime)
        });
      }
    })
  },
  gotoorder: function (e) {
    var id = this.data.item.id;
    wx.redirectTo({
      url: '/pages/me/orderdetails?id=' + id
    })
  }
})
