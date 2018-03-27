var md5 = require('../../../utils/md5.js');
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
        page: 1,
        nextPage: 1,
        totalPage: '',
        orderstatetitle: '',
        state: '',
        groupstatus: '',
        limit: 10
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
        this.sd_getdata(); //下拉刷新获取当前tab的state值和groupstatus值
        wx.stopPullDownRefresh();
    },
    //设置_state,_groupstatus参数，在对应tab下拉刷新时获取对应数据
    sd_getdata() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _shopid = app.shopid;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({
            openid: _openid,
            shopid: _shopid,
            page: this.data.page,
            limit: this.data.limit,
            state: this.data.state,
            groupstatus: this.data.groupstatus
        });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/groupItem/groupOrderList',
            data: {
                shopid: app.shopid,
                timestamp: _timestamp,
                params: _params,
                sign: _sign,
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
            }
        })
    },
    switchTabToGetData(e) {
        let state = parseInt(e.currentTarget.dataset.state);
        const index = parseInt(e.currentTarget.dataset.index);
        let groupstatus = parseInt(e.currentTarget.dataset.groupstatus);
        if (isNaN(state)) {
            state = '';
        }
        if (isNaN(groupstatus)) {
            groupstatus = '';
        }
        this.setData({
            state: state,
            groupstatus: groupstatus,
            activeIndex: index,
            sliderLeft: index * sliderWidth,
            page: 1
        })
        this.sd_getdata()
        console.log('state:' + state, 'groupstatus:' + groupstatus)
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