/**
 *  @author Shirui 2018/01/30
 *  37780012@qq.com
 */
const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        host: app.cdnhost,
        openid: null,
        list: null
    },
    onLoad: function(options) {
        let that = this;
        let _openid = options.openid;

        if (_openid.length > 0) {
            that.setData({
                openid: _openid
            });
        }

    },
    onShow: function() {

        this.getdata();

    },
    //初始数据
    getdata: function() {
        /**
         * 卖家版 客户优惠券列表
         * shopMobile/coupon/getCouponListByWxuser
         * 参数
         * {shopid:204,openid:'o7fYO0ZKlccvKbKYpQ6_GXyeXtz4'}
         */
        let that = this;
        let _openid = that.data.openid;
        let _shopid = wx.getStorageSync('shopid');
        let params = { openid: _openid, shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/coupon/getCouponListByWxuser',
            params,
            function(res) {
                if (res.data.status == 1) {
                    try {

                        that.setData({
                            list: res.data.content.validlist
                        })

                    } catch (e) {
                        console.log(e)
                    }

                } else {
                    console.log(res.data.msg)
                }

            });
    },
    // 赠送优惠券
    gouGift() {
        let _openid = this.data.openid;
        wx.navigateTo({
            url: '/pages/customer/giftCoupons/giftCoupons?openid=' + _openid
        })
    }

});