/**
 * 使用优惠券
 * Created by SR on 2017/11/29.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        cdnhost:app.cdnhost,
        list: null, //记录列表
    },
    onLoad: function(options) {
        var that = this;
        var scene = decodeURIComponent(options.scene || '');
        if (scene == 'undefined' || scene == undefined || scene == null || scene == 'null' || scene == '') {
            scene = 0;
        }
        console.log('---options--couponsDetails--');
        console.log(options);
        that.setData({
            sceneid: scene || 0, //,默认，用户自己从付款菜单点进来付款
        });
        that.getdata();
    },
    // 优惠券信息，只展示
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _sceneid = that.data.sceneid;
        // _sceneid = 45;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ openid: _openid, promotion_id: _sceneid, shopid: app.shopid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        /*
        优惠券领取 buyerMobile/coupon/getCoupon
         */
        console.log('----优惠券领取');
        console.log(_params);
        wx.request({
            url: app.host + "/buyerMobile/coupon/ShowCoupon",
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                wx.hideLoading();
                console.log(res);
                that.setData({
                    couponinfo:res.data.info
                });

                if(res.data.suc == 0){
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
                }
                
            }
        });
    },
    goUrl: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    }

})