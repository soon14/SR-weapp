/**
 *  @author Shirui 2018/02/06
 *  37780012@qq.com
 */
const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,
        list: null,
        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、上方的编辑区域分别依次对应店铺主页上的轮播图、店铺栏目、商品样式的编辑区域；" },
            { text: "2、轮播图编辑区域，可以修改店铺首页的左右滚动广告图片；" },
            { text: "3、店铺栏目编辑区域，可以修改店铺首页中展示的栏目和栏目中对应的商品；" },
            { text: "4、商品样式编辑区域，可以修改店铺首页中商品展示的样式；" },
        ],
    },
    onLoad: function(options) {
        let that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    maxWidth: res.windowWidth,
                    maxHeight: res.windowHeight,
                })
            }
        })
    },
    onShow: function() {
        this.getdata();
    },
    // 获取数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/shopadmin/indexinfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list: res.data.content
                    })
                } else {
                    console.log(res.data.msg);
                }
            });
    },
    goBanner: function() {
        wx.navigateTo({
            url: '/pages/index/carouselFigureSet/carouselFigureSet'
        })
    },
    goNavbar: function() {
        wx.navigateTo({
            url: '/pages/index/shopColumn/shopColumn'
        })
    },
    goTpl: function() {
        wx.navigateTo({
            url: '/pages/index/shopColumn/columnStyle/columnStyle'
        })
    },

})