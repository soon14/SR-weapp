var md5 = require('../../utils/md5.js');
var app = getApp();
Page({
  data: {
    songdate: '',
    isneedcard: false,
    proid: 0,
    proinfo: null,
    propic: '',
    purposeIndex: 0,
    purposes: null,
    username: '',
    telphone: '',
    canclick: true
  },

  onLoad: function (e) {
    var username = wx.getStorageSync('username');
    if (username != null && username != '') {
      this.setData({
        username: username
      });
    }
    var telphone = wx.getStorageSync('telphone');
    if (telphone != null && telphone != '') {
      this.setData({
        telphone: telphone
      });
    }
    var _proid = e.proid;
    var _shopid = app.shopid;
    var that = this;
    var _timestamp = app.getTimeStamp();
    var _params = JSON.stringify({ shopid: _shopid, id: _proid });
    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
    wx.request({
      url: app.host + '/buyerMobile/product/ShowProDetailByBuyer',
      data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      complete: function (res) {
        that.setData({
          proinfo: res.data.content,
          propic: app.cdnhost + res.data.content.mainpic
        });
      }
    })
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;

    var str = year + '-' + month + '-' + date;

    this.setData({
      proid: _proid,
      purposes: app.purpose,
      songdate: str
    });
  },

  tabClick: function (e) {
    var proid = this.data.proid;
    wx.redirectTo({
      url: '/pages/order/order?proid=' + proid
    })
  },
  needCard: function (e) {
    this.setData({
      isneedcard: e.detail.value
    });
  },
  bindDateChange: function (e) {
    this.setData({
      songdate: e.detail.value
    })
  },

  bindPurposeChange: function (e) {
    this.setData({
      purposeIndex: e.detail.value
    })
  },
  applyuser: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          var _timestamp = app.getTimeStamp();
          var _params = JSON.stringify({ code: res.code, shopid: app.shopid });
          var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

          wx.request({
            url: app.host + '/buyerMobile/wxuser/index',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res) {
              console.info(res.data);
              var openid = res.data.openid;
              wx.setStorage({
                key: "openid",
                data: openid
              });
            }
          });
        }
      },
      fail: function (res) {
        console.info('login fail ');
      }
    })
  },
  formSubmit: function (e) {
    var _formId = e.detail.formId;
    var _shopid = app.shopid;
    var _proid = this.data.proid;
    var _openid = wx.getStorageSync('openid');
    var thatdata = this.data;
    var formdata = e.detail.value;
    var _needcard = thatdata.isneedcard ? 1 : 0;
    var _isanonymous = -1;
    var _productprice = thatdata.proinfo.price;
    var _fareid = -1;
    var _purpose = app.purpose[thatdata.purposeIndex];

    var that = this;
    if (_openid == '' || _openid == 'undefined' || _openid == undefined) {
      wx.showModal({
        title: '提示',
        content: '您好像没有授权获取信息',
        showCancel: false,
        success: function (res) {
          that.applyuser();
        }
      });
      return;
    }

    if (formdata.username == '') {
      wx.showModal({
        title: '提示',
        content: '取花人姓名还未填写',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (formdata.telphone == '') {
      wx.showModal({
        title: '提示',
        content: '取花人电话还未填写',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (thatdata.songdate == '日期') {
      wx.showModal({
        title: '提示',
        content: '取花时间还未选择',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (thatdata.isneedcard && formdata.cardwords == '') {
      wx.showModal({
        title: '提示',
        content: '卡片留言还未填写',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (!this.data.canclick) { return; }
    that.setData({
      canclick: false
    });
    wx.setStorage({
      key: "username",
      data: formdata.username
    });
    wx.setStorage({
      key: "telphone",
      data: formdata.telphone
    });
    var _timestamp = app.getTimeStamp();
    var _params = JSON.stringify({
      shopid: _shopid,
      openid: _openid,
      productid: _proid,
      fusername: '',
      ftelphone: '',
      faddress: '',
      productprice: _productprice,
      productnum: 1,
      postage: 0,//TODO::
      note: encodeURIComponent(formdata.note),
      needcard: _needcard,
      cardwords: encodeURIComponent(formdata.cardwords),
      isanonymous: _isanonymous,
      purpose: encodeURIComponent(_purpose),
      isselftake: 1,
      telphone: formdata.telphone,
      username: encodeURIComponent(formdata.username),
      needsendtime: thatdata.songdate,
      fareid: _fareid,
      title: encodeURIComponent(thatdata.proinfo.title),
      formId: _formId
    });
    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

    if(app.haveBindGuangda){
      console.log('have bind');
      var addUrl = app.host + '/buyerMobile/orderBank/add';
      var orderSucUrl = app.host + '/buyerMobile/orderBank/ordersuc';
    }else{
      var addUrl = app.host + '/buyerMobile/order/WxOrderAdd';
      var orderSucUrl = app.host + '/buyerMobile/order/ordersuc';
    }

    wx.request({
      url: addUrl,
      data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      complete: function (res) {
        console.log('下单2');
        console.log(res.data);
        var suc = res.data.suc;
        if (suc == 1) {
          var _orderid = res.data.orderid;
          var _prepayid = res.data.package;

          wx.requestPayment({
            timeStamp: res.data.timeStamp + '',
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            'success': function (res2) {
              console.info(res2);
              that.setData({
                canclick: false
              });
              var _timestamp1 = app.getTimeStamp();
              var _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
              var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);
              wx.request({
                url: orderSucUrl,
                data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                method: 'POST',
                success: function (res3) {
                  wx.redirectTo({
                    url: '/pages/order/ordersuc?id=' + _orderid
                  });
                },
                fail: function (reserr) {
                  console.info(reserr);
                }
              })

            },
            'fail': function (res4) {
              that.setData({
                canclick: false
              });
              wx.redirectTo({
                url: '/pages/me/orderdetails?id=' + _orderid
              });
            }
          })
        }
        else {
          that.setData({
            canclick: false
          });
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {

            }
          });
          return;
        }
      }
    })
  }
})
