/**
 *  @author Shirui 2018/02/07
 *  37780012@qq.com
 */
/*columnStyle.js (栏目样式)*/
var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        host: app.host,
        // 样式列表
        stylelist: null,
        //正在使用的模版id
        nowstyle: 0,

    },
    onLoad: function(options) {
        this.getdata();
    },
    onShow: function() {},
    //卖家版 样式列表
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/style/getStyleList',
            params,
            function(res) {
                if (res.data.status == 1) {

                    let _stylelist = res.data.content.stylelist;
                    let _nowstyle = res.data.content.nowstyle;

                    that.setData({
                        stylelist: _stylelist,
                        nowstyle: _nowstyle,
                    })

                } else {
                    console.log(res.data.msg)
                }

            });
    },
    //卖家版 样式列表
    setStyle: function(e) {
        let that = this;
        let _nowstyle = that.data.nowstyle;

        let _styleid = e.currentTarget.dataset.id;

        if (_styleid == _nowstyle) {
            return;
        }

        let _shopid = wx.getStorageSync('shopid');

        let params = {
            shopid: _shopid,
            styleid: _styleid
        };

        utils.ajaxRequest(
            'shopMobile/style/setStyle',
            params,
            function(res) {
                if (res.data.status == 1) {

                    that.setData({
                        nowstyle: _styleid
                    })

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 1500
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }

            });
    },


})