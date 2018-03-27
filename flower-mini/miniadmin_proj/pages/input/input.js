var md5 = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
Page({

    data: {
        desc: '',
        value: '',
        key: '',
        id: '',
        max: -1
    },

    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: e.title
        });

        this.setData({
            desc: e.desc,
            value: e.value,
            key: e.key,
            id: e.id,
            max: e.max
        });


    },
    formSubmit: function(e) {
        var v = e.detail.value.inputtext;
        var key = this.data.key;
        if (key == 'shopname') {
            this.updateShopInfo('name', v);
        } else if (key == 'shoptelphone') {
            this.updateShopInfo('telphone', v);
        } else if (key == 'addshopcate') {
            this.addshopcate(v);
        } else if (key == 'editshopcate') {
            this.editshopcate(this.data.id, v);
        } else if (key == 'addcategory') {
            this.addcategory(v);
        } else if (key == 'editcategory') {
            this.editcategory(this.data.id, v);
        } else if (key == 'adddelivery') {
            this.adddelivery(v);
        } else if (key == 'editdelivery') {
            this.editdelivery(this.data.id, v);
        }
    },

    adddelivery: function(_value) {
        var _shopid = wx.getStorageSync('shopid');
        var params = {
            title: encodeURIComponent(_value),
            shopid: _shopid
        };
        utils.ajaxRequest(
            'shopMobile/delivery/addDelivery',
            params,
            function(res) {
                if(res.data.status == 1){
                    wx.redirectTo({
                        url: '/pages/more/deliverytmpl/deliverytmpl'
                    }) 
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
    editdelivery: function(_id, _value) {
        var _shopid = wx.getStorageSync('shopid');
        var params = {
            id: _id,
            title: encodeURIComponent(_value),
            shopid: _shopid
        };
        utils.ajaxRequest(
            'shopMobile/delivery/editDelivery',
            params,
            function(res) {
                if(res.data.status==1){
                    wx.redirectTo({
                        url: '/pages/more/deliverytmpl/deliverytmpl'
                    })
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
    updateShopInfo: function(_key, _value) {
        var _shopid = wx.getStorageSync('shopid');
        var params = {
            key: _key,
            value: encodeURIComponent(_value),
            shopid: _shopid
        };
        utils.ajaxRequest(
            'shopMobile/shopadmin/updateInfo',
            params,
            function(res) {
                wx.navigateBack({ delta: 1, });
            });
    },
    addshopcate: function(value) {
        var max = this.data.max;
        if (max > 0) {
            if (value.length > max) {
                wx.showModal({
                    title: '提示',
                    content: '栏目名称不能超过5个字符',
                    showCancel: false,
                    success: function(res) {}
                });
                return;
            }
        }
        var _shopid = wx.getStorageSync('shopid');
        var params = {
            title: encodeURIComponent(value),
            shopid: _shopid
        };
        utils.ajaxRequest(
            'shopMobile/shopadmin/addShopCate',
            params,
            function(res) {
                if(res.data.status==1){
                    wx.navigateBack({ delta: 1, });
                }else{
                    console.log(res.data.msg);
                }
            });
    },
    editshopcate: function(_id, value) {
        var max = this.data.max;
        if (max > 0) {
            if (value.length > max) {
                wx.showModal({
                    title: '提示',
                    content: '栏目名称不能超过5个字符',
                    showCancel: false,
                    success: function(res) {}
                });
                return;
            }
        }
        var _shopid = wx.getStorageSync('shopid');
        var params = {
            id: _id,
            title: encodeURIComponent(value),
            shopid: _shopid
        };

        utils.ajaxRequest(
            'shopMobile/shopadmin/editShopCate',
            params,
            function(res) {
                if(res.data.status==1){
                    wx.navigateBack({ delta: 1, });
                }else{
                    console.log(res.data.msg);
                }
            });
    },
    addcategory: function(value) {

        var _shopid = wx.getStorageSync('shopid');
        var params = {
            title: encodeURIComponent(value),
            shopid: _shopid
        };
        utils.ajaxRequest(
            'shopMobile/shopadmin/addCategory',
            params,
            function(res) {
                if(res.data.status==1){
                    wx.navigateBack({ delta: 1, });
                }else{
                    console.log(res.data.msg);
                }
            });
    },
    editcategory: function(_id, value) {

        var _shopid = wx.getStorageSync('shopid');
        var params = {
            id: _id,
            title: encodeURIComponent(value),
            shopid: _shopid
        };
        utils.ajaxRequest(
            'shopMobile/shopadmin/updateCategory',
            params,
            function(res) {
                if(res.data.status==1){
                    wx.navigateBack({ delta: 1, });
                }
            });
    }

})