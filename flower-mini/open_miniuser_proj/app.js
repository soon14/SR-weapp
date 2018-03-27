//app.js
var md5 = require('./utils/md5.js');
App({
    onLaunch: function(options) {
        var wxapp = this;
        if (wx.getExtConfig) {
            wx.getExtConfig({
                success: function(res) {
                    // console.log(res.extConfig.shopid);
                    wxapp.shopid = res.extConfig.shopid;
                    wxapp.shopkey = res.extConfig.shopkey;

                    wx.setStorageSync('shopid', res.extConfig.shopid);
                    wx.setStorageSync('shopkey', res.extConfig.shopkey);

                    wxapp.auth();

                    //判断有没有签约光大
                    // console.log(wxapp);
                    // var _timestamp = wxapp.getTimeStamp();
                    // var _params = JSON.stringify({
                    //  shopid: wxapp.shopid
                    // });
                    // console.log( wxapp.shopkey);
                    // var _sign = md5.hex_md5(_timestamp + _params + wxapp.shopkey);
                    // wx.request({
                    //  url: 'https://ilearnmore.net/buyerMobile/shop/haveBindGuangda',
                    //  data: {params: _params, sign: _sign, timestamp: _timestamp, shopid: wxapp.shopid},
                    //  header: {"Content-Type": "application/x-www-form-urlencoded"},
                    //  method: 'POST',
                    //  complete: function (res) {
                    //      if (res.data.suc == 1) {
                    //          // console.log(res.data);
                    //          wxapp.isBingGuangda = 1;
                    //          wx.setStorageSync('isBingGuangda', wxapp.isBingGuangda);
                    //      }
                    //  }
                    // })

                }
            })

        
        }


    },
    orderstatetitle: ['待付款', '待接单', '待发货', '待收货', '已取消', '已完成', '拒绝订单', '已关闭'],
    purpose: ['恋人', '朋友', '长辈', '领导', '客户', '老师', '其他'],
    deliverys: ['', '普通快递', '专人配送', '无需物流'],
    deliverystatus: ['', '在途中', '派件中', '已签收', '派送失败'],
    host: 'https://ce.ilearnmore.net',
    cdnhost: 'http://img.ilearnmore.net',
    getLocalTime: function(nS) {
        var now = new Date(nS * 1000);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minute < 10) minute = "0" + minute;
        if (second < 10) second = "0" + second;
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    getTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000);
    },
    auth: function() {
        var wxapp = this;
        var _shopid = wxapp.shopid;
        var _openid = wx.getStorageSync('openid') || null;

        if (_openid) {
            return;
        }

        wx.login({
            success: function(res) {

                if (res.code) {

                    var _timestamp = wxapp.getTimeStamp();
                    var _params = JSON.stringify({ code: res.code, shopid: _shopid });
                    var _sign = md5.hex_md5(_timestamp + _params + wxapp.shopkey);

                    wx.request({
                        url: wxapp.host + '/buyerMobile/wxuser/index',
                        data: { shopid: wxapp.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        success: function(res) {
                            // console.info(res.data);
                            var openid = res.data.openid;
                            var session_key = res.data.session_key;

                            wx.setStorage({
                                key: "openid",
                                data: openid
                            });
                            wx.setStorage({
                                key: "session_key",
                                data: session_key
                            });

                            wx.getUserInfo({
                                success: function(res) {
                                    var inserted = wx.getStorageSync('inserted');
                                    if (inserted == 1) return;
                                    var _openid = wx.getStorageSync('openid');
                                    var _timestamp4 = wxapp.getTimeStamp();
                                    var _params4 = JSON.stringify({
                                        shopid: wxapp.shopid,
                                        openid: _openid,
                                        name: encodeURIComponent(res.userInfo.nickName),
                                        sex: res.userInfo.gender,
                                        faceurl: res.userInfo.avatarUrl,
                                        country: res.userInfo.country,
                                        province: res.userInfo.province,
                                        city: res.userInfo.city
                                    });

                                    var _sign4 = md5.hex_md5(_timestamp4 + _params4 + wxapp.shopkey);

                                    wx.request({
                                        url: wxapp.host + '/buyerMobile/wxuser/insertUserinfo',
                                        data: { shopid: wxapp.shopid, timestamp: _timestamp4, params: _params4, sign: _sign4 },
                                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                                        method: 'POST',
                                        complete: function(res) {
                                            // console.info(res);
                                            wx.setStorage({
                                                key: "inserted",
                                                data: 1
                                            });
                                        }
                                    });
                                },
                                fail: function(res) {
                                    wx.showModal({
                                        title: '温馨提示',
                                        content: '用户信息未授权，无法继续浏览，点击授权进行设置',
                                        cancelText: '取消',
                                        confirmText: '授权',
                                        success: function(res) {
                                            if (res.confirm) {
                                                wx.openSetting({
                                                    success: (res) => {}
                                                })
                                            } else if (res.cancel) {
                                                console.log('用户点击取消');
                                            }
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            },
            fail: function(res) {
                console.info('login fail ');
            }
        })
    }
});