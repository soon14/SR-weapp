// 经营报表
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        list: null,
        list2: null,
        list3: null,
        Url: 'shopMobile/orderManage/dailyDetail', //日报
        //顶部导航（选项卡)
        topNavbarData: {
            'currentTab': 0,
            'navbar': ["日报", "周报", "月报"]
        },
    },
    onLoad: function(options) {
        this.getdata();
    },
    //顶部选项卡切换
    navbarTap: function(e) {
        var that = this;
        var _topNavbarData = that.data.topNavbarData;
        _topNavbarData.currentTab = e.currentTarget.dataset.idx;

        let Url = that.data.Url;
        if (e.currentTarget.dataset.idx == '0') {
            Url = 'shopMobile/orderManage/dailyDetail'; //日报
        } else if (e.currentTarget.dataset.idx == '1') {
            Url = 'shopMobile/orderManage/weekDetail'; //周报
        } else if (e.currentTarget.dataset.idx == '2') {
            Url = 'shopMobile/orderManage/monthDetail'; //月报
        }

        that.setData({
            topNavbarData: _topNavbarData,
            Url: Url
        });

        that.getdata();
    },
    // 获取所有用户信息
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        let Url = that.data.Url;
        utils.ajaxRequest(
            Url,
            params,
            function(res) {
                if (res.data.status = 1) {
                    that.setData({
                        list: res.data.content
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
    }

})