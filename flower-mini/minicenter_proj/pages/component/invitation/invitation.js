/**
 *  @author Shirui 2018/02/01
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        showRemind: false,
        showhelp: false,

        myInviteList: null,

        nickname: null,
        remindid: null,
        inputValue: null,
    },
    onLoad: function(options) {
        this.getdata();
    },
    onShow: function() {

    },
    getdata: function() {
        /**
         * 邀请好友关系列表
         * shopMobile/invite/myInvite
         * 参数 {msession:'asdfasdfasfdadsf'}
         */
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let params = { msession: _msession };

        util.ajaxRequest(
            'shopMobile/invite/myInvite',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        myInviteList: res.data.content
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            try {
                                // 清楚本地缓存
                                wx.clearStorageSync()
                            } catch (e) {
                                console.log(e)
                            }
                            app.auth();
                            that.getdata();
                        }
                    })
                }

            });
    },
    // help
    showHelp() {
        let that = this;
        that.setData({
            showhelp: !that.data.showhelp
        })
    },
    // 提醒
    showRemind(e) {
        let _nickname = e.currentTarget.dataset.nickname;
        let _remindid = e.currentTarget.dataset.remindid;
        let _msession = wx.getStorageSync('msession');

        this.setData({
            nickname: _nickname,
            remindid: _remindid,
        })

        this.close();

    },
    remind: function() {
        /**
         * 邀请好友-----立即提醒 
         * shopMobile/invite/remind 
         * 参数 {msession:'asdfasfdasfd',remindid:'1',nickname:'张三'}
         */
        let that = this;
        let _nickname = encodeURIComponent(that.data.inputValue);
        let _remindid = that.data.remindid;
        let _msession = wx.getStorageSync('msession');

        let params = { msession: _msession, remindid: _remindid, nickname: _nickname };

        util.ajaxRequest(
            'shopMobile/invite/remind',
            params,
            function(res) {
                if (res.data.status == 1) {

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })

                    that.close();
                    that.getdata();

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }

            });

    },
    // close
    close() {
        let that = this;
        that.setData({
            showRemind: !that.data.showRemind
        })
    },
    remindinput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    // 邀请好友
    invitation: function() {
        /**
         * 邀请海报
         * 直接请求生成图片展示 
         * https://ilearnmore.net/shopMobile/orderCrontab/invitePoster/msession/+{{msession}}
         */
        let _msession = wx.getStorageSync('msession');
        let urls = [app.host + 'shopMobile/orderCrontab/invitePoster/msession/' + _msession];

        wx.previewImage({
            urls: urls // 需要预览的图片http链接列表
        })

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    }
})