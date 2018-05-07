// 客户资料卡
var utils = require("../../../utils/util.js");
var app = getApp();
Page({
    data: {
        userInfo: null,
        telphone: null,
    },
    onLoad: function(options) {
        let that = this;
        let userInfo = wx.getStorageSync('search_user_Info');

        that.setData({
            userInfo: userInfo,
            telphone: userInfo.telphone
        });

    },
    onShow: function() {
        this.getdata();
    },
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _phone = that.data.telphone; //phone
        let params = { shopid: _shopid, phone: _phone };

        utils.ajaxRequest(
            'shopMobile/balance/getWxuserByTelForBalance',
            params,
            function(res) {

                if (res.data.status == 1) {

                    let userInfo = res.data.content;
                    userInfo.address = userInfo.province + userInfo.city; //用户地址

                    try {
                        wx.removeStorageSync('search_user_Info'); //清除 搜到的用户信息缓存
                        wx.setStorageSync('search_user_Info', userInfo); //设置 搜到的用户信息缓存
                    } catch (e) {
                        console.log(e);
                    }

                    that.setData({
                        userInfo: userInfo
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });
    },

})