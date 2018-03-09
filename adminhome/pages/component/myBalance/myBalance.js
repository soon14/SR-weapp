/**
 *  @author Shirui 2018/02/01
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        balance: '0',
    },
    onLoad: function(options) {
        // this.getdata();
    },
    onShow: function() {

    },
    // 获取初始数据
    getdata: function() {
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let params = { openid: _openid };

        util.ajaxRequest(
            'buyerMobile/balance/totalBalance',
            params,
            function(res) {
                if (res.data.status == 1) {
                    
                    that.setData({
                        balance: res.data.balance, //余额
                        recharge: res.data.recharge, //充值金额
                        reduce: res.data.reduce, //扣款金额
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
    },

})