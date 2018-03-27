/**
 *  @author Shirui 2018/02/01
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        page: 1,
        limit: 200, //(每页多少条记录)
        totalPage: 1, //最大页数
        list: null, //记录列表
    },
    onLoad: function(options) {
        let that = this;
        that.getdata();
    },
    // 获取数据
    getdata: function() {
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _page = that.data.page;
        let _limit = that.data.limit;
        /*
        余额记录列表 buyerMobile/balance/balanceList
        参数 shopid openid,page,limit(每页多少条记录)
         */
        let params = { openid: _openid, page: _page, limit: _limit };

        util.ajaxRequest(
            'buyerMobile/balance/balanceList',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let _list = [];
                    let _page = that.data.page;

                    if (_page > 1) {
                        _list = that.data.list.concat(res.data.list);
                    } else if (_page == 1) {
                        _list = res.data.list;
                    }

                    that.setData({
                        list: _list,
                        totalPage: res.data.totalPage,
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

        if (_page > that.data.totalPage) {

            wx.showLoading({
                title: '没有更多数据',
            });

            setTimeout(function() {
                wx.hideLoading()
            }, 800);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getdata();
        }

    },

})