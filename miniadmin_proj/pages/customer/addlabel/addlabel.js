var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');

var app = getApp();
Page({
    data: {
        inputValue: ''
    },
    onLoad: function(options) {

    },
    addlabelRequest: function() {
        var that = this;

        var _inputValue = encodeURIComponent(that.data.inputValue);
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid, tagname: _inputValue };

        utils.ajaxRequest('shopMobile/tags/addShopTag',params,function(res){
            // console.log(res);
                // console.log(res);
                wx.hideLoading();
                if(res.data.status==1){

                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 2500
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
                // 将返回上页面
                wx.navigateBack({
                    delta: 1
                });

        });

    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

})