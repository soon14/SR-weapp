/**
 * 使用优惠券
 * Created by SR on 2017/11/29.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,
        list: null, //记录列表
    },
    onLoad: function(options) {
        var that = this;
        var _openid = wx.getStorageSync('openid') || '';
        var scene = decodeURIComponent(options.scene || '');
        if (scene == 'undefined' || scene == undefined || scene == null || scene == 'null' || scene == '') {
            scene = 0;
        }
        // console.log('---options--couponsDetails--');
        // console.log(options);
        that.setData({
            sceneid: scene || 0, //,默认，用户自己从付款菜单点进来付款
        });
        if (_openid.length > 0) {
            that.getdata();
        } else {
            that.auth();
        }

    },
    // 获取优惠券
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _sceneid = that.data.sceneid;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ openid: _openid, promotion_id: _sceneid, shopid: app.shopid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        // console.log('----优惠券领取');
        // console.log(_params);
        wx.request({
            url: app.host + "/buyerMobile/coupon/getCoupon",
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                wx.hideLoading();
                // console.log(res);
                that.setData({
                    couponinfo: res.data.info
                });

                if (res.data.suc == 1) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data.suc == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function() {
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    });
                } else {
                    //其他情况不提示 res.data.suc==2
                    return;
                }
            }
        });
    },
    goUrl: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    //登陆获取授权
    auth: function() {
        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ code: res.code, shopid: app.shopid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                    wx.request({
                        url: app.host + '/buyerMobile/wxuser/index',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        success: function(res) {
                            // console.info(_params);
                            // console.info(res.data);
                            
                            var openid = res.data.openid;
                            var session_key = res.data.session_key;

                            wx.setStorageSync('openid',openid);
                            wx.setStorageSync('session_key',session_key);
                            that.setData({
                                openid: openid,
                            })

                            wx.getUserInfo({
                                success: function(res) {

                                    that.setData({
                                        name: res.userInfo.nickName,
                                        sex: res.userInfo.gender,
                                        faceurl: res.userInfo.avatarUrl,
                                        country: res.userInfo.country,
                                        province: res.userInfo.province,
                                        city: res.userInfo.city
                                    })

                                    var _timestamp1 = app.getTimeStamp();
                                    var _params1 = JSON.stringify({
                                        shopid: app.shopid,
                                        openid: openid,
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
                                            wx.setStorageSync('openid',openid);
                                            that.getdata();
                                        }
                                    });

                                    that.getdata();

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

})