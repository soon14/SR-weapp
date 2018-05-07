var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({

    data: {

        list: null
    },

    onLoad: function() {
        this.sd_getdata();
    },

    onPullDownRefresh: function() {
        this.sd_getdata();
        wx.stopPullDownRefresh();
    },
    sd_getdata: function() {
        var _shopid = wx.getStorageSync('shopid');
        var that = this;
        var params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/delivery/gets',
            params,
            function(res) {
                if(res.data.status==1){
                    that.setData({
                        list: res.data,
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }
            });
    },

    addnew: function() {
        wx.redirectTo({
            url: '/pages/input/input?title=新增配送方式&desc=配送方式名称&key=adddelivery'
        })
    },
    delitem: function(e) {
        let that = this;
        var _id = e.target.dataset.id;
        var _shopid = wx.getStorageSync('shopid');
        wx.showModal({
            title: '提示',
            content: '确定要删除这个配送方式？',
            success: function(res) {
                if (res.confirm) {
                    var params = { id: _id, shopid: _shopid };
                    
                    utils.ajaxRequest(
                        'shopMobile/delivery/delDelivery',
                        params,
                        function(res) {
                            if(res.data.status==1){
                                that.sd_getdata();
                            }else{
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function(res) {}
                                });
                            }
                        });
                }
            }
        })
    },
    tabClick: function() {
        wx.redirectTo({
            url: '/pages/more/faretmpl/faretmpl'
        })
    }

})