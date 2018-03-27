/**
 *  @author Shirui 2018/02/23
 *  37780012@qq.com
 *  拼团详情
 */
const md5 = require('../../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,
        list: null,
        status: 1, //订单状态 未付款

        orderid: null, //订单id
    },
    onLoad: function (options) {
        let that = this;

        that.setData({
            orderid: options.orderid
        })

        that.getdata();
    },
    getdata: function () {
        /**
         * 个人拼团订单
         * 接口URL：/buyerMobile/groupItem/getOneGroupInfo
         * 交互类型：GET
         * 传入参数：
            params{
                orderid:1,//订单id
            }

            group.status 状态
                1 未付款
                2 已付款，待成团
                3 已成团
                4 待收货
                5 已完成
                6 拼团失败
         */
        wx.showLoading({
            title: '加载中'
        })
        let that = this;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            orderid: that.data.orderid
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/groupItem/getOneGroupInfo',
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
            success: function (res) {
                wx.hideLoading();
                console.log(_params)
                console.log(res)

                if (res.data.suc == 1) {

                    let list = res.data.info;
                    that.setData({
                        list: list,
                        status: list.group.status,
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {}
                    });
                }
            }
        });
    },
    makePhoneCall: function () {
        let _phoneNumber = list.leaderinfo.ftelphone;
        wx.makePhoneCall({
            phoneNumber: _phoneNumber
        })
    },
    watchGroupMember: function () {
        let _groupitemid = this.data.list.group_item_id; //订单成团ID
        wx.navigateTo({
            url: '/pages/groupon/groupMember/groupMember?groupitemid=' + _groupitemid
        });
    },
    confirmOrder: function () {
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

        let _id = that.data.orderid;
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            id: _id
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/order/confirmOrder',
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
            success: function (res) {
                wx.hideLoading();
                // console.log(_params)
                // console.log(res)

                if (res.data.suc == 1) {

                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {}
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {}
                    });
                }
            }
        });
    }

})