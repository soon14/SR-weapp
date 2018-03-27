var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        id: null,
        totalprice: '0',
    },
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            id: options.id
        })
        this.getdata();
    },
    // 获取页面信息
    getdata: function() {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        });
        var _id = encodeURIComponent(that.data.id);
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ id: _id });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/orderBank/GetDirectPayOne',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.suc == 1) {
                    that.setData({
                        totalprice: res.data.info.totalprice
                    });
                } else {
                    console.log(res.data.msg)
                }

            }
        })
    },
    //返回
    back: function() {
        // wx.navigateBack({
        //     delta: 1
        // });
        wx.switchTab({
            url: '/pages/me/me'
        })
    }
})