/**
 * 订单提醒手机号
 * Created by SR on 2017/12/19.
 * 37780012@qq.com
 */
var utils = require("../../../utils/util.js");
var app = getApp();
Page({
    data: {
        msession: null,
        shopid: null,
        telphone: ''
    },
    onLoad: function(options) {
        let _msession = wx.getStorageSync('msession') || '';
        let _shopid = wx.getStorageSync('shopid') || '';
        this.setData({
            msession: _msession,
            shopid: _shopid
        });
        this.getdata();
    },
    // 功能点:展示订单提醒手机号
    getdata: function() {
        let that = this;
        let _shopid = that.data.shopid;
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/shopadmin/showOrderTel',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        telphone: res.data.content
                    });
                }
            })
    },
    /**
     * [getPhoneNum 获取手机号]
     *  @param  {[type]} e [description]
     */
    getTelphone: function(e) {
        this.setData({
            telphone: e.detail.value
        });
    },
    /**
     * [checkTelphone 正则检测输入手机号]
     * @param  {[type]} telphone [输入的手机号]
     */
    checkTelphone: function(telphone) {
        let phone = utils.regexConfig().phone; //验证手机号正则
        let inputTelphone = telphone.trim();

        if (phone.test(inputTelphone)) {
            return true;
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入正确的手机号码'
            });
            return false;
        }
    },
    /**
     * 功能点:设置订单提醒手机
     * 参数 msession,shopid,telphone
     */
    setOrderTel: function() {
        let that = this;
        let _telphone = that.data.telphone;
        
        if (that.checkTelphone(_telphone)) {
            let _msession = that.data.msession;
            let _shopid = that.data.shopid;
            let params = { msession: _msession, shopid: _shopid, telphone: _telphone };

            utils.ajaxRequest(
                'shopMobile/shopadmin/setOrderTel',
                params,
                function(res) {
                    if (res.data.status == 1) {
                        setTimeout(function() {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'success',
                                duration: 1000
                            });

                        }, 1500);
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: res.data.msg,
                            showCancel: false
                        })
                    }
                });
        }
    }

})