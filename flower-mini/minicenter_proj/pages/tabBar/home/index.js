/**
 *  @author Shirui 2018/03/20
 *  37780012@qq.com
 */
//index.js
const config = require('../../../config.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        userInfo: null,
        timeEd: null, //过期时间

    },
    onLoad: function(options) {

        let that = this;

        that.getUserInfo();

    },
    onShow: function() {},
    // 获取用户信息
    getUserInfo: function() {
        let that = this;

        if (app.userInfo) {

            that.setData({
                userInfo: app.userInfo
            })

            // 有到期时间
            if (app.userInfo.expire_in) {
                try {
                    let timeEd = util.formatTime(app.userInfo.expire_in);
                    that.setData({
                        timeEd: timeEd
                    })
                } catch (err) { console.log(err) }
            }

        } else {
            setTimeout(function() {
                that.getUserInfo();
            }, 1000);
        }

    },
    //乐墨学堂
    bindlemoxuetang: function() {
        //打开乐墨学堂小程序
        wx.navigateToMiniProgram({
            appId: config.lmxtAppId,
            path: '', //打开的页面路径，如果为空则打开首页
            extraData: {
                // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
            },
            success(res) {
                console.log(res)
                // 打开成功
            },
            fail(res) {
                //接口调用失败的回调函数
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.errMsg,
                    success: function(res) {}
                })

            }
        })
    },
    // 邀请好友
    invitation() {
        wx.navigateTo({
            url: '/pages/component/invitation/invitation'
        })
    },
    // 余额
    goMyBalance() {
        wx.navigateTo({
            url: '/pages/component/myBalance/myBalance'
        })
    },
    //乐墨花时光
    bindlemohuashiguang: function() {
        //打开乐墨花时光小程序
        wx.navigateToMiniProgram({
            appId: config.miniadminAppId,
            path: '', //打开的页面路径，如果为空则打开首页
            extraData: {
                // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
            },
            success(res) {
                console.log(res)
                // 打开成功
            },
            fail(res) {
                //接口调用失败的回调函数
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.errMsg,
                    success: function(res) {}
                })

            }
        })
    },
    // 花艺大师
    floriculture: function() {
        wx.navigateTo({
            url: '/floriculture/pages/case/case'
        })
    },
    onPullDownRefresh: function() {

        this.getUserInfo();

        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {

    }
})