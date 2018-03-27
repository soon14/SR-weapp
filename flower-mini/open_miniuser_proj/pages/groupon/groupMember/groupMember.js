/**
 *  @author Shirui 2018/02/23
 *  37780012@qq.com
 *  查看拼团成员
 */
const md5 = require('../../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        list: null,

        groupitemid: null, //订单成团id
        search: '', //搜索内容
    },
    onLoad: function(options) {
        let that = this;

        that.setData({
            groupitemid: options.groupitemid || ''
        })

        that.getdata();
    },
    getdata: function() {
        /**
         * 拼团成员
         * 接口URL：/buyerMobile/groupItem/groupMember
         *交互类型：POST
         *传入参数：
                params{
                    groupitemid:1,//订单成团id
                    search:'130',//搜索内容
                }
         */
        wx.showLoading({
            title: '加载中'
        })
        let that = this;

        let _search = that.data.search;
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            groupitemid: that.data.groupitemid, //订单成团id
            search: encodeURIComponent(_search) //搜索内容
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/groupItem/groupMember',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                wx.hideLoading();
                console.log(_params)
                console.log(res)

                if (res.data.suc == 1) {

                    let list = res.data.info.list;
                    that.setData({
                        list: list
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }

            }
        });
    },
    search: function(e) {
        let that = this;

        let _search = e.detail.value;

        that.setData({
            search: _search
        })

        that.getdata();

    },
    confirmOrder: function(e) {
        /**
         * 收货--老接口：
         * 接口URL：/buyerMobile/order/confirmOrder
         * 交互类型：POST
         * 传入参数：
            params{
                id:1,//订单id
            }
         */

        wx.showLoading({
            title: '加载中'
        })
        let that = this;

        let _id = e.currentTarget.dataset.id; //订单ID
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ id: _id });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/order/confirmOrder',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                wx.hideLoading();
                console.log(_params)
                console.log(res)

                if (res.data.suc == 1) {

                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }
            }
        });
    }

})