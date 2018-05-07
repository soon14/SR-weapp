// 收支明细
var utils = require('../../../utils/util.js');
var app = getApp();

Page({
    data: {
        list: null,
        list2: null,
        list3: null,
        //顶部导航（选项卡)
        topNavbarData: {
            'currentTab': 0,
            'navbar': ["订单明细", "二维码收款明细", "充值明细"]
        },
    },
    onLoad: function(options) {

    },
    onShow: function() {
        this.getdata();

    },
    //顶部选项卡切换
    navbarTap: function(e) {
        let that = this;
        let _topNavbarData = that.data.topNavbarData;
        _topNavbarData.currentTab = e.currentTarget.dataset.idx;
        that.setData({
            topNavbarData: _topNavbarData,
        });
        if (e.currentTarget.dataset.idx == '0') {
            that.getdata();
        } else if (e.currentTarget.dataset.idx == '1') {
            that.codeDetail();
        } else if (e.currentTarget.dataset.idx == '2') {
            that.rechargeDetail();
        }

    },
    // 获取数据 
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/orderManage/detailsWithOrder',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list: res.data.content
                    });
                } else{
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }

            });
    },
    // 收支明细-二维码收款明细
    codeDetail: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/orderManage/detailsWithCode',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list2: res.data.content
                    });
                } else{
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }
            });
    },
    // 收支明细-充值明细
    rechargeDetail: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/orderManage/detailsWithRecharge',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list3: res.data.content
                    });
                } else{
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }
            });
    }
})