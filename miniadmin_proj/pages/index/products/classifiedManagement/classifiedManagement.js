// 分类管理
var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        host: app.cdnhost,
        
        list: null, //分类数据
        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、全部商品是系统自带的分类，不可编辑和删除；" },
            { text: "2、每件商品都有“全部商品”分类，并同时有可能属于另一个自定义分类；" },
            { text: "3、自定义分类删除后，该分类所属商品只属全部商品分类。" },
        ],
    },
    onLoad: function() {
        let _shopid = wx.getStorageSync('shopid');

        this.setData({
            shopid: _shopid
        });

    },
    onShow: function() {
        this.getdata();
    },
    // 获取初始数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/category/show',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list: res.data.content
                    });
                } else {
                    that.setData({
                        list: null
                    })
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            });

    },
    //刷新页面
    Refresh: function() {
        this.getdata();
    },
    // 置顶
    toTop: function(e) {
        let that = this;
        let _id = e.target.dataset.id;
        let _shopid = that.data.shopid;
        //id,要置顶的分类id
        let params = { id: _id, shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/category/setTop',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.getdata();
                } else if (res.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }
            });
    },
    // 推广
    extensionUrl: function(event) {
        let that = this;
        let id = event.target.dataset.id;

        that.qrcodeitem(id);
    },
    // 生成海报
    qrcodeitem: function(id) {
        wx.navigateTo({
            url: '/pages/index/classifiedPoster/classifiedPoster?id=' + id
        });
    },
    /**
     * 删除分类
     */
    delitem: function(e) {
        let that = this;
        let _id = e.target.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定要删除这个分类？',
            success: function(res) {
                if (res.confirm) {
                    let params = { id: _id };

                    utils.ajaxRequest(
                        'shopMobile/category/del',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                that.getdata();
                            } else if (res.data.status == 0) {
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function(res) {}
                                });
                            }
                        });
                }
            }
        })
    },
    //添加分类
    addnew: function() {
        wx.navigateTo({
            url: '/pages/index/products/addClassified/addClassified?title=新增分类&key=addcategory'
        });
    },
    // 返回商品管理
    back: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    },

})