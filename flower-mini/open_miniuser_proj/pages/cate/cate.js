var md5 = require('../../utils/md5.js');
var app = getApp();
Page({
    data: {
        page: 1,
        limit: 500, //(每页多少条记录)
        totalpage: 1, //最大页数

        cdnhost: app.cdnhost,

        titlelist: null,
        contentlist: null,

        cateid: '',
    },
    onLoad: function() {
        this.getdata();
        this.serchdata();
    },
    // 获取数据
    getdata: function() {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        });
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: app.shopid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/shop/getCategorys',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res)
                wx.hideLoading();
                let titlelist = res.data;

                titlelist.unshift({
                    id: '',
                    title: '全部'
                })

                that.setData({
                    titlelist: titlelist
                });
            }
        });
    },
    serchdata: function() {
        /*
        分类产品
        buyerMobile/category/allSaleProducts,
        参数shopid,page,limit,cateid，
         */
        let that = this;
        let page = that.data.page;
        let limit = that.data.limit;
        let cateid = that.data.cateid;
        wx.showLoading({
            title: '加载中...',
        });
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            shopid: app.shopid,
            page: page,
            limit: limit,
            cateid: cateid
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        // console.log(_params)
        wx.request({
            url: app.host + '/buyerMobile/category/allSaleProducts',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res)
                wx.hideLoading();
                if (res.data.status == 1) {
                    let _page = that.data.page;
                    var lists = res.data.content.lists;
                    var _list = [];
                    if (_page > 1) {
                        _list = that.data.contentlist.concat(lists);
                    } else if (_page == 1) {
                        _list = lists;
                    }

                    that.setData({
                        contentlist: _list,
                        totalpage: res.data.content.totalpage,
                    });

                } else {
                    console.log(res.data.msg)

                }
            }
        });
    },
    //选项卡切换
    navbarTap: function(e) {
        var that = this;
        that.setData({
            cateid: e.currentTarget.dataset.id
        });

        that.serchdata();
    },
    goUrl: function(e) {
        var that = this;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?id=' + id
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
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

            that.serchdata();
        }

    }
})