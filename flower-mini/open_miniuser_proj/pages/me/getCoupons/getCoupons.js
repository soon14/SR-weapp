/**
 * 领取优惠券
 * Created by SR on 2017/11/29.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        list: null, //数据列表
        cdnhost: app.cdnhost,
        hasget: 0
    },
    onLoad: function(options) {
        var that = this;
        var _openid = wx.getStorageSync('openid') || '';
        var scene = decodeURIComponent(options.scene || '');
        var shareid = decodeURIComponent(options.shareid || '');
        var orderid = decodeURIComponent(options.orderid || '');
        if (scene == 'undefined' || scene == undefined || scene == null || scene == 'null' || scene == '') {
            scene = 0;
        }
        if (shareid == 'undefined' || shareid == undefined || shareid == null || shareid == 'null' || shareid == '') {
            shareid = '';
        }
        if (orderid == 'undefined' || orderid == undefined || orderid == null || orderid == 'null' || orderid == '') {
            orderid = '';
        }
        // console.log('---options--getCoupons----');
        // console.log(options);
        that.setData({
            sceneid: scene || 0, //,默认
            shareid: shareid || '',
            orderid: orderid || '',
        });

        // console.log('----that.data---');
        // console.log(that.data);
        that.auth();
    },
    // 获取数据
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _sceneid = that.data.sceneid;
        var _shareid = that.data.shareid;
        var _timestamp = app.getTimeStamp();
        var orderid = that.data.orderid;
        var _params = JSON.stringify({
            openid: _openid,
            promotion_id: _sceneid,
            shopid: app.shopid,
            shareid: _shareid,
            orderid: orderid,
        });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        // console.log('----优惠券领取');
        // console.log(_params);
        wx.request({
            url: app.host + "/buyerMobile/shareCoupon/shareCouponAccept2",
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                wx.hideLoading();
                // console.log(res);
                if (res.data.suc == 0) {
                    that.setData({
                        list: res.data.info,
                        hasget: 0, //未领取
                    })
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function() {
                            that.goUrl();
                        }
                    });
                } else if (res.data.suc == 1) {
                    that.setData({
                        list: res.data.info,
                        hasget: 1, //已领取
                    })
                } else if (res.data.suc == 2) {
                    that.setData({
                        list: res.data.info,
                        hasget: 2, //已过期
                    })
                } else if (res.data.suc == 3) {
                    that.setData({
                        list: res.data.info,
                        hasget: 0, //已领完
                    })
                }else if (res.data.suc == 4){
                    that.setData({
                        list: res.data.info,
                        hasget: 3, //已领完
                    })
                }

                // console.log('是否已领取'+that.data.hasget);
            }
        });
    },
    //使用
    goUrl: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    onShareAppMessage: function(res) {
        var that = this;
        let scene = that.data.sceneid; //立减金活动
        var couponid = that.data.coupon_promotion_id;
        var _openid = wx.getStorageSync('openid');
        var _shareid = that.data.shareid;
        var shareid = _shareid //分享人openid 取这份立减金原分享人的id
        var orderid = that.data.orderid;

        // console.log('-----右上角转发');
        // console.log(scene);
        // console.log(_openid);
        // console.log(shareid);
        // console.log(that.data.list.userinfo.name);

        wx.showShareMenu({
            withShareTicket: true
        })

        return {
            title:that.data.list.shareuserinfo.name+'发给你一张优惠券邀请你来领',
            path: '/pages/me/getCoupons/getCoupons?scene=' + scene + '&shareid=' + shareid + '&orderid=' + orderid,
            success: function(res) {
                // console.log('转发别人的优惠券');
                // console.log(res);
            },
            fail: function(res) {
                // 转发失败
                // console.log(res);
            }
        }
    },
    //授权设置
    openset: function() {
        wx.openSetting({
            success: (res) => {
                console.log(res);
            }
        })
    },
    //登陆获取授权 并收集用户信息
    auth: function() {
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

                    if (res.data == false) {
                        wx.getUserInfo({
                            success: function(res) {
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
                                        wx.setStorageSync('openid',_openid);
                                        that.getdata();

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
                                    content: '用户信息未授权，无法继续，点击授权进行设置',
                                    cancelText: '取消',
                                    confirmText: '授权',
                                    success: function(res) {
                                        if (res.confirm) {
                                            that.openset();
                                            that.getdata();
                                        } else if (res.cancel) {
                                            console.log('用户点击取消');
                                        }
                                    }
                                })
                            }
                        });
                    } else {
                        that.getdata();
                    }

                }
            })
        }else{
            that.getdata();
        }
    }

})