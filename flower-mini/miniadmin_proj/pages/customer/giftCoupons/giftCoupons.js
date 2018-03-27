/**
 *  @author Shirui 2018/01/30
 *  37780012@qq.com
 */
const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        host: app.cdnhost,
        list: null,
    },
    onLoad: function(options) {
        let that = this;
        let _openid = options.openid;
        let _shopid = wx.getStorageSync('shopid');

        that.setData({
            openid: _openid,
            shopid: _shopid
        });

        that.getdata();
    },
    onShow: function() {

    },
    //初始数据
    getdata: function() {
        /**
         * 卖家版-店铺可赠送优惠券列表 
         * shopMobile/coupon/getList 
         * 参数
         * {shopid:204}
         */
        let that = this;
        let _shopid = that.data.shopid;
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/coupon/getList',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list: res.data.content
                    })
                } else {
                    console.log(res.data.msg)
                }
            });
    },
    // 赠送优惠券
    gift(e) {
        /**
         * 卖家版 手动赠送优惠券
         * shopMobile/coupon/addCouponToWxuser 
         * 参数-用户openid,店铺优惠券couponid,操作管理员msession
         */
        let that = this;
        let _couponid = e.currentTarget.dataset.id;
        let _openid = that.data.openid;
        let _msession = wx.getStorageSync('msession');
        let params = { openid: _openid, couponid: _couponid, msession: _msession };

        utils.ajaxRequest(
            'shopMobile/coupon/addCouponToWxuser',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000,
                        success:function(){
                          setTimeout(
                            function () {
                              wx.hideToast();
                              wx.navigateBack({
                                delta: 1
                              })
                            }, 1500)
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
            });
    }

});