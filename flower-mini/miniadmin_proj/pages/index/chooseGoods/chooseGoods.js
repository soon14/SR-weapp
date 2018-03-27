/*chooseGoods.js (选择商品)*/
var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数

        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、这里仅展示所有上架中的商品；" },
            { text: "2、需要选择某个商品，可从顶部搜索框里输入关键词搜索；" },
            { text: "3、售罄和下架中的商品不可选择，最多可选择20个商品。" },
        ],
        inputShowed: false,
        inputVal: '',
        shopcateid: null, //栏目ID
        list: null, //商品数据
        proids: [], //商品id集合，逗号分隔
        check_num: '0', //以选择商品数量
        max_pro: 20, //最大商品数量
    },
    onLoad: function(options) {
        // console.log(options);
        let _shopcateid = options.shopcateid;
        this.setData({
            shopcateid: _shopcateid,
        });

        this.getdata();
    },
    // 搜索栏
    showInput: function() {
        this.setData({
            inputShowed: true,
            page: 1,
        });
    },
    // 搜索栏
    search: function() {
        this.getdata();
    },
    // 搜索栏
    clearInput: function() {
        this.setData({
            inputVal: "",
            page: 1
        });
        this.getdata();
    },
    inputTyping: function(e) {
        let inputVal = e.detail.value;
        if (inputVal.length < 1) {
            this.setData({
                inputVal: ''
            });
            this.getdata();
        }
        this.setData({
            inputVal: inputVal
        });
    },
    // 选择商品
    checkboxChange: function(e) {
        // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        let value = e.detail.value;

        if (value.length > this.data.max_pro) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '可选择商品最多20'
            })
            return;
        } else {

            this.setData({
                proids: value,
                check_num: value.length
            });

            this.addShopCateProduct();
        }
    },
    // 请求数据
    getdata: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var _shopcateid = that.data.shopcateid;
        var _searchname = encodeURIComponent(that.data.inputVal);
        let _page = that.data.page;
        let _limit = that.data.limit;
        var params = { shopid: _shopid, shopcateid: _shopcateid, searchname: _searchname, page: _page, limit: _limit, new: 'yes' };
        utils.ajaxRequest(
            'shopMobile/column/proShowByPage',
            params,
            function(res) {
                if (res.data.status == 1) {

                    var check_num = '0';
                    let proids = that.data.proids;

                    let _list = [];
                    let _page = that.data.page;

                    if (_page > 1) {
                        _list = that.data.list.concat(res.data.content.lists);
                    } else if (_page == 1) {
                        _list = res.data.content.lists
                    }

                    try {
                        for (var i = 0; i < _list.length; i++) {
                            if (_list[i].isuse == '1') {
                                proids.push(_list[i].id)
                                check_num++;
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }

                    that.setData({
                        totalpage: res.data.content.totalpage,
                        list: _list,
                        check_num: check_num,
                        proids: proids,
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }

            });
    },
    //添加商品到栏目
    addShopCateProduct: function() {
        /*
        shopMobile/column/addShopCateProduct
        shopcateid（栏目id）,proids(商品id集合，逗号分隔“1,2,3,4,5,6,7”)
        Json格式，{"success":"true","msg":"提示数据"}
         */
        var that = this;
        var _proids = that.data.proids;
        var _shopcateid = that.data.shopcateid;
        var _proids = that.data.proids || 'nochange';
        var params = { shopcateid: _shopcateid, proids: _proids };
        utils.ajaxRequest(
            'shopMobile/column/addShopCateProduct',
            params,
            function(res) {
                if (res.data.status == 1) {

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }

            });
    },
    //保存成功
    savechange: function() {
        wx.navigateBack({
            delta: 1
        })
    },
    //下拉刷新
    onPullDownRefresh: function() {
        let that = this;

        wx.showNavigationBarLoading(); //在标题栏中显示加载

        that.setData({
            page: 1,
        });

        //模拟加载
        setTimeout(function() {
            that.getdata();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
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

    }

})