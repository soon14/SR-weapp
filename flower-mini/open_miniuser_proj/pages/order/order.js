var md5 = require('../../utils/md5.js');
var app = getApp();
Page({

  data: {
    songdate: '',
    isneedcard: false,
    hasaddress: false,
    address1: '',
    address2: '',
    proid: 0,
    proinfo: null,
    propic: '',
    fusername: '',
    ftelphone: '',
    faddress: '',
    isanonymous: true,
    purposeIndex: 0,
    purposes: null,
    yunfei: '0.00',
    price: '0.00',
    totalprice: '0.00',
    disable: false,
    username: '',
    telphone: '',
    canclick: true
  },
  switchChange: function (e) {
    this.setData({
      isanonymous: e.detail.value
    });
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
          price: res.data.content.price,
          propic: app.cdnhost + res.data.content.mainpic,
          totalprice: res.data.content.price
        });
      }
    });

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
      url: '/pages/order/orderself?proid=' + proid
    })
  },
  needCard: function (e) {
    this.setData({
      isneedcard: e.detail.value
    });
  },
  selectaddress: function () {
    var that = this;
    var _shopid = app.shopid;
    var _proid = this.data.proid;
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          hasaddress: true,
          address1: res.userName + ' ' + res.telNumber,
          address2: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          fusername: res.userName,
          ftelphone: res.telNumber,
          faddress: res.provinceName + res.cityName + res.countyName + res.detailInfo
        });

        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({
          shopid: _shopid,
          proid: _proid,
          province: encodeURIComponent(res.provinceName),
          city: encodeURIComponent(res.cityName),
          county: encodeURIComponent(res.countyName),
          detailinfo: encodeURIComponent(res.detailInfo)
        });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
          url: app.host + '/buyerMobile/faretmpl/newGetYunFei',
          data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'POST',
          complete: function (res) {
            if (parseFloat(res.data.money) == -1) {
              that.setData({
                disable: true
              });
              wx.showModal({
                title: '提示',
                content: '对不起，该地区不支持配送',
                showCancel: false,
                success: function (res) {

                }
              });
              return;
            } else {
              that.setData({
                disable: false,
                yunfei: res.data.money,
                totalprice: (parseFloat(res.data.money) + parseFloat(that.data.price)).toFixed(2)
              });
            }

          }
        });
      },
      fail: function (res) {
        console.info(res);
        if (res.errMsg.indexOf('auth deny') > 0) {
          wx.showModal({
            title: '提示',
            confirmText: '去授权',
            content: '请授权访问你的收货地址',
            showCancel: false,
            success: function (res) {
              wx.openSetting({
                success:function(){

                }
              })
            }
          });
        }
      }
    })
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
    var that = this;

    if (thatdata.disable) {
      wx.showModal({
        title: '提示',
        content: '对不起，该地区不支持配送',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (_openid == '' || _openid == 'undefined' || _openid == undefined) {
      wx.showModal({
        title: '提示',
        confirmText: '去授权',
        content: '您还没有授权获取您的信息',
        showCancel: false,
        success: function (res) {
          that.applyuser();
        }
      });
      return;
    }

    if (thatdata.faddress == '') {
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (formdata.username == '') {
      wx.showModal({
        title: '提示',
        content: '订购人姓名还未填写',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (formdata.telphone == '') {
      wx.showModal({
        title: '提示',
        content: '订购人电话还未填写',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }

    if (thatdata.songdate == '日期') {
      wx.showModal({
        title: '提示',
        content: '配送时间还未选择',
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
    if (!this.data.canclick) {
      return;
    };
    this.setData({
      canclick: false
    });

    var _needcard = thatdata.isneedcard ? 1 : 0;
    var _isanonymous = thatdata.isanonymous ? 1 : 0;
    var _productprice = thatdata.proinfo.price;
    var _purpose = app.purpose[thatdata.purposeIndex];
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
      fusername: encodeURIComponent(thatdata.fusername),
      ftelphone: thatdata.ftelphone,
      faddress: encodeURIComponent(thatdata.faddress),
      productprice: _productprice,
      productnum: 1,
      postage: thatdata.yunfei,
      note: encodeURIComponent(formdata.note),
      needcard: _needcard,
      cardwords: encodeURIComponent(formdata.cardwords),
      isanonymous: _isanonymous,
      purpose: encodeURIComponent(_purpose),
      isselftake: 0,
      telphone: formdata.telphone,
      username: encodeURIComponent(formdata.username),
      needsendtime: thatdata.songdate,
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
      success: function(res) {
        console.log(res.data)
      },
      complete: function (res) {
        console.log('---下单1')
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
            'success': function (res) {
              console.info(res);
              that.setData({
                canclick: true
              });
              var _timestamp1 = app.getTimeStamp();
              var _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
              var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);

              wx.request({
                url: orderSucUrl,
                data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                method: 'POST',
                complete: function (res) {
                  wx.redirectTo({
                    url: '/pages/order/ordersuc?id=' + _orderid
                  });
                }
              })

            },
            'fail': function (res) {
              that.setData({
                canclick: true
              });
              wx.redirectTo({
                url: '/pages/me/orderdetails?id=' + _orderid
              });
            }
          });
        } else {
          that.setData({
            canclick: true
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
