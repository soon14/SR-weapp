var md5 = require('../../utils/md5.js');
var app = getApp();
Page({
  data: {
    id: 0,
    state: '',
    express: '',
    expressnum: '',
    expresstel: '',
    list: null,
    note: '',
    isnormal: true
  },
  onLoad: function (e) {
    var _id = e.id;
    this.setData({
      id: _id
    });
    this.sd_getdata(_id);
  },
  onPullDownRefresh: function () {
    var _id = this.data.id;
    this.sd_getdata(_id);
    wx.stopPullDownRefresh();
  },
  sd_getdata: function (_id) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    var that = this;

    var _timestamp = app.getTimeStamp();
    var _params = JSON.stringify({ id: _id });
    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

    wx.request({
      url: app.host + '/buyerMobile/order/getExpressInfo',
      data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      complete: function (res) {
        wx.hideToast();
        var obj = res.data;
        if (obj.deliverytype == 1) {
          that.setData({
            isnormal: true,
            state: app.deliverystatus[obj.state],
            express: obj.expressinfo.name,
            expressnum: obj.expressnum,
            expresstel: obj.expressinfo.tel,
            list: obj.list,
            note: obj.expressnotes
          });
        } else {
          that.setData({
            isnormal: false,
            note: obj.expressnotes
          });
        }

      }
    })


  },
  callexpress: function (e) {
    var phone = e.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  copynum: function (e) {
    var num = e.target.dataset.num;
    wx.setClipboardData({
      data: num,
      success: function (res) {
        wx.showToast({
          title: '运单号已复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }


})