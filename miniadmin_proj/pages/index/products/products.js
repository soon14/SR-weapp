/*
 * 商品管理
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-04-10 19:14:03 
 * @Last Modified by:   yangshirui 
 * @Last Modified time: 2018-04-10 19:14:03 
 */

const utils = require('../../../utils/util.js');
const app = getApp();

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
            { text: "1、商品图片标有“特”字表示为特价商品，设置为特价商品将不参与任务优惠活动；" },
            { text: "2、需要删除的商品，需要从下架中操作；" },
            { text: "3、点击商品图片标题等，进入编辑商品详情。" },
        ],

        shopid: '',
        cates: null,
        catetitles: null,
        cateIndex: 0,

        status: ['所有状态', '已上架', '已下架'],
        statusIndex: 0,
        state: -1,

        btnshow: true, //刷新按钮显示
        oldlist: null,
        // 商品ID
        commodityId: null,
        // 获取商品ID弹出框状态
        commodityAction: false,
        checkItems: [
            { name: 'wenzi', value: '文字', checked: 'true' },
            { name: 'tupian', value: '图片' },
            { name: 'xiaochengxukapian', value: '小程序卡片' }
        ]
    },
    onLoad: function() {
        let _shopid = wx.getStorageSync('shopid');

        this.setData({
            shopid: _shopid
        });
    },
    onShow: function() {
        this.setData({
            page:1,
        })

        this.catesShow();
        this.getdata();
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
    //刷新页面
    Refresh: function() {
        this.setData({
            cateid: 0,
            page:1
        });
        this.getdata();
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
            'shopMobile/category/allSaleProducts',
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
    // 置顶
    toTop: function(e) {
        var that = this;
        var _id = e.target.dataset.id;
        var _shopid = that.data.shopid;
        var params = { productid: _id, shopid: _shopid };
        // console.log('--1---zhiding');
        // console.log(params);
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
    delitem: function(_id) {
        let that = this;
        let _shopid = that.data.shopid;
        wx.showModal({
            title: '提示',
            content: '确定要删除这个商品？',
            success: function(res) {
                if (res.confirm) {

                    let _timestamp = app.getTimeStamp();
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
    // 下架商品 0 上架 1 下架
    updownproduct: function(_shopid, _productid, _isdown) {
        let that = this;
        let _timestamp = app.getTimeStamp();
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
                    that.setData({
                        page:1
                    })
                    that.getdata();
                }

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
    // 生成海报
    qrcodeitem: function(id) {
        wx.navigateTo({
            url: '/pages/index/qrcodeproduct/qrcodeproduct?id=' + id
        });
    },
    addnew: function() {

        wx.navigateTo({
            url: '/pages/index/products/addproduct/addproduct'
        })
    },
    // 推广
    extensionUrl: function(event) {
        let id = event.target.dataset.id;
        let that = this;
        that.setData({
            commodityId: id
        });
        // console.log(event);
        wx.showActionSheet({
            itemList: ['生成海报', '生成公众号商品推广路径'],
            success: function(res) {
                switch (res.tapIndex) {
                    // 生成海报
                    case 0:
                        that.qrcodeitem(id);
                        break;
                        // 获得商品ID弹出框
                    case 1:
                        that.setData({
                            commodityAction: id
                        });
                        break;

                }
                // console.log(event.target.dataset);
            }
        })
    },
    // 关闭 获得商品ID弹出框
    extensionClose: function() {
        this.setData({
            commodityAction: false
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
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
            }, 1000);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getdata();
        }

    }

})