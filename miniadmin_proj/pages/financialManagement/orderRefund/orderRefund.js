// 订单退款
var app = getApp();
Page({
    data: {
        userInfo:null,
    },
    onLoad: function(options) {
        let that = this;
        var userInfo = wx.getStorageSync('search_user_Info');
        that.setData({
            userInfo: userInfo,
        });
    }
})