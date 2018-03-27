/**
 *  @author Shirui 2018/02/28
 *  37780012@qq.com
 */
// 领取优惠券
const md5 = require('../../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        newcolors: [],
    },
    onLoad: function() {
        this.getBaseInfo();
    },
    getBaseInfo: function() {
        /**
         * 首页的一些基本信息
         * buyerMobile/index/getBaseInfo
         * 参数{openid:'xxxx',shopid:204}
         */
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ openid: _openid, shopid: app.shopid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/index/getBaseInfo',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                console.log(res);
                if (res.data.suc == 1) {
                    let couponlist = res.data.content.couponlist;

                    that.setData({
                        couponlist: couponlist,
                        recharge: res.data.content.recharge,
                    })
                } else {
                    console.log(res.data.msg)
                }
            }
        });
    },
    saveCoupon: function(e) {
        /**
         * 首页快捷领取优惠券
         * buyerMobile/index/saveCoupon
         * 参数
         * 流程:领取成功之后跳转到单张优惠券页面/pages/me/showCoupon/showCoupon?scene= {{promotionid}}
         */
        let that = this;
        let promotionid = e.currentTarget.dataset.id;;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ openid: _openid, promotionid: promotionid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/index/saveCoupon',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(_params);
                // console.log(res);
                if (res.data.suc == 1) {
                    wx.showToast({
                        title: '领取成功',
                        icon: 'success',
                        duration: 1000,
                        success: function() {
                            that.getBaseInfo();
                        }
                    })

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
})