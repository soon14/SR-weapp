var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        btntext: '添加',
        shopcateid: null,
        inputValue: ''
    },
    onLoad: function(options) {
        // console.log(options)
        let _shopcateid = options.shopcateid;
        let _title = options.title;
        if (_shopcateid != "add") {
            this.setData({
                shopcateid: _shopcateid,
                inputValue: _title,
                btntext: '保存修改'
            });
        }
    },
    formSubmit: function(e) {
        /*
        shopMobile/column/addShopCateNew
        shopid,title
        Json格式，{"success":"true","msg":"提示数据"}
         */
        let _formId = e.detail.formId;
        var that = this;
        var _title = encodeURIComponent(that.data.inputValue);
        var _shopcateid = that.data.shopcateid;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid, title: _title, shopcateid: _shopcateid, formid: _formId };
        //添加店铺自定义标签
        utils.ajaxRequest(
            'shopMobile/category/update',
            params,
            function(res) {
                if (res.data.status == 1) {
                    // 将返回上页面
                    wx.navigateBack({
                        delta: 1
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                    return;
                }


            });
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

})