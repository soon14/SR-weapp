var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: null,
        selex: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中...',
        });
        var _shopid = wx.getStorageSync('shopid');
        var that = this;
        var params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/order/getAllExpress',
            params,
            function(res) {
                if(res.data.status==1){
                    var _list = res.data.content;

                    that.setData({
                        list: _list
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            });
    },
    formSubmit: function(e) {
        var _shopid = wx.getStorageSync('shopid');
        var _exids = this.data.selex;
        var params = { shopid: _shopid, exids: _exids };
        utils.ajaxRequest(
            'shopMobile/order/setMyExpress',
            params,
            function(res) {
                if(res.data.status==1){
                    wx.navigateBack({
                        delta: 1
                    });
                }
            });
    },

    onPullDownRefresh: function() {

    },
    checkboxChange: function(e) {
        this.setData({
            selex: e.detail.value
        });
    }
})