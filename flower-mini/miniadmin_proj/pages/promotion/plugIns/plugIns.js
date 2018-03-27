/**
 * 插件购买
 * Created by SR on 2018/03/06.
 * 37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // this.getdata();
    },
    onShow: function() {},
    /**
     * shopMobile/shopadmin/getMemberInfo,
     * 参数 msession shopid
     */
    getdata: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _shopid = wx.getStorageSync('shopid');
        let params = { msession: _msession, shopid: _shopid };

        util.ajaxRequest(
            'shopMobile/shopadmin/getMemberInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        userinfo: res.data.content.info,
                        shopinfo: res.data.content.shop
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            app.auth();
                        }
                    })
                }
            });
    },
    // 立即订购
    goUrl: function() {
        wx.navigateTo({
            url: '/pages/promotion/plugIns/plugInsDetail/plugInsDetail'
        })
    },

})