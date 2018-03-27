/**
 * 分享优惠券
 * Created by SR on 2017/11/29.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        scene: null,
        cdnhost: app.cdnhost,
    },
    onLoad: function(options) {
        var that = this;
        var promotionid = decodeURIComponent(options.promotionid || '');
        if (promotionid == 'undefined' || promotionid == undefined || promotionid == null || promotionid == 'null' || promotionid == '') {
            promotionid = 0;
        }
        var orderid = decodeURIComponent(options.orderid || '');
        if (orderid == 'undefined' || orderid == undefined || orderid == null || orderid == 'null' || orderid == '') {
            orderid = 0;
        }
        that.setData({
            _promotionid: promotionid,//立减金活动id
            _orderid:orderid//订单id
        });

        that.getdata();
    },
    // 获取数据
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _promotionid = that.data._promotionid;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ promotionid: _promotionid, openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        /*
        立减金活动信息页面 buyerMobile/shareCoupon/shareCouponInfo
         */
        console.log('---立减金活动页面参数--');
        console.log(_params);
        console.log(_promotionid);
        wx.request({
            url: app.host + "/buyerMobile/shareCoupon/shareCouponInfo",
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log('立减金活动');
                console.log(res);
                wx.hideLoading();
                if (res.data.suc == 0) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                    return;
                }

                that.setData({
                    mysharecoupon: res.data.info,
                    scene: res.data.info.promotion_id,//立减金活动id
                    coupon_promotion_id: res.data.info.coupon_promotion_id,//立减金关联的优惠券
                    shareuserinfo: res.data.info.shareuserinfo,//立减金分享人信息
                });
                console.log(that.data);
            }
        });
    },
    onShareAppMessage: function(res) {
        let scene = this.data.scene;//立减金活动
        let _orderid = this.data._orderid;
        var couponid = this.data.coupon_promotion_id;
        var _openid = wx.getStorageSync('openid');
        var shareid = _openid//分享人openid
        var _shareuserinfo = this.data.shareuserinfo;
        wx.showShareMenu({
          withShareTicket: true
        })

        return {
          title: this.data.shareuserinfo.name+'发给你一张优惠券邀请你来领',
          path: '/pages/me/getCoupons/getCoupons?scene=' + scene+'&shareid='+shareid+'&orderid='+_orderid,
          success: function(res) {
            // 转发成功
            console.log('---转发成功');

            console.log('转发出去页面携带的scene----' + scene);
            console.log('转发出去页面携带的分享人openid----' + shareid);
            console.log('转发出去页面携带的orderid----' + _orderid);
// return;
            //立减金活动人分享之后自动领取优惠券
            var that = this;
            var _openid = wx.getStorageSync('openid');
            var _timestamp = app.getTimeStamp();
            var _params = JSON.stringify({ openid: _openid, promotion_id: couponid, shopid: app.shopid,orderid:_orderid,isshare:1,scene:scene });
            var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

            console.log('----优惠券领取');
            console.log(_params);
            wx.request({
                url: app.host + "/buyerMobile/coupon/getCoupon",
                data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                method: 'POST',
                complete: function(res) {
                    wx.hideLoading();
                    console.log(res);
                }
            });
// return;
            wx.redirectTo({
                url: '/pages/me/orderdetails?id=' + _orderid
            })
          },
          fail: function(res) {
            // 转发失败
            // console.log(res);
          }
        }
    }

})