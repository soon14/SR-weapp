/**
 *  @author Shirui 2018/01/26
 *  37780012@qq.com
 */
// 单条评论
const md5 = require('../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        list: null,

        markers: null,

        maxheight: 0,

        video: {
            rate_w: 750, //视频宽度
            rate_h: 420, //视频高度
        },

        getComment: null,

        commentid: null,
    },
    onLoad: function(options) {
        let that = this;

        let commentid = options.scene;

        if (commentid > 0) {
            that.setData({
                commentid: options.scene
            });
        }

        that.getdata();

        that.getComment(); //评论区域列表
    },
    getdata: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        let that = this;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ shopid: app.shopid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/shop/getShopById',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res)
                wx.hideToast();
                let video = that.data.video;
                let video2 = res.data.shopinfo.video;

                if (video2.width > 0 && video2.height > 0) {
                    video = video2;
                }

                that.setData({
                    list: res.data.shopinfo,
                    video: video,
                    markers: [{
                        iconPath: "/images/nav.png",
                        id: 0,
                        latitude: res.data.shopinfo.latitude,
                        longitude: res.data.shopinfo.longitude,
                        width: 100,
                        height: 92
                    }]
                });
            }
        });
    },
    // 打电话
    phonecall: function() {
        let that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.list.telphone
        })
    },
    // 查看地图
    markertap: function(e) {
        let that = this;
        wx.openLocation({
            latitude: parseFloat(that.data.list.latitude),
            longitude: parseFloat(that.data.list.longitude),
            name: that.data.list.name,
            address: that.data.list.address,
            scale: 18
        })
    },
    // 单条评论
    getComment: function() {
        /**
         * 单条评论
         * buyerMobile/comments/getComment
         * 参数 {commentid:1}
         */
        let that = this;

        let _commentid = that.data.commentid;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            openid: _openid,
            shopid: app.shopid,
            commentid: _commentid
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/comments/getComment',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                console.log(_params)
                console.log(res)
                if (res.data.suc == 1) {
                    that.setData({
                        getComment: res.data.content
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            }
        });
    },
    // 去首页
    goHome: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    // 点赞
    up: function(e) {
        let openid = wx.getStorageSync('openid');
        let commentid = e.currentTarget.dataset.commentid;

        let that = this;
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            openid: openid,
            commentid: commentid
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/comments/up',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res)
                if (res.data.suc == 1) {

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 1000,
                        success: function() {
                            // 点赞成功刷新
                            that.getComment();
                        }
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            }
        });
    },
    //预览评论图片
    preview: function(e) {
        let src = e.currentTarget.dataset.src;
        let urls = [app.host + src];

        wx.previewImage({
            urls: urls // 需要预览的图片http链接列表
        })
    },
    onPullDownRefresh: function() {
        this.getdata();
        this.getComment();
        wx.stopPullDownRefresh();
    }
})