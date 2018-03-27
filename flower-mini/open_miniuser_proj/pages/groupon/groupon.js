/**
 *  @author Shirui 2018/03/08
 *  37780012@qq.com
 *  团购详情
 */
const md5 = require('../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({

    data: {
        cdnhost: app.cdnhost,
        list: null,
        showShare: false, //分享按钮

        id: 0,

        canshow: true,

        countDownactive: true, //倒记时开始

        alertcolumeshow: false, //规格弹出层 默认隐藏

    },
    onLoad: function(e) {

        let _id = (e.id == 'undefined' || e.id == '' || e.id == null) ? e.scene : e.id;

        this.setData({
            id: _id
        });

        this.getdata();
    },
    getdata: function() {
        /**
         * 商品详情带拼团信息
         * 接口URL：/buyerMobile/product/showProDetailByBuyer
         * 交互类型：POST
         * 传入参数：params{
                id:2953,//产品id
                shopid:204,
                openid:'o7fYO0XSco9M79b1RhiPybyOE3x4',
            }
         */
        wx.showLoading({
            title: '加载中'
        })

        let that = this;
        let _shopid = app.shopid;
        let _id = this.data.id;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ id: _id, shopid: _shopid, openid: _openid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/product/ShowProDetailByBuyer',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',

            complete: function(res) {
                wx.hideLoading();
                console.log(res);
                if (res.data.status == 1) {

                    that.setData({
                        list: res.data.content
                    });

                    that.leftTimer(res.data.content.group.end_time); //倒计时

                    wx.setNavigationBarTitle({
                        title: res.data.content.title
                    });
                } else {
                    that.setData({
                        canshow: false,
                    });
                }

            }
        });
    },
    preimg: function(e) {

        let imgsrc = e.currentTarget.dataset.src;
        let piclist = [imgsrc];

        wx.previewImage({
            current: imgsrc,
            urls: piclist
        })
    },
    // 首页
    gotohome: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    // 单买去详情页
    godetail: function() {
        let _id = this.data.list.id;

        wx.navigateTo({
            url: '/pages/details/details?id=' + _id
        });

    },
    onShareAppMessage: function(res) {
        console.log(res);
        let _title = this.data.list.title;
        let _id = this.data.list.id;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: _title,
            path: 'pages/details/details?id=' + _id,
            success: function(res) {
                console.log('转发成功')
            },
            fail: function(res) {
                console.log('转发失败')
            }
        }

    },
    //分享
    shareImage: function() {

        this.showShare();

        let openid = wx.getStorageSync('openid');
        let id = this.data.id;
        let urls = [app.host + '/buyerMobile/shop/getProductPoster/shopid/' + app.shopid + '/id/' + id + '/openid/' + openid + '/random/' + Math.random()];

        wx.previewImage({
            urls: urls // 需要预览的图片http链接列表
        })

    },
    //分享按钮显示
    showShare: function() {
        this.setData({
            showShare: !this.data.showShare
        })
    },
    formSubmit: function() {
        let _id = this.data.id;
        wx.navigateTo({
            url: '/pages/groupon/grouponOrder/grouponOrder?id=' + _id + '&cantuan=0'
        })
    },
    // 倒计时
    leftTimer: function(Endtime) {
        let that = this;

        setInterval(function() {
            if (that.data.countDownactive) {
                countDown(Endtime); //倒计时
            }
        }, 1000)


        function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function countDown(Endtime) {

            let nowTime = new Date().getTime(); //当前时间毫秒

            let end_time = String(Endtime); //结束时间

            if (end_time.length == 10) { //php时间戳是秒 10位数  js是毫秒13位
                end_time = parseInt(end_time) * 1000;
            }

            if (end_time <= nowTime) {

                let countDown = {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                }

                that.setData({
                    countDown: countDown,
                    countDownactive: false //倒记时停止
                })

                return;
            }

            let leftTime = end_time - nowTime; //计算剩余的毫秒数 

            let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
            let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
            let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
            let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 

            days = checkTime(days);
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);

            let countDown = {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
            that.setData({
                countDown: countDown
            })
        }

    },
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    }

})