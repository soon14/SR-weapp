/*carouselFigureSet.js (轮播图设置)*/
var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        host: app.cdnhost,
        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、轮播图是店铺首页的左右滚动广告图片；" },
            { text: "2、您可以设置3张轮播图，并关联到商品链接；" },
            { text: "3、若不设置轮播图，则系统默认显示门店图。" },
        ],
        inputShowed: false,
        inputVal: '',
        defaultSlideImg: null,
        userSlideImgs: null
    },
    onLoad: function(options) {

    },
    onShow: function() {
        this.getdata();
    },
    goUrl: function() {

        if (this.data.userSlideImgs.length >= 3) {
            
            return;
        }

        wx.navigateTo({
            url: "/pages/index/carouselFigurUpload/carouselFigurUpload"
        })
    },
    // 删除图片
    delimg: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除这个轮播图？',
            success: function(res) {
                if (res.confirm) {

                    let _slideid = e.currentTarget.dataset.id;
                    var params = { slideid: _slideid };

                    utils.ajaxRequest('shopMobile/slider/slideDel', params,
                        function(res) {
                            if (res.data.status == 1) {
                                that.getdata();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: res.data.msg,
                                    success: function(res) {}
                                });
                            }
                        });

                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });

    },
    // 请求数据
    getdata: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/slider/slideSet',
            params,
            function(res) {
                if (res.data.status == 1) {

                    that.setData({
                        defaultSlideImg: res.data.content.default,
                        userSlideImgs: res.data.content.sliders || false,
                    });

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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    },
})