/**
 *  @author Shirui 2018/03/23
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
var secs = 60;
var timer = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        parentid: null, //邀请人ID
        inviteName: null, //邀请人姓名
        binddesc: '获取验证码',
        inviteCode: null, //邀请码
        vercode: null, //验证码(必填,如用户使用微信获取手机号，vercode请传字符串'empty')
        userInfo: null, //用户信息
        active: false, //是否同意
        sendCodeShow: false, //显示更换
        sedFlag: true, //验证码倒计时
        wxbindTelphone: false, //用户使用微信获取手机号 true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {

            if (options.inviteCode) { //邀请码
                this.setData({
                    inviteCode: options.inviteCode
                })
            }

        } catch (err) {
            console.log(err)
        }


        this.getUserInfo();

    },
    formSubmit(e) {
        let that = this;
        let params = e.detail.value;

        if (!that.data.active) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '未同意乐墨商家中心服务协议',
                success: function(res) {}
            });
            return;
        }

        that.bindPhone(params);
    },
    getInviteName() {
        /**
         * 获取邀请人姓名（注册页面用）：
         * 接口URL：/centerMobile/login/getInviteName
         * 交互类型：POST
         * 传入参数：
            inviteCode  邀请码
         */
        let that = this,
            params = {
                inviteCode: that.data.inviteCode //邀请码
            };

        util.ajaxRequest(
            'centerMobile/login/getInviteName',
            params,
            function(res) {

                if (res.data.status == 1) {

                    that.setData({
                        parentid: res.data.content.id,
                        inviteName: res.data.content.name
                    })

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
    // 获取用户信息
    getUserInfo: function() {
        let that = this;

        if (app.userInfo) {

            that.setData({
                userInfo: app.userInfo,
                inviteCode: app.userInfo.inviteCode
            })

            that.getInviteName(); //获取邀请人姓名

        } else {
            setTimeout(function() {

                that.getUserInfo();

            }, 1000);
        }

        console.log('getUserInfo', that.data.userInfo)

    },
    bindPhone(params) {
        /**
         * 绑定手机号（注册页面用）：
         * 接口URL：/centerMobile/login/bindPhone
         * 交互类型：POST
         * 传入参数：
            vercode          验证码(必填,如用户使用微信获取手机号，vercode请传字符串'empty')
            telphone         手机号
            name             用户昵称
            inviteCode       邀请码
            msession         用户唯一标识

            请注意 vercode 是必填项，即便使用微信获取手机号，请传字符串'empty'
         */
        let that = this;
        params.msession = wx.getStorageSync('msession');
        params.name = encodeURIComponent(params.name);
        params.inviteCode = that.data.inviteCode;

        if (that.data.wxbindTelphone) { //用户使用微信获取手机号
            params.vercode = 'empty';
        }

        util.ajaxRequest(
            'centerMobile/login/bindPhone',
            params,
            function(res) {

                if (res.data.status == 1) {

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        success: function() {
                            wx.reLaunch({
                                url: '/pages/tabBar/home/index'
                            })
                        }
                    })

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
    sendCode() {
        /**
         * 发送验证码：
         * 接口URL：/centerMobile/login/sendCode
         * 交互类型：POST
         * 传入参数：
              telphone         手机号
         */

        let that = this;
        let _telphone = that.data.userInfo.telphone;

        if (that.data.sedFlag && that.checkUserName(_telphone)) {
            that.realsend();
        } else {
            return;
        }

        let params = {
            telphone: _telphone //手机号
        };

        util.ajaxRequest(
            'centerMobile/login/sendCode',
            params,
            function(res) {
                that.setData({
                    sedFlag: true
                });

                if (res.data.status == 1) {

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        success: function() {
                            console.log(res.data.content)
                        }
                    })

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
    inputTelphone(e) {
        let userInfo = this.data.userInfo;
        userInfo.telphone = e.detail.value;
        this.setData({
            userInfo: userInfo
        })
    },
    getPhoneNumber: function(e) {
        /**
         * 解析微信绑定的手机号：
         * 接口URL：/centerMobile/login/encryptUser
         * 交互类型：POST
         * 传入参数：
                sessionkey          会话密钥
                encrypteddata       加密字符串
                iv  
         */
        this.changeSendCode();
        // console.log(e.detail.errMsg)
        // console.log(e.detail.iv)
        // console.log(e.detail.encryptedData)
        let that = this,
            userInfo = that.data.userInfo,
            params = {
                sessionkey: wx.getStorageSync('session_key'),
                encrypteddata: e.detail.encryptedData,
                iv: e.detail.iv
            };

        util.ajaxRequest(
            'centerMobile/login/encryptUser',
            params,
            function(res) {

                if (res.data.status == 1) {
                    userInfo.telphone = res.data.content.telphone;
                    that.setData({
                        userInfo: userInfo,
                        wxbindTelphone: true
                    })

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
    changeActive() {
        this.setData({
            active: !this.data.active
        })
    },
    changeSendCode() {
        this.setData({
            sendCodeShow: !this.data.sendCodeShow
        })
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
    // 倒计时
    realsend: function() {
        let that = this;
        timer = setInterval(function() {
            if (secs <= 0) {
                clearInterval(timer);
                that.setData({
                    sedFlag: true,
                    binddesc: '获取验证码'
                });
                secs = 60;
            } else {
                that.setData({
                    sedFlag: false,
                    binddesc: secs + '秒'
                });
            }
            secs--;
        }, 1000);
    },
    // ？提示信息
    explain() {
        wx.showModal({
            title: '提示',
            showCancel: false,
            content: '本服务采用邀请制，新商家需要由老商家邀请ID才可使用，否则无法注册成功。'
        });
    }
})