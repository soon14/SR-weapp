var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        toptext: "您还可以添加10个二维码，请谨慎使用",
        inputValue: ''
    },
    onLoad: function(options) {
        this.setData({
            toptext: "您还可以添加" + options.synum + "个二维码，请谨慎使用"
        })
    },
    //添加店铺二维码
    addQRrequest: function() {
        var that = this;
        var _inputValue = encodeURIComponent(that.data.inputValue);
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid, title: _inputValue };
        utils.ajaxRequest(
            'shopMobile/scene/createSceneCode',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 1500
                    });
                    // 将返回上页面
                    wx.navigateBack({
                        delta: 1
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            });
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

})