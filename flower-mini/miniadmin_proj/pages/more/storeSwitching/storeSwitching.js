/**
 * Created by SR on 2017/9/25.
 * 37780012@qq.com
 */
const util = require("../../../utils/util.js");
const app = getApp();
Page({
    data: {
        msession: null,
        nowshopid: null,
        list: null,
        isshow: true
    },
    onLoad: function(options) {
        let _msession = wx.getStorageSync('msession');
        let _shopid = wx.getStorageSync('shopid');

        this.setData({
            msession: _msession,
            nowshopid: _shopid
        });

        this.refresh();
    },
    // 刷新
    onPullDownRefresh: function() {
        this.refresh();
        wx.stopPullDownRefresh();
    },
    // 按钮刷新
    buttonrefresh: function() {
        app.auth();
    },
    refresh: function() {
        /**
         * [refresh 请求数据]
         * 店铺列表
         * mobile/shopadmin/memberAllShops
         * 参数 msession
         */
        let that = this;
        let _msession = that.data.msession;
        let params = { msession: _msession };
        util.ajaxRequest(
            'shopMobile/shopadmin/memberAllShops',
            params,
            function(res) {
                console.log(res);
                if (res.data.content.length > 0) {
                    that.setData({
                        list: res.data.content,
                        isshow: true
                    });
                    wx.setNavigationBarTitle({
                        title: '切换店铺'
                    });

                } else {
                    that.setData({
                        list: res.data.content,
                        isshow: false
                    });
                    wx.setNavigationBarTitle({
                        title: '还差一步'
                    });
                }
            });
    },
    switch: function(e) {
        /**
         * 切换店铺记录状态
         * shopMobile/shopadmin/switchShop
         * 参数
         * {msession:'xxxx',shopid:204}
         */

        let that = this;
        let _shopid = e.currentTarget.dataset.shopid;
        let _msession = that.data.msession;
        let params = { msession: _msession, shopid: _shopid };

        util.ajaxRequest(
            'shopMobile/shopadmin/switchShop',
            params,
            function(res) {

                if (res.data.status == 1) {

                    wx.setStorage({
                        key: "shopid",
                        data: _shopid
                    });
                    app.shopid = _shopid;

                    wx.reLaunch({
                        url: '/pages/index/index'
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