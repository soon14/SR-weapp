/**
 * Created by SR on 2017/9/25.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        myInviteData: null,
        list: null,

        isShow: false,
        focus: false,
        goup: false,

        remindid: null,
        nickname: null,
        memberid: null,

        yuanlist: [], //无用
    },
    onLoad: function(options) {
        console.log(options);
    },
    onShow: function(options) {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#39a1db',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
        let yuanlist = [];
        yuanlist.length = 20;
        this.setData({
            yuanlist: yuanlist
        });

        this.getdata();

    },
    getdata: function() {
        /*
        shopMobile/invite/myInvite
        参数msession
         */
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let params = { msession: _msession };
        utils.ajaxRequest(
            'shopMobile/invite/myInvite',
            params,
            function(res) {
                if (res.data.status == 1) {

                    that.setData({
                        myInviteData: res.data.content,
                        nickname: res.data.content.nickname,
                        memberid: res.data.content.memberid,
                        list: res.data.content.list
                    });
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
    //显示弹窗
    bindremind: function(e) {
        let remindid = e.target.dataset.id;
        let that = this;
        that.setData({
            remindid: remindid,
            isShow: true
        })
    },
    //获取焦点
    bindfocus: function() {
        this.setData({
            focus: true
        })
    },
    //失去焦点
    bindblur: function() {
        this.setData({
            focus: false
        })
    },
    //输入
    bindinput: function(e) {
        this.setData({
            nickname: e.detail.value
        })
    },
    //取消发送
    closesed: function() {
        this.setData({
            isShow: false
        })
    },
    //上下隐藏
    goup: function() {
        this.setData({
            goup: !this.data.goup
        })
    },
    //发送
    sed: function() {
        /*
        提醒
        shopMobile/invite/remind,
        参数 msession,remindid,nickname
         */
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _remindid = that.data.remindid;
        let _nickname = encodeURIComponent(that.data.nickname);
        let params = { msession: _msession, remindid: _remindid, nickname: _nickname };

        utils.ajaxRequest(
            'shopMobile/invite/remind',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        isshow: false
                    });

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
    //转发
    onShareAppMessage: function(res) {
        let that = this;
        let nickname = that.data.nickname;
        let memberid = that.data.memberid;
        // console.log(nickname);
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: nickname + '推荐你使用乐墨花时光',
            path: '/pages/more/invitingAwards/invitingAwards?id=' + memberid,
            success: function(res) {
                // 转发成功
                console.log(res)
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }

})