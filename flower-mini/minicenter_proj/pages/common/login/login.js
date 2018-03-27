/**
 *  @author Shirui 2018/02/05
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {

    },
    //获取手机号
    getPhoneNumber: function(e) {
        console.log(app.globalData.userInfo.telphone)
        if (app.globalData.userInfo.telphone) {
            wx.reLaunch({
                url: '/pages/tabBar/index/index'
            })
            return;
        }

        let that = this;
        let _openid = wx.getStorageSync('openid');
        let session_key = wx.getStorageSync('session_key');

        let params = {
            openid: _openid,
            sessionkey: session_key,
            iv: e.detail.iv,
            encrypteddata: e.detail.encryptedData,
        };

        util.ajaxRequest(
            'buyerMobile/wxuser/decodeData',
            params,
            function(res) {

                if (res.data.suc == 1) {

                    if (!res.data.info.purePhoneNumber) {
                        console.log('暂无绑定手机号');

                        app.bindphone();

                        return
                    }

                    app.globalData.telphone = res.data.info.purePhoneNumber;

                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '注册/登陆成功',
                        success: function(res) {
                            wx.reLaunch({
                                url: '/pages/tabBar/index/index'
                            })
                        }
                    })

                } else {
                    console.log(res.data.msg);
                }


            });

    }
})