var md5 = require('../../utils/md5.js');
//获取应用实例
var app = getApp();
Page({

    data: {
        isbind: false,
        avatarUrl: '',
        nickName: '',
        isshow: false,
        faceurl: '',
        ordertimes: '0', //订单数
        balance: '0', //余额
        coupontimes: '0', //优惠券

        backgroundImage: '/images/mebackground.png', //背景图
    },
    onShow: function() {
        this.get();
        this.getBaseInfo();
    },
    onLoad: function() {
        this.getdata();
    },
    getdata: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 20000
        });
        var that = this;
        var _shopid = app.shopid;
        wx.login({
            success: function(res) {

                if (res.code) {

                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ code: res.code, shopid: _shopid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                    wx.request({
                        url: app.host + '/buyerMobile/wxuser/index',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        success: function(res) {
                            // console.info(res.data);
                            that.setData({
                                isshow: true
                            });
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

                            var _timestamp = app.getTimeStamp();
                            var _params = JSON.stringify({ openid: openid });
                            var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                            wx.request({
                                url: app.host + '/buyerMobile/wxuser/get',
                                data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                                header: { "Content-Type": "application/x-www-form-urlencoded" },
                                method: 'POST',
                                success: function(res) {

                                    if (res.data.telphone != null && res.data.telphone != '') {
                                        that.setData({
                                            isbind: true
                                        });
                                    }
                                }
                            })
                            wx.getUserInfo({
                                success: function(res) {
                                    wx.hideToast();
                                    that.setData({

                                        avatarUrl: res.userInfo.avatarUrl,
                                        nickName: res.userInfo.nickName
                                    });

                                    var inserted = wx.getStorageSync('inserted');
                                    if (inserted == 1) return;
                                    var _openid = wx.getStorageSync('openid');
                                    var _timestamp4 = app.getTimeStamp();
                                    var _params4 = JSON.stringify({
                                        shopid: app.shopid,
                                        openid: _openid,
                                        name: encodeURIComponent(res.userInfo.nickName),
                                        sex: res.userInfo.gender,
                                        faceurl: res.userInfo.avatarUrl,
                                        country: res.userInfo.country,
                                        province: res.userInfo.province,
                                        city: res.userInfo.city
                                    });

                                    var _sign4 = md5.hex_md5(_timestamp4 + _params4 + app.shopkey);

                                    wx.request({
                                        url: app.host + '/buyerMobile/wxuser/insertUserinfo',
                                        data: { shopid: app.shopid, timestamp: _timestamp4, params: _params4, sign: _sign4 },
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
                                    that.setData({
                                        avatarUrl: '/images/face.png',
                                        nickName: '未授权用户'
                                    });
                                    wx.hideToast();
                                    wx.showModal({
                                        title: '温馨提示',
                                        content: '用户信息未授权，无法继续浏览，点击授权进行设置',
                                        cancelText: '取消',
                                        confirmText: '授权',
                                        success: function(res) {
                                            if (res.confirm) {
                                                that.openset();
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
    },
    get: function() {
        var _openid = wx.getStorageSync('openid');
        var that = this;
        if (_openid != null && _openid != '') {

            var _timestamp0 = app.getTimeStamp();
            var _params0 = JSON.stringify({ openid: _openid });
            var _sign0 = md5.hex_md5(_timestamp0 + _params0 + app.shopkey);

            wx.request({
                url: app.host + '/buyerMobile/wxuser/get',
                data: { shopid: app.shopid, timestamp: _timestamp0, params: _params0, sign: _sign0 },
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                method: 'POST',
                success: function(res) {
                    // console.log(res)
                    if (res.data == false) {
                        wx.getUserInfo({
                            success: function(res) {
                                that.setData({
                                    avatarUrl: res.userInfo.avatarUrl,
                                    nickName: res.userInfo.nickName
                                });

                                var _timestamp1 = app.getTimeStamp();
                                var _params1 = JSON.stringify({
                                    shopid: app.shopid,
                                    openid: _openid,
                                    name: encodeURIComponent(res.userInfo.nickName),
                                    sex: res.userInfo.gender,
                                    faceurl: res.userInfo.avatarUrl,
                                    country: res.userInfo.country,
                                    province: res.userInfo.province,
                                    city: res.userInfo.city
                                });

                                var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);

                                wx.request({
                                    url: app.host + '/buyerMobile/wxuser/insertUserinfo',
                                    data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
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
                                that.setData({
                                    avatarUrl: '/images/face.png',
                                    nickName: '未授权用户'
                                });

                                wx.showModal({
                                    title: '温馨提示',
                                    content: '用户信息未授权，无法继续浏览，点击授权进行设置',
                                    cancelText: '取消',
                                    confirmText: '授权',
                                    success: function(res) {
                                        if (res.confirm) {
                                            that.openset();
                                        } else if (res.cancel) {
                                            console.log('用户点击取消');
                                        }
                                    }
                                })
                            }
                        });
                    } else {
                        var bind = false;
                        if (res.data.telphone != null && res.data.telphone != '') {
                            bind = true;
                        }
                        that.setData({
                            isbind: bind,
                            isshow: true
                        });
                    }

                }
            })
        }
    },
    getBaseInfo: function() {
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            shopid: app.shopid,
            openid: _openid,
        });

        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/wxuser/getBaseInfo',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log('me');
                // console.log(_params);
                // console.log(res);
                if (res.data.suc = 1) {
                    let info = res.data.info;
                    that.setData({
                        faceurl: info.faceurl,
                        ordertimes: info.ordertimes,
                        balance: info.balance,
                        coupontimes: info.coupontimes,
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            }
        });
    },
    //授权设置
    openset: function() {
        wx.openSetting({
            success: (res) => {}
        })
    },
    //我的优惠券
    goMyCoupons: function() {
        let coupontimes = this.data.coupontimes;

        if (parseInt(coupontimes) > 0) {
            wx.navigateTo({
                url: '/pages/me/myCoupons/myCoupons'
            })
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '您还没有优惠券',
                success: function(res) {}
            })
        }
    }

})