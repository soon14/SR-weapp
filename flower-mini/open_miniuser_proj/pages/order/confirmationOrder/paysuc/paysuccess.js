var md5 = require('../../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        id: null,
        totalprice: '0',
    },
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            promotionid: options.promotionid,
            orderid: options.orderid,
        })
        this.getdata(options.orderid);
    },
    // 获取页面信息
    getdata: function(oid) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        });
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ id: oid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/order/newGet',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res);
                wx.hideLoading();
                that.setData({
                    totalprice: res.data.trueprice
                });
            }
        })
    },
    //返回
    back: function() {
        var that = this;
        //店铺有立减金活动 去立减金页面
        if (that.data.promotionid > 0) {
            // console.log('-wx----wxpay1');
            wx.redirectTo({
                url: '/pages/me/sharingCoupons/sharingCoupons?promotionid=' + that.data.promotionid + '&orderid=' + that.data.orderid
            });
        } else {
            // console.log('-wx----wxpay2');
            wx.redirectTo({
                url: '/pages/me/orderdetails?id=' + that.data.orderid
            });
        }
        return;
    }
})