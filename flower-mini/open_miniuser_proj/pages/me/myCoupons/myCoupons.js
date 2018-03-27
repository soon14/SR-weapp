/**
 * 我的优惠券
 * Created by SR on 2017/11/29.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        page: 1,
        limit: 15, //(每页多少条记录)
        totalPage: 1, //最大页数
        list: null, //数据列表
        invalidlist: null, //无效优惠券列表
        validlist: null, //可用优惠券列表
    },
    onLoad: function(options) {
        var that = this;
        that.getdata();
    },
    // 获取数据
    getdata: function() {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ openid: _openid, shopid: app.shopid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        /*
        优惠券列表 buyerMobile/coupon/couponList
         */
        wx.request({
            url: app.host + "/buyerMobile/coupon/couponList",
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log('我的优惠券');
                console.log(res);
                wx.hideLoading();
                let _list = [];
                let _page = that.data.page;

                if (_page > 1) {
                    _list = that.data.list.concat(res.data.list);
                } else if (_page == 1) {
                    _list = res.data.data
                }

                // console.log(_list);
                if (res.data.suc == 1) {
                    that.setData({
                        list: _list,
                        invalidlist: _list.invalidlist, //无效优惠券列表
                        validlist: _list.validlist, //可用优惠券列表
                        totalPage: res.data.totalPage,
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }

            }
        });
    },
    //下拉刷新
    onPullDownRefresh: function() {
        let that = this;

        wx.showNavigationBarLoading(); //在标题栏中显示加载

        that.setData({
            page: 1,
        });

        //模拟加载
        setTimeout(function() {
            that.getdata();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    //加载更多
    onReachBottom: function() {
        let that = this;
        let _page = that.data.page + 1;

        if (_page > that.data.totalPage) {

            wx.showLoading({
                title: '没有更多数据',
            });

            setTimeout(function() {
                wx.hideLoading()
            }, 800);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getdata();
        }

    },

})