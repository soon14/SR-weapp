/**
 * 门店设置
 * Created by SR on 2017/12/05.
 * 37780012@qq.com
 */
var md5 = require('../../../../utils/md5.js');
var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        host: app.cdnhost,

        list: null, //门店服务列表

        serviceids: [], //选择中的
    },
    onLoad: function(options) {
        var _msession = wx.getStorageSync('msession');
        var _shopid = wx.getStorageSync('shopid');
        this.setData({
            msession: _msession,
            nowshopid: _shopid
        });
        this.allServiceWithShopid();
    },
    // 门店服务
    allServiceWithShopid: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/category/allServiceWithShopid',
            params,
            function(res) {
                let serviceids = that.data.serviceids;
                if (res.data.status == 1) {
                    let list = res.data.content;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].isuse == '1') {
                            serviceids.push(list[i].id);
                        }
                    }
                    that.setData({
                        list: res.data.content,
                        serviceids: serviceids
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '暂无门店服务',
                        success: function(res) {}
                    })
                }

            });
    },
    //选择
    checkboxChange: function(e) {
        // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        this.setData({
            serviceids: e.detail.value
        });
    },
    //保存
    formSubmit: function(e) {
        let _formId = e.detail.formId;
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _serviceids = this.data.serviceids;
        let params = { shopid: _shopid, serviceids: _serviceids, formid: _formId };

        utils.ajaxRequest(
            'shopMobile/category/saveService',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            });
    }

})