/**
 * Created by SR on 2017/11/09.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        balance: '0',
    },
    onLoad: function(options) {
        this.getdata();
    },
    onShow: function() {

    },
    // 获取初始数据
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        /**用户余额 buyerMobile/balance/totalBalance
          参数 shopid openid
        */
        wx.request({
            url: app.host + '/buyerMobile/balance/totalBalance',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log('余额');
                // console.log(_params);
                // console.log(res);
                wx.hideLoading();
                that.setData({
                    balance: res.data.balance, //余额
                    recharge: res.data.recharge, //充值金额
                    reduce: res.data.reduce, //扣款金额
                });

            }
        })
    },

})