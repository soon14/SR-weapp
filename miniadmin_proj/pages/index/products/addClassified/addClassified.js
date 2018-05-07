var md5 = require('../../../../utils/md5.js');
var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        host: app.cdnhost,

        value: '',
        key: '',
        id: '',
        checkId: null, //选择的图标ID
    },
    onLoad: function(opentions) {
        // console.log(opentions);
        wx.setNavigationBarTitle({
            title: opentions.title
        });

        this.setData({
            value: opentions.value,
            key: opentions.key,
            id: opentions.id,
        });
        // this.showIcon();
    },
    //保存
    formSubmit: function(e) {
        // console.log(e)
        let _formId = e.detail.formId;
        var _value = e.detail.value.inputtext;
        var key = this.data.key;

        if (key == 'addcategory') {
            this.addcategory(_value,_formId);
        } else if (key == 'editcategory') {
            this.editcategory(this.data.id, _value,_formId);
        }
    },
    //分类图标展示
    // showIcon: function() {
    //     let that = this;
    //     var _shopid = wx.getStorageSync('shopid');
    //     var params = { shopid: _shopid };
    //     utils.ajaxRequest(
    //         'shopMobile/category/showCateIcon',
    //         params,
    //         function(res) {
    //             if (res.data.status == 1) {
    //                 that.setData({
    //                     list: res.data.content
    //                 });
    //             } else {
    //                 that.setData({
    //                     list: null
    //                 })
    //                 wx.showModal({
    //                     title: '提示',
    //                     content: res.data.msg,
    //                     showCancel: false,
    //                     success: function(res) {}
    //                 })
    //             }

    //         });
    // },
    // 添加分类
    addcategory: function(value,formId) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        // let _iconid = that.data.checkId;
        let params = {
            title: encodeURIComponent(value),
            shopid: _shopid,
            formid: formId
            // iconid: _iconid, //图标id
        };

        utils.ajaxRequest(
            'shopMobile/category/add',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.back();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                    return;
                }

            });
    },
    // 编辑分类
    editcategory: function(_id, value, formId) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        // let _iconid = that.data.checkId;
        let params = {
            cateid: _id, //分类id
            // iconid: _iconid, //图标id
            title: encodeURIComponent(value),
            shopid: _shopid,
            formid: formId
        };
        utils.ajaxRequest(
            'shopMobile/category/update',
            params,
            function(res) {
                //todo:提示信息一闪而过
                if (res.data.status == 1) {
                    that.back();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                    return;
                }

            });
    },
    // 选择图标
    checkicon: function(e) {
        // console.log(e.target.dataset.id);
        this.setData({
            checkId: e.target.dataset.id
        });
    },
    // 返回商品管理
    back: function() {
        wx.navigateBack({
            delta: 1
        });
    },

})