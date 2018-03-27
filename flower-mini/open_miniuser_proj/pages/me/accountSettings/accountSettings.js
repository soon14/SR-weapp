// 账户设置
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        telphone: null,
        isbind: false,
        isshow: false,

        getUserTel: false, //是否有绑定手机号 默认false不显示获取手机号弹出框
    },
    onLoad: function(options) {

    },
    //授权设置
    openset: function() {
        wx.openSetting({
            success: (res) => {}
        })
    },
    onShow: function() {
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
                                        console.info(res);
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

                        let getUserTel = that.data.getUserTel;
                        if (parseInt(res.data.telphone) > 0) {
                            getUserTel = false;
                        } else {
                            getUserTel = true;
                        }
                        that.setData({
                            telphone: res.data.telphone,
                            isbind: bind,
                            isshow: true,
                            getUserTel
                        });
                    }

                }
            })
        }

    },
    //获取手机号
    getPhoneNumber: function(e) {
        let that = this;
        let session_key = wx.getStorageSync('session_key');
        let iv = e.detail.iv;
        let encryptedData = e.detail.encryptedData;
        let _openid = wx.getStorageSync('openid');

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            shopid: app.shopid,
            openid: _openid,
            sessionkey: session_key,
            iv: iv,
            encrypteddata: encryptedData,
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        // console.log(_params)
        wx.request({
            url: app.host + '/buyerMobile/wxuser/decodeData',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log(res)
                let info = res.data.info;
                if (res.data.suc == 1) {
                    that.setData({
                        telphone: info.purePhoneNumber,
                    })

                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '绑定成功',
                        success: function(res) {
                            // 将返回上页面
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    })


                }
                that.setData({
                    getUserTel: true
                })

            }
        })

    }
})