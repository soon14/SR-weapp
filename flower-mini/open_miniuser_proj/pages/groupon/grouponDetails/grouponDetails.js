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

        countDownactive: true, //开始倒计时

        orderid: null, //订单id
        group_item_id: null, //成团id 

    },
    onLoad: function(options) {
        this.setData({
            group_item_id: options.group_item_id || null,
            orderid: options.orderid || null
        })
    },
    onShow: function() {
        this.getdata();
    },
    getdata: function() {
        /**
         * 获取购物团信息——参团页面：
         * 接口URL：/buyerMobile/groupItem/getGroupItem
         * 交互类型：POST
         * 传入参数：
                params{
                    groupitemid:1,//成团id，用户转发出去的页面携带的id
                }
         */
        wx.showLoading({
            title: '加载中'
        })
        let that = this;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ groupitemid: that.data.group_item_id });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/groupItem/getGroupItem',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                wx.hideLoading();
                console.log(_params)
                console.log(res)
                if (res.data.suc == 1) {
                    let list = res.data.info;

                    that.setData({
                        list: list
                    })

                    that.leftTimer(list.lasttime);

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
    // 倒计时
    leftTimer: function(lasttime) {
        // lasttime 秒
        let that = this;

        setInterval(function() {
            if (that.data.countDownactive) {
                countDown(lasttime); //倒计时
            }
        }, 1000)


        function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function countDown(lasttime) {

            let nowTime = new Date().getTime(); //当前时间毫秒

            let end_time = String(lasttime); //结束时间

            if (end_time.length == 10) { //php时间戳是秒 10位数  js是毫秒13位
                end_time = parseInt(end_time) * 1000;
            }

            if (end_time <= nowTime) {

                let countDown = {
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
                }

                that.setData({
                    countDown: countDown,
                    countDownactive: false //倒记时停止
                })

                return;
            }

            let leftTime = end_time - nowTime; //计算剩余的毫秒数 

            let hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算剩余的小时 
            let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
            let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 

            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);

            let countDown = {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }

            that.setData({
                countDown: countDown
            })

        }

    },
    // 我要参团
    iWantToTour: function() {
        let _id = this.data.list.product_id;
        let group_item_id = this.data.group_item_id;
        wx.navigateTo({
            url: '/pages/groupon/grouponOrder/grouponOrder?id=' + _id + '&group_item_id=' + group_item_id + '&cantuan=1'
        })
    },
    // 邀请参团
    onShareAppMessage: function(res) {
        let group_item_id = this.data.group_item_id; //成团id，用户转发出去的页面携带的id

        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/pages/groupon/grouponDetails/grouponDetails?group_item_id=' + group_item_id,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    // 去店铺逛逛
    goIndex: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    // 查看订单详情
    watchOrder: function() {
        let orderid = this.data.orderid;
        wx.navigateTo({
            url: '/pages/groupon/grouponOrderDetails/grouponOrderDetails?orderid=' + orderid
        })
    },


})