/**
 * more
 * Created by SR on 2017/9/25.
 * 37780012@qq.com
 */
var utils = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        shopname: null,

        userinfo: null, //用户信息
        shopinfo: null, //店铺信息

        isMainManager: false, //是否是主管理员 默认false

    },
    onLoad: function(options) {},
    onShow: function() {
        let _shopname = wx.getStorageSync('shopname');
        this.setData({
            shopname: _shopname
        });
        this.refresh();
        this.getdata();
    },
    /**
     * shopMobile/shopadmin/getMemberInfo,
     * 参数 msession shopid
     */
    getdata: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _shopid = wx.getStorageSync('shopid');
        let params = { msession: _msession, shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/shopadmin/getMemberInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        userinfo: res.data.content.info,
                        shopinfo: res.data.content.shop
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            app.auth();
                        }
                    })
                }
            });
    },
    /**
     * [refresh 请求数据]
     * 是否店铺主管理员
     * mobile/shopadmin/isMainManager
     * 参数 shopid,msession
     */
    refresh: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid, msession: _msession };

        utils.ajaxRequest(
            'shopMobile/shopadmin/isMainManager',
            params,
            function(res) {
                if (res.data.status == 1) {
                    //是主管理员
                    that.setData({
                        isMainManager: true
                    });
                } else {
                    that.setData({
                        isMainManager: false
                    });
                }

                // console.info("是否店铺主管理员", that.data.isMainManager);
            });
    },
    openset: function() {
        wx.openSetting({
            success: (res) => {
                /*
                 * res = {
                 *   "scope.userInfo": true,
                 *   "scope.userLocation": true
                 * }
                 */
            }
        })
    },

})