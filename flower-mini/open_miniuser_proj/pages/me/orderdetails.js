var md5 = require('../../utils/md5.js');
var app = getApp();
Page({

    data: {
        item: null,
        markers: [{
            id: 0,
            latitude: null,
            longitude: null,
        }],
        id: 0,
        orderstatetitle: '',
        orderaddtimestr: '',
        paytimestr: '',
        accepttimestr: '',
        sendtimestr: '',
        delivery: '',
        orderstatus: '',
        totalprice: ''
    },

    onLoad: function(e) {
        var _id = e.id;

        this.sd_getdata(_id);
        this.setData({
            orderstatetitle: app.orderstatetitle,
            id: _id
        });

    },

    onPullDownRefresh: function() {
        var _id = this.data.id;
        this.sd_getdata(_id);
        wx.stopPullDownRefresh();
    },
    sd_getdata: function(_id) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        var that = this;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ id: _id });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/order/newGet',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res);
                wx.hideToast();
                var data = res.data;
                data.proinfo.mainpic = app.cdnhost + data.proinfo.mainpic;
                var status = '';
                if (data.state == 1) status = '正在等待商家接单';
                else if (data.state == 2 && data.state2 == 0) status = '花店已接单，正在等待制作';
                else if (data.state == 2 && data.state2 == 1) status = '花店已制作完成，待配送';
                else if (data.state == 3) status = '还有1天2小时自动确认';

                var markers = that.data.markers;
                markers[0].latitude = data.proinfo.latitude;
                markers[0].longitude = data.proinfo.longitude;
                that.setData({
                    item: data,
                    orderaddtimestr: app.getLocalTime(data.addtime),
                    paytimestr: app.getLocalTime(data.paytime),
                    accepttimestr: app.getLocalTime(data.accepttime),
                    sendtimestr: app.getLocalTime(data.sendtime),
                    delivery: app.deliverys[data.deliverytype],
                    orderstatus: status,
                    totalprice: data.totalprice,
                    sharecouponid: data.sharecouponid,
                    markers: markers
                });
            }
        });
    },
    cancelorder: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要取消订单？',
            success: function(res) {
                if (res.confirm) {

                    var _openid = wx.getStorageSync('openid');
                    var _shopid = app.shopid;
                    var _id = that.data.id;

                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ id: _id, shopid: _shopid, openid: _openid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                    wx.request({
                        url: app.host + '/buyerMobile/order/cancelOrderNew',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        complete: function(res) {
                            if(res.data.suc == 1){
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function() {
                                        wx.redirectTo({
                                            url: '/pages/me/orderdetails?id=' + _id
                                        });
                                    }
                                });
                            }else{
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function() {}
                                });
                            }
                            
                        }
                    })
                }
            }
        })
    },
    confirmorder: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定已经收到货？',
            success: function(res) {
                if (res.confirm) {

                    var _openid = wx.getStorageSync('openid');
                    var _shopid = app.shopid;
                    var _id = that.data.id;
                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ id: _id, shopid: _shopid, openid: _openid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                    wx.request({
                        url: app.host + '/buyerMobile/order/confirmOrder',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        complete: function(res) {
                            wx.redirectTo({
                                url: '/pages/me/orderdetails?id=' + _id
                            });
                        }
                    })
                }
            }
        })
    },
    pay: function() {
        var that = this;
        var _orderid = that.data.id;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ orderid: _orderid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/order/orderPay',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log('------单发发起支付');
                // console.log(res);
                var _prepayid = res.data.package;
                wx.requestPayment({
                    timeStamp: res.data.timeStamp + '',
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    'success': function(res2) {

                        var _timestamp1 = app.getTimeStamp();
                        var _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
                        var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);

                        wx.request({
                            url: app.host + '/buyerMobile/order/ordersuc',
                            data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            method: 'POST',
                            complete: function(res3) {
                                // wx.redirectTo({
                                //     url: '/pages/order/confirmationOrder/paysuc/paysuccess?promotionid=' + that.data.sharecouponid + '&orderid=' + _orderid
                                // });
                                // //店铺有立减金活动 去立减金页面
                                if (that.data.sharecouponid > 0) {
                                    // console.log('-wx----wxpay1');
                                    wx.redirectTo({
                                        url: '/pages/me/sharingCoupons/sharingCoupons?promotionid=' + that.data.sharecouponid + '&orderid=' + _orderid
                                    });
                                } else {
                                    // console.log('-wx----wxpay2');
                                    wx.redirectTo({
                                        url: '/pages/me/orderdetails?id=' + _orderid
                                    });
                                }
                                // return;
                            }
                        })
                    },
                    'fail': function(res) {
                        console.info("fail");
                        console.info(res);
                    }

                })
            }
        })
    },

    copyno: function(e) {
        var num = e.target.dataset.no;
        wx.setClipboardData({
            data: num,
            success: function(res) {
                wx.showToast({
                    title: '订单号已复制成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
    markertap: function(e) {
        var that = this;
        wx.openLocation({
            latitude: parseFloat(that.data.item.proinfo.latitude),
            longitude: parseFloat(that.data.item.proinfo.longitude),
            name: that.data.item.name,
            address: that.data.item.address,
            scale: 18
        })
    },
})