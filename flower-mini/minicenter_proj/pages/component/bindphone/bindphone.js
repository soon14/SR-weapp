/**
 *  @author Shirui 2018/02/02
 *  37780012@qq.com
 */
const util = require("../../../utils/util.js");
const app = getApp();
var secs = 60;
var timer = null;
Page({
    data: {
        binddesc: '',
        cando: false,
        telphone: '',
        isbind: false,
        useflag: ''
    },

    onLoad: function() {
        this.setData({
            binddesc: '获取验证码'
        });
        this.getdata();
    },
    getdata: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let params = { msession: _msession };

        util.ajaxRequest(
            'shopMobile/invite/getMember',
            params,
            function(res) {

                if (res.data.status == 1) {
                    let _telphone;
                    let _isbind = false;

                    try {
                        _telphone = res.data.content.telphone;
                    } catch (err) {
                        _telphone = '';
                    }

                    if (_telphone != '' && _telphone != null) {
                        _isbind = true;
                    }

                    that.setData({
                        telphone: _telphone,
                        isbind: _isbind
                    });

                    if (_telphone.length == 11) {
                        that.setData({
                            cando: true
                        });
                    }
                } else {
                    console.log(res.data.msg)
                }

            });
    },
    inputnum: function(e) {
        let v = e.detail.value;
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
    // 正则检测输入手机号
    checkUserName: function(param) {
        let phone = util.regexConfig().phone; //验证手机号正则
        let inputUserName = param.trim();
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
    sendcode: function(e) {
        // console.info(e);
        let that = this;
        let _telphone = that.data.telphone;

        if (that.data.cando && that.checkUserName(_telphone)) {
            that.realsend();
        }

    },
    formSubmit: function(e) {
        let _telphone = e.detail.value.telphone;
        let _vercode = e.detail.value.vercode;
        let _msession = wx.getStorageSync('msession');
        let params = { msession: _msession, telphone: _telphone, vercode: _vercode };

        util.ajaxRequest(
            'shopMobile/login/bindPhone',
            params,
            function(res) {
                if (res.data.status == 1) {

                    app.globalData.userInfo.telphone = _telphone;

                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {
                            // wx.navigateBack({delta: 1});
                            wx.reLaunch({
                                url: '/pages/tabBar/index/index'
                            })
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            });


    },
    realsend: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _telphone = that.data.telphone;
        let params = { msession: _msession, telphone: _telphone };

        util.ajaxRequest(
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
    },
    changePhone: function() {
        wx.navigateTo({
            url: '/pages/component/changebindphone/changebindphone'
        })
    }




})