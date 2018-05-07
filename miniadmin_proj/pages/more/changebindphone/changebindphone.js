var md5 = require('../../../utils/md5.js');
var utils = require("../../../utils/util.js");
var app = getApp();
var secs = 60;
var timer = null;
Page({
    data: {
        binddesc: '',
        cando: false,
        telphone: '',
        useflag: ''
    },

    onLoad: function() {
        this.setData({
            binddesc: '获取验证码'
        });

    },
    // 正则检测输入手机号
    checkUserName: function(param) {
        var phone = utils.regexConfig().phone; //验证手机号正则
        var inputUserName = param.trim();
        if (phone.test(inputUserName)) {
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
    inputnum: function(e) {
        var v = e.detail.value;

        this.setData({
            telphone: v
        });
        if (v.length == 11) {
            this.setData({
                cando: true
            });
        } else {
            this.setData({
                cando: false
            });
        }
    },
    formSubmit: function(e) {
        var _telphone = e.detail.value.telphone;
        var _vercode = e.detail.value.vercode;
        var _msession = wx.getStorageSync('msession');
        var params = { msession: _msession, telphone: _telphone, vercode: _vercode };

        utils.ajaxRequest(
            'shopMobile/login/bindPhone',
            params,
            function(res) {
                var s = res.data.status;
                if (s == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                } else if (s == 1) {
                    wx.navigateBack({ delta: 1 });
                }
            });
    },
    sendcode: function(e) {
        // console.info(e);
        var that = this;
        var _telphone = that.data.telphone;
        if (that.data.cando && that.checkUserName(_telphone)) {
            that.realsend();
        }
    },
    realsend: function() {
        var that = this;
        var _msession = wx.getStorageSync('msession');
        var _telphone = that.data.telphone;
        var params = { msession: _msession, telphone: _telphone };

        utils.ajaxRequest(
            'shopMobile/login/sendCodeNew',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        useflag: 'true'
                    });
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    if (res.data.content.use == 1) {
                        that.setData({
                            useflag: 'false'
                        });
                    } else {
                        that.setData({
                            useflag: 'true'
                        });
                    }
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                }

                if (that.data.useflag == 'true') {
                    timer = setInterval(function() {

                        if (secs <= 0) {
                            clearInterval(timer);
                            that.setData({
                                cando: true,
                                binddesc: '获取验证码'
                            });
                            secs = 60;
                        } else {

                            that.setData({
                                cando: false,
                                binddesc: secs + '秒'
                            });
                        }
                        secs--;
                    }, 1000);
                }

            });
    }

})