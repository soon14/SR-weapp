/**
 * 我的优惠券
 * Created by SR on 2017/11/29.
 * 37780012@qq.com
 */
var md5 = require('../../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        list: null, //数据列表
    },
    onShow: function(options) {
        let that = this;
        that.getdata();
    },
    // 获取数据
    getdata: function() {
        /*
        可用优惠券列表接口 buyerMobile/coupon/getValidCoupons
        参数 product_id(商品id),openid,total_money(总价),shopid
        */
        let that = this;
        let _proid = app.payinfodata.productid;
        let total_money = parseFloat(app.payinfodata.productprice*app.payinfodata.productnum).toFixed(2); //总价
        let _shopid = app.shopid;
        let _openid = wx.getStorageSync('openid');

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            openid: _openid,
            shopid: _shopid,
            product_id: _proid,
            total_money: total_money
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/coupon/getValidCoupons',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log('商品可用优惠券');
                console.log(total_money);
                console.log(_params);
                console.log(res)

                that.setData({
                    list: res.data.data
                });
            }
        });
    },
    //用户选择的优惠券
    chooseMyCoupon:function(e){
        var _couponid = e.currentTarget.dataset.id;
        var promotion_id = e.currentTarget.dataset.promotion_id;
        app.payinfodata.couponid = _couponid;
        app.payinfodata.promotion_id = promotion_id;
        wx.navigateBack({
            dleta:1
        });
    }

})