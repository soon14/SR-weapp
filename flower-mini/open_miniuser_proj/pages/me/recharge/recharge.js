/**
 * Created by SR on 2017/11/09.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        checkedmoney: '0', //选中的充值金额 默认第一个
        gift_money: '0', //赠送金额
        max_money: '0',
        // 优惠列表
        list: null,
        // 底部说明
        explainTitle: { title: "当前活动：", text: "" },

        telphone: null,
    },
    onLoad: function(options) {

        this.getUserTel();
        this.getdata();
    },
    onShow: function() {

    },
    // 查看手机号是否绑定
    getUserTel: function() {
        /*
        buyerMobile/wxuser/getUserTel,
        查看手机号是否绑定
        参数openid
         */
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/wxuser/getUserTel',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log(res);
                if (res.data.suc == 1) {
                    that.setData({
                        telphone: res.data.info
                    })

                } else {
                    console.log(res.data.msg)
                }
            }
        });
    },
    // 选中的充值金额
    radioChange: function(e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value);
        let that = this;
        let checkedmoney = e.detail.value;
        that.setData({
            checkedmoney: checkedmoney,
        });
    },
    // 选中的赠送金额
    radioChange1: function(e) {
        let that = this;
        let gift_money = e.target.dataset.giftmoney;
        that.setData({
            gift_money: gift_money,
        });
    },
    // 立即充值
    recharge: function() {

        var that = this;
        let telphone = that.data.telphone;
        if (telphone.length < 11) {
            wx.showModal({
                title: '提示',
                confirmText: '确定',
                content: '需要先绑定手机号才能进行充值',
                showCancel: false,
                success: function(res) {
                    wx.redirectTo({
                        url: '/pages/me/accountSettings/accountSettings'
                    })
                }
            });
            return;
        }
        var checkedmoney = that.data.checkedmoney; //充值金额
        var checked_gift_money = that.data.gift_money; //赠送金额
        var promotion_id = that.data.promotion_id; //活动ID
        var _openid = wx.getStorageSync('openid');
        var _shopid = wx.getStorageSync('shopid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: _shopid, openid: _openid, money: checkedmoney, gift_money: checked_gift_money, promotion_id: promotion_id });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        // console.info(_params);
        wx.request({
            url: app.host + '/buyerMobile/orderBank/rechargeAdd',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',

            complete: function(res) {
                wx.hideLoading();
                console.log(res);
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
                        'success': function(res2) {
                            console.info(res2);
                            var _timestamp1 = app.getTimeStamp();
                            var _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
                            var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);
                            wx.request({
                                url: app.host + '/buyerMobile/orderBank/rechargeSuc',
                                data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                                header: { "Content-Type": "application/x-www-form-urlencoded" },
                                method: 'POST',
                                success: function(res3) {
                                    console.log(res3);
                                    if (res3.data.suc == 1) {
                                        wx.showToast({
                                            title: '充值成功',
                                            icon: 'success',
                                            duration: 1500
                                        })
                                        //跳转我的余额页面
                                        setTimeout(function() {
                                            wx.navigateTo({
                                                url: '/pages/me/myBalance/myBalance'
                                            })
                                        }, 1200);
                                    } else {
                                        // console.log(res3);
                                        wx.showModal({
                                            title: '提示',
                                            confirmText: '确定',
                                            content: res3.data.msg,
                                            showCancel: false,
                                            success: function(res) {}
                                        });
                                        return;
                                    }
                                },
                                fail: function(reserr) {
                                    console.info(reserr);
                                }
                            })

                        },
                        'fail': function(res4) {

                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {

                        }
                    });
                    return;
                }

            }
        });
    },
    // 获取初始数据
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = that.data.openid;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: app.shopid, openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        console.log(_params);
        wx.request({
            url: app.host + '/buyerMobile/recharge/view',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.suc == 1) {

                    let explainText = that.data.explainText;
                    let explainTitle = that.data.explainTitle;
                    let checkedmoney = that.data.checkedmoney;
                    let gift_money = that.data.gift_money;
                    let max_money = that.data.max_money;
                    let list = res.data.data.list; //优惠列表

                    max_money = res.data.data.max_money; //最大限制金额
                    explainTitle.text = res.data.data.title; //活动标题

                    for (var i = 0; i < list.length; i++) {
                        checkedmoney = list[0].money;
                        gift_money = list[0].gift_money;

                        var m_allmoney = list[i].money * 1 + list[i].gift_money * 1;
                        m_allmoney = m_allmoney.toFixed(2);
                        list[i].allmoney = m_allmoney;
                    }

                    that.setData({
                        explainText: explainText,
                        explainTitle: explainTitle,
                        checkedmoney: checkedmoney,
                        gift_money: gift_money,
                        list: list, //优惠列表
                        promotion_id: res.data.data.promotion_id, //活动ID
                        max_money: max_money,
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        confirmText: '确定',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                    return;
                }

            }
        })
    },
    // 到账金额如果没有小数位，加两位 .00
    twoDecimal: function(number) {
        var index = number.indexOf(".");
        if (index == -1) {
            number = number + '.00';
        }
        return number;
    },
    //登陆获取授权
    auth: function() {
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
                            console.info(res.data);
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