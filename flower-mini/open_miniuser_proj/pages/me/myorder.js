var md5 = require('../../utils/md5.js');
var sliderWidth = 150;
var app = getApp();
Page({
    data: {

        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        orderstate: -1,
        list: null,
        oldlist: null,
        ocount: 0,
        host: '',
        orderstatetitle: '',
        page: 1, //返回第几页
        limit: 10, //每页返回的数据条数
        state: 'all',
        totalPage: ''
    },

    onLoad: function (e) {
        let index = 0;
        this.setData({
            activeIndex: index,
            // orderstate: index - 1,
            sliderLeft: index * sliderWidth,
            sliderOffset: sliderWidth,
            host: app.cdnhost,
            orderstatetitle: app.orderstatetitle
        });
        this.sd_getdata();
    },
    onPullDownRefresh: function () {
        this.sd_getdata();
        wx.stopPullDownRefresh();
    },
    sd_getdata: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        var that = this;
        var state = this.data.orderstate;
        var _openid = wx.getStorageSync('openid');
        var _shopid = app.shopid;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({
            openid: _openid,
            shopid: _shopid,
            type: '',
            page: this.data.page,
            limit: this.data.limit,
            state: this.data.state
        });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/order/GetAllOrdersByOpenid',
            data: {
                shopid: app.shopid,
                timestamp: _timestamp,
                params: _params,
                sign: _sign
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            complete: function (res) {
                wx.hideToast();
                let newlist = res.data.info.list;
                let totalPage = res.data.info.totalpage;
                if (that.data.page > 1) {
                    newlist = that.data.list.concat(newlist);
                } else if (that.data.page === 1) {
                    newlist = newlist;
                }
                that.setData({
                    totalPage: totalPage,
                    list: newlist,
                    oldlist: res.data.info.list,
                    ocount: newlist.length
                });
                console.log(newlist)
            }
        })
    },
    switchTabToGetData(e) {
        let state = parseInt(e.currentTarget.dataset.state);
        const index = parseInt(e.currentTarget.dataset.index);
        if (isNaN(state)) {
            state = 'all';
        }
        console.log('state:' + state, 'index:' + index)
        this.setData({
            state: state,
            page: 1,
            sliderLeft: index * sliderWidth,
            orderstate: index - 1,
            activeIndex: index
        });
        this.sd_getdata();
    },
    onReachBottom() {
        let _page = this.data.page;
        let nextPage = _page + 1;
        if (nextPage > this.data.totalPage) {
            wx.showLoading({
                title: "没有更多数据"
            });
            setTimeout(function () {
                wx.hideLoading();
            }, 1000);
            return;
        } else {
            this.setData({
                page: nextPage
            })
            this.sd_getdata()
        }
    }

})