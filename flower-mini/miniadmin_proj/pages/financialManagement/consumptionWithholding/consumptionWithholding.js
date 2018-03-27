// 消费代扣
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        userInfo: null
    },
    onLoad: function(options) {
        let that = this;
        var userInfo = wx.getStorageSync('search_user_Info');
        that.setData({
            userInfo: userInfo,
        });
    },
    // 搜索栏
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        // console.log(e.detail.value);
        this.setData({
            inputVal: e.detail.value
        });
    },
    // 输入金额
    search: function() {

        var that = this;
        var _openid = that.data.userInfo.openid;
        var _msession = wx.getStorageSync('msession');
        var _shopid = wx.getStorageSync('shopid');
        var _money = that.data.inputVal;
        var _timestamp = app.getTimeStamp();
        var params = { shopid: _shopid, openid: _openid, msession: _msession, money: _money };

        /*
        财务管理-消费代扣 shopMobile/balance/deduct
        参数money,shopid,openid,msession
         */

        utils.ajaxRequest(
            'shopMobile/balance/deduct',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });

    }
})