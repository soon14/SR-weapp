/**
 *  @author Shirui 2018/03/20
 *  37780012@qq.com
 */
//app.js
const util = require('utils/util.js');
const config = require('config.js');
App({
    host: config.host,
    cdnhost: config.cdnhost,
    shopkey: config.shopkey,
    msession: '', //用户的msession 唯一标示
    userInfo: null, //用户信息
    globalData: {
        isIpx: false, //不是iPhone X
    },
    onLaunch: function() {
        let wxapp = this;
        wxapp.getSystemInfo();

        //这是个坑，小程序初始化需要时间，getApp()需要等半秒执行，才保险！
        setTimeout(function() {
            wxapp.auth();
        }, 500);
    },
    // 获取设备信息
    getSystemInfo: function() {
        let that = this;
        wx.getSystemInfo({
            success: function(res) {
                if (res.model == "iPhone X") {
                    that.globalData.isIpx = true;
                }
            }
        });
    },
    // 初始化 授权 获取所需数据
    auth: function() {
        let that = this;
        let _msession = '';

        try {
            //当小程序初始化完成时调用API从本地缓存中获取数据
            _msession = wx.getStorageSync('msession') || '';

            //当小程序初始化完成时从本地缓存中获取数据进行本地缓存
            wx.setStorageSync('msession', _msession);
            that.msession = _msession;

        } catch (err) {
            console.log(err);
        }

        if (_msession) {
            console.log('有msession', _msession);
            let params = { msession: _msession };
            that.getMember(params);

        } else {
            console.log('没有msession');
            //调用登录接口重新登录
            that.login();
        }
    },
    getMember: function(params) {
        /**
         *  商家中心 
         *  有msesssion获取用户信息
         *  shopMobile/invite/getMember
         *  参数 {msesssion:''}
         */
        let that = this;
        util.ajaxRequest(
            'centerMobile/login/getMemberInfo',
            params,
            function(res) {
                console.log('首页获取用户信息', res.data.content);
                if (res.data.status == 1) {

                    //进行数据本地缓存
                    let _content = res.data.content;
                    wx.setStorageSync('msession', _content.msession);
                    that.userInfo = _content;
                    that.msession = _content.msession;

                    //这里没有拿到手机号，跳转到手机号绑定页面
                    if (!_content.telphone) {
                        that.bindphone();
                        return;
                    }

                } else {

                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            try {
                                // 清楚本地缓存
                                wx.clearStorageSync();
                            } catch (e) {
                                console.log(e)
                            }

                            that.auth();
                        }
                    })

                }
            });
    },
    // 登陆获取 code
    login: function() {
        let that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    // console.log('code', res.code);
                    let param = { code: res.code };
                    that.codeGetInfo(param); //换取SessionKey
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                }
            }
        });
    },
    codeGetInfo: function(params) {
        /**
         * 商家中心 
         * code换取sessionkey
         * 接口URL：/centerMobile/login/code
         * 交互类型：POST
         * 传入参数：
         * code     用户登录凭证
         */
        let that = this;
        util.ajaxRequest(
            'centerMobile/login/code',
            params,
            function(res) {
                // console.log('换取SessionKey', res.data);
                wx.setStorageSync('unionid', res.data.unionid);
                wx.setStorageSync('openid', res.data.openid);
                wx.setStorageSync('session_key', res.data.session_key);

                that.getUserInfo(res.data.session_key);
            });
    },
    // 获取用户信息
    getUserInfo: function(session_key) {
        /**
         * 发起网络请求 发送完整用户信息的加密数据给后端 获取解密的用户信息
         * 登录参数配置
         * res.iv 加密算法的初始向量
         * res.encryptedData 包括敏感数据在内的完整用户信息的加密数据
         * success(res) 登录成功后的回调函数，参数 res 微信用户信息
         * fail(error) 登录失败后的回调函数，参数 error 错误信息
         */
        let that = this;

        wx.getUserInfo({
            success: function(res) {

                let params = { sessionkey: session_key, encrypteddata: res.encryptedData, iv: res.iv };

                that.newMember(params);

            },
            fail: function() {
                console.log('获取用户信息失败！');

                wx.hideLoading();

                wx.showModal({
                    title: '温馨提示',
                    content: '请授权完成后再继续使用',
                    showCancel: false,
                    confirmText: '授权',
                    success: function(res) {
                        if (res.confirm) {

                            wx.openSetting({
                                success: (res) => {
                                    that.auth();
                                }
                            });

                        }
                    }
                });
            }
        })
    },
    newMember: function(params) {
        /**
         * 商家中心
         * 用户登录：
         * 接口URL：/centerMobile/login/index
         * 交互类型：POST
         * 传入参数：
         * sessionkey          会话密钥
         * encrypteddata       加密字符串
         * iv                  加密算法的初始向量
         */
        let that = this;

        util.ajaxRequest(
            'centerMobile/login/index',
            params,
            function(res) {

                if (res.data.status == 1) {
                    //进行数据本地缓存
                    let _content = res.data.content;
                    wx.setStorageSync('msession', _content.msession);
                    that.userInfo = _content;
                    that.msession = _content.msession; //用户的msession 唯一标示

                    //用户的手机号 可能为空 为空需要强制跳转到绑定页面
                    if (!_content.telphone) {
                        that.bindphone();
                        return;
                    }

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            that.auth();
                        }
                    })
                }
            });
    },
    // 去绑定手机号
    bindphone: function() {
        wx.reLaunch({
            url: '/pages/component/register/register'
        })
    },
    getTimeStamp() {
        return parseInt(new Date().getTime() / 1000);
    }

})