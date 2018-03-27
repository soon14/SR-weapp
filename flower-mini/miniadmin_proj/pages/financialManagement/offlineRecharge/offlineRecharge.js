// 线下充值
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
        let inputVal = e.detail.value;
        inputVal = inputVal.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
        
        this.setData({
            inputVal: inputVal
        });
    },
    // 输入金额
    search: function() {

        var that = this;
        var _openid = that.data.userInfo.openid;
        var _msession = wx.getStorageSync('msession');
        var _shopid = wx.getStorageSync('shopid');
        var _money = that.data.inputVal;
        var params = { shopid: _shopid, openid: _openid, msession: _msession, money: _money };
        /*
        财务管理-线下充值 shopMobile/balance/recharge
        参数 money,shopid,openid,msession
         */
        utils.ajaxRequest(
            'shopMobile/balance/recharge',
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