// 商品管理 售罄
var md5 = require('../../../../utils/md5.js');
var utils = require('../../../../utils/util.js');
var app = getApp();

Page({

    data: {
        host: app.host,
        shopid: null,
        count: 0, //商品总数

        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数
        list: null, //记录列表

        cateid: 0, //分类ID 默认0 全部

    },
    onLoad: function() {

        this.setData({
            shopid: wx.getStorageSync('shopid')
        });
    },
    onShow:function(){
        this.getdata();
    },
    onPullDownRefresh: function() {
        this.getdata();

        wx.stopPullDownRefresh();
    },
    // 获取初始数据
    getdata: function() {
        
        let that = this;
        let _page = that.data.page;
        let _limit = that.data.limit;
        let _shopid = that.data.shopid;
        let _cateid = that.data.cateid;
        let params = { shopid: _shopid, cateid: _cateid, page: _page, limit: _limit };
        utils.ajaxRequest(
            'shopMobile/category/saleOut',
            params,
            function(res) {
                console.log(res);
                let _list = [];
                let _page = that.data.page;

                if (_page > 1) {
                    _list = that.data.list.concat(res.data.content.lists);
                } else if (_page == 1) {
                    _list = res.data.content.lists
                }

                // console.log(_list);
                if (res.data.status == 1) {
                    that.setData({
                        list: _list||'',
                        allsalecount: res.data.content.allsalecount, //上架总数
                        saleoutcount: res.data.content.saleoutcount, //售罄总数
                        unsalecount: res.data.content.unsalecount, //下架总数
                        totalpage: res.data.content.totalpage,
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
    //刷新页面
    Refresh: function() {
        this.getdata();
    },
    addnew: function() {
        wx.navigateTo({
            url: '/pages/index/products/addproduct/addproduct'
        })
    },
    // 编辑商品
    edititem: function(e) {
        let id = e.target.dataset.id;
        // console.log(id)
        if (id > 0) {
            wx.navigateTo({
                url: '/pages/index/products/addproduct/addproduct?id=' + id
            });
        }
    },
    //加载更多
    onReachBottom: function() {
        let that = this;
        let _page = that.data.page + 1;

        if (_page > that.data.totalpage) {

            wx.showLoading({
                title: '没有更多数据',
            });

            setTimeout(function() {
                wx.hideLoading();
            }, 500);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getdata();
        }

    },

})