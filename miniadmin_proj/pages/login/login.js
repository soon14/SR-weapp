var md5 = require('../../utils/md5.js');
var utils = require("../../utils/util.js");
var app = getApp();
var _msession = wx.getStorageSync('msession');

Page({
    data: {

        applyBtnTxt: "申请",
        loginBtnTxt: "登陆",
        verificationBtnTxt: "验证",
        loginUrl: "/pages/more/helpdetails/helpdetails",
        getSmsCodeBtnTxt: "获取验证码",
        getSmsCodeBtnColor: "#d4d2d4",
        smsCodeBorderBottom: '1px solid #d4d2d4',

        shopinfo: null,
        logo: '',
        shopid: 0,
        code: '',
        telphone: '',
        state: '',
        codeActive: '',
        PhoneActive: '',

        smsCodeDisabled: true,
        submitDisabled: true,

        phoneNum: '' //手机号

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        // 查看是否获取用户信息。 获取了用户信息才能登陆
        wx.getSetting({

            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '用户信息未授权，无法进行使用，点击授权进行设置',
                        cancelText: '取消',
                        confirmText: '授权',
                        success: function(res) {
                            if (res.confirm) {

                                wx.openSetting({
                                    success: (res) => {

                                        wx.reLaunch({ url: '/pages/login/login' });
                                    }
                                })
                            } else if (res.cancel) {

                                wx.reLaunch({ url: '/pages/index/index?error=1' });
                            }
                        }
                    })
                }
            }
        })

    },
    onReady: function() {
        // 页面渲染完成

    },
    onShow: function() {
        // 页面显示

    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    },
    //  清除号码
    foo: function() {
        this.setData({
            phoneNum: '',
            getSmsCodeBtnColor: "#d4d2d4",
            smsCodeDisabled: true,
            PhoneActive: '',
            codeActive: ''

        });
        return;
    },
    initiateRegistration: function() {
        wx.navigateTo({
            url: this.data.loginUrl
        });
    },
    formSubmit: function(e) { //提交
        var that = this;
        var params = e.detail.value;

        if (that.checkUserName(params.telphone) && that.checkSmsCode(params)) {

            that.loginbytelphone(params);
        }

    },
    // 所需参数telphone code
    // 返回值json格式，res.success res.msg res.telphone res.shopid
    loginbytelphone: function(params) {
        var that = this;
        var params = params;
        utils.ajaxRequest(
            'shopMobile/login/onlyLoginByTelphoneNew',
            params,
            function(res) {

                if (res.data.status == 1) {

                    var _telphone = res.data.content.telphone;
                    var _shopid = res.data.content.shopid;
                    var _msession = res.data.content.msession;

                    that.setData({
                        telphone: _telphone,
                        shopid: _shopid,
                        msession: _msession
                    });

                    wx.setStorageSync('msession', _msession);
                    wx.setStorageSync('shopid', _shopid);
                    wx.setStorageSync('telphone', _telphone);

                    if (_shopid > 0) {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    } else {
                        wx.reLaunch({
                            url: '/pages/more/storeSwitching/storeSwitching'
                        })
                    }

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg
                    });
                }
            });
    },
    getPhoneNum: function(e) {

        var phoneNum = e.detail.value;
        this.setData({
            phoneNum: phoneNum
        });
        if (phoneNum.length > 0) {
            this.setData({
                PhoneActive: 'active'
            });
        } else {
            this.setData({
                PhoneActive: ''
            });
        }
        if (phoneNum.length == 11) {
            this.setData({
                getSmsCodeBtnColor: '#4f9dd0',
                smsCodeDisabled: false,
                codeActive: 'active'
            });
        } else {
            this.setData({
                getSmsCodeBtnColor: '#d4d2d4',
                smsCodeDisabled: true,
                codeActive: ''
            });
        }
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
    // 检测返回手机号和当前手机号是否相同
    checkTelphone: function(param) {
        var telphone = that.data.telphone;
        if (telphone == param) {
            return true;
        } else {
            return false;
        }

    },
    // 所需参数telphone
    // 返回值json格式，res.success res.msg
    getCode: function(telphone) {

        var that = this;
        var params = { 'telphone': telphone };

        utils.ajaxRequest(
            'shopMobile/login/onlyLoginSendCode',
            params,
            function(res) {
                var state = res.data.status;
                var code = res.data.content.code;

                if (state == 1) {

                    that.setData({
                        smsCodeBorderBottom: "1px solid #4f9dd0",
                        code: code,
                        submitDisabled: false
                    });

                    setTimeout(function() {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1500
                        });
                    }, 2000);

                } else {
                    that.setData({
                        smsCodeBorderBottom: "1px solid #d4d2d4",
                        submitDisabled: true
                    });
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg
                    });
                }
            });
    },
    // 发送验证码
    getSmsCode: function() {
        var phoneNum = this.data.phoneNum;
        var that = this;
        var count = 60;

        if (!that.data.smsCodeDisabled && this.checkUserName(phoneNum)) {

            that.getCode(phoneNum);

            var si = setInterval(function() {

                    if (count > 0) {

                        that.setData({
                            getSmsCodeBtnTxt: count + ' s',
                            getSmsCodeBtnColor: "#d4d2d4",
                            smsCodeDisabled: true
                        });
                        count--;

                    } else {

                        that.setData({
                            getSmsCodeBtnTxt: "获取验证码",
                            getSmsCodeBtnColor: "#1AAD19",
                            smsCodeDisabled: false
                        });

                        count = 60;
                        clearInterval(si);
                    }
                },
                1000);



        }

    },
    //判断验证码
    checkSmsCode: function(param) {
        var that = this;
        var smsCode = param.code;
        // var tempSmsCode = that.data.code;
        if (smsCode.length == 4) {
            return true;
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入正确的短信验证码'
            });
            return false;
        }
    },

    alertblank: function() {
        this.setData({
            txt: '您还没有管理权限\n请联系机器人申请开通!'
        });

    }

})