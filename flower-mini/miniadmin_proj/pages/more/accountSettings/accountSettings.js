/**
 * Created by SR on 2017/9/25.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        isbind: false
    },
    onShow: function(options) {
        var that = this;
        var _msession = wx.getStorageSync('msession');
        var params = { msession: _msession };
        utils.ajaxRequest(
            'shopMobile/login/getWxShoperByOpenId',
            params,
            function(res) {
                if (res.data.content.telphone != '' && res.data.content.telphone != null) {
                    that.setData({
                        isbind: true
                    });
                }
            });
    },
    resetface: function(options) {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/shopadmin/resetShopFace',
            params,
            function(res) {
                if(res.data.status==1){
                    // wx.showModal({
                    //     title: '提示',
                    //     content: '重新生成成功',
                    //     showCancel: false,
                    //     success: function(res) {}
                    // });
                    return;
                }
            });
    },
    openset: function() {
        wx.openSetting({
            success: (res) => {
                /*
                 * res = {
                 *   "scope.userInfo": true,
                 *   "scope.userLocation": true
                 * }
                 */
            }
        })
    }
})