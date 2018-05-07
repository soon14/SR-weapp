// 商品管理
var md5 = require('../../../../utils/md5.js');
var utils = require('../../../../utils/util.js');
var app = getApp();

Page({

    data: {
        host: app.host,
        count: 0, //商品总数

        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数
        list: null, //记录列表

        fenleishow: false, //全部分类下拉 默认隐藏
        catetitle: '全部分类', //分类标题 默认 全部分类
        cateid: 0, //分类ID 默认0 全部

        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、删除时需要商家二次确认；" },
            { text: "2、删除的商品将不可恢复。" },
        ],

        shopid: '',
        cates: null,
        catetitles: null,
        cateIndex: 0,

        state: 0,

        list: null,
        oldlist: null,
        // 商品ID
        commodityId: null,
    },
    onLoad: function() {

        this.setData({
            shopid: wx.getStorageSync('shopid')
        });

    },
    onShow: function() {
        this.catesShow();
        this.getdata();
    },
    onPullDownRefresh: function() {
        this.getdata();

        wx.stopPullDownRefresh();
    },
    ishowChange: function(e) {
        // console.log(e);
        let that = this;
        that.setData({
            fenleishow: !that.data.fenleishow,
            catetitle: e.target.dataset.catetitle,
            cateid: e.target.dataset.cateid,
            page:1,
            totalpage:1,
        });

        if (e.target.dataset.cateid >= 0) {
            that.getdata();
        }
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
            'shopMobile/category/allUnSale',
            params,
            function(res) {
                let _list = [];
                let _page = that.data.page;

                if (_page > 1) {
                    _list = that.data.list.concat(res.data.content.lists);
                } else if (_page == 1) {
                    _list = res.data.content.lists
                }

                if (res.data.status == 1) {
                    that.setData({
                        list: _list||'',
                        allsalecount: res.data.content.allsalecount, //上架总数
                        saleoutcount: res.data.content.saleoutcount, //售罄总数
                        unsalecount: res.data.content.unsalecount, //下架总数
                        totalpage: res.data.content.totalpage,
                    });
                } else {
                    that.setData({
                        list: null,
                        allsalecount: res.data.content.allsalecount, //上架总数
                        saleoutcount: res.data.content.saleoutcount, //售罄总数
                        unsalecount: '0', //下架总数
                        totalpage: res.data.content.totalpage,
                    });
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });


    },
    // 分类展示
    catesShow: function() {
        // 分类展示
        let that = this;
        let _shopid = that.data.shopid;
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/category/show',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        cates: res.data.content,
                    });
                } else {
                    that.setData({
                        list: null
                    })
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
    // 置顶
    toTop: function(e) {
        let that = this;
        let _id = e.target.dataset.id;
        let _shopid = that.data.shopid;
        let params = { productid: _id, shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/product/setTopIndexProduct',
            params,
            function(res) {
                if (res.data.status == 1) {

                    setTimeout(function() {
                        wx.showToast({
                            title: '置顶成功！',
                            icon: 'success',
                            duration: 1000
                        });
                    }, 1000);

                    that.getdata();

                }
            });
    },
    // 删除
    delitem: function(e) {
        let that = this;
        let _id = e.target.dataset.id;
        let _shopid = that.data.shopid;
        wx.showModal({
            title: '提示',
            content: '确定要删除这个商品？',
            success: function(res) {
                if (res.confirm) {
                    let params = { id: _id, shopid: _shopid };
                    utils.ajaxRequest(
                        'shopMobile/product/delPro',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                setTimeout(function() {
                                    wx.showToast({
                                        title: '删除成功！',
                                        icon: 'success',
                                        duration: 1000
                                    });
                                }, 1000);

                                that.getdata();
                            }
                        });
                }
            }
        })
    },
    // 下架商品
    downitem: function(e) {
        let that = this;
        let _id = e.target.dataset.id;
        let _shopid = that.data.shopid;
        wx.showModal({
            title: '提示',
            content: '确定要下架这个商品？',
            success: function(res) {
                if (res.confirm) {
                    // 0 上架 1 下架
                    that.updownproduct(_shopid, _id, 1);
                }
            }
        })
    },
    // 上架商品 涉及到是否还有库存，直接去编辑页面
    upitem: function(e) {
        let that = this;
        let _id = e.target.dataset.id;
        let _shopid = that.data.shopid;
        wx.showModal({
            title: '提示',
            content: '确定要上架这个商品？',
            success: function(res) {
                if (res.confirm) {
                    if (_id > 0) {
                        wx.navigateTo({
                            url: '/pages/index/products/addproduct/addproduct?id=' + _id
                        });
                    }
                }
            }
        })
    },
    // 下架商品 0 上架 1 下架
    updownproduct: function(_shopid, _productid, _isdown) {
        let that = this;
        let params = {
            shopid: _shopid,
            productid: _productid,
            isdown: _isdown
        };
        utils.ajaxRequest(
            'shopMobile/product/upDownProduct',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.fliterProductState(_productid, _isdown);
                }
            });
    },
    // 下架商品 
    fliterProductState: function(_id, isdown) {
        // console.info("id=" + _id + " down=" + isdown);
        let _list = this.data.list;
        for (let i = 0; i < _list.length; i++) {
            if (_list[i].id == _id) {
                _list[i].state = isdown;
                break;
            }
        }
        this.setData({
            list: _list
        });
    },
    // 编辑商品
    edititem: function(e) {
        let id = e.target.dataset.id;
        if (id > 0) {
            wx.navigateTo({
                url: '/pages/index/products/addproduct/addproduct?id=' + id
            });
        }
    },
    addnew: function() {

        wx.navigateTo({
            url: '/pages/index/products/addproduct/addproduct'
        })
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