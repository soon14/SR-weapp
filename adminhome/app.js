
/**
 *  @author Shirui 2018/01/08
 *  37780012@qq.com
 */
//app.js
const util = require('utils/util.js');
const config = require('config.js');
App({
    host: config.host,
    cdnhost: config.cdnhost,
    globalData: {
        userInfo: null,
        isIpx: false, //不是iPhone X
    },
    onLaunch: function() {
        let wxapp = this;
        wx.getSystemInfo({
            success: function(res) {
                if (res.model == "iPhone X") {
                    wxapp.globalData.isIpx = true;
                }
            }
        });

        wxapp.getUserInfo(function(userInfo) {
            //更新用户信息数据
            wxapp.globalData.userInfo = userInfo
        })

    },
    //获取用户信息
    getUserInfo: function(cb) {
        let that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    }

})