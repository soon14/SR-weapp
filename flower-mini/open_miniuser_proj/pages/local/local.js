/**
 *  @author Shirui 2018/01/24
 *  37780012@qq.com
 */
const md5 = require('../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        list: null,

        serviceslist: null, //店铺服务列表

        markers: null,

        maxheight: 0,
        isshow: false,

        video: {
            rate_w: 750, //视频宽度
            rate_h: 420, //视频高度
        },

        page: 1,
        totalpage: 1, //最大页数
        limit: 10,

        getcommentsList: null,
        state: 2, // 1新评论 2展示

        cancomment: 0, //是否可以评论
    },
    onLoad: function() {
        let that = this;

        that.getdata();

        that.getCommentsList(); //评论区域列表
    },
    onShow: function() {},
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
                    isshow: true,
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

        /*
        buyerMobile/shop/getServicesByShopid
        门店服务以及店铺信息
        */

        wx.request({
            url: app.host + '/buyerMobile/shop/getServicesByShopid',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res)
                wx.hideToast();
                if (res.data.status == 1) {
                    that.setData({
                        serviceslist: res.data.content.services
                    });
                }
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
    // 去评价
    goEvaluate: function() {
        let that = this;
        let cancomment = that.data.cancomment;

        if (cancomment == 0) {

            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '买过花才能发表评价哦！',
                success: function(res) {}
            })
            return;

        } else {

            wx.navigateTo({
                url: '/pages/local/evaluationManagement/evaluationManagement'
            })

        }

    },
    // 评论区域列表
    getCommentsList: function() {
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            openid: _openid,
            shopid: app.shopid,
            page: that.data.page,
            limit: that.data.limit,
            state: 2
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/comments/getCommentsList',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                console.log(res)
                if (res.data.suc == 1) {
                    let _list = [];
                    let _page = that.data.page;

                    if (_page > 1) {
                        _list = that.data.getcommentsList.concat(res.data.content.lists);
                    } else if (_page == 1) {
                        _list = res.data.content.lists
                    }

                    that.setData({
                        getcommentsList: _list,
                        totalpage: res.data.content.totalpage,
                        cancomment: res.data.content.cancomment,
                    });

                } else {
                    console.log(res.data.msg)
                }
            }
        });
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
                        duration: 1000
                    })
                    setTimeout(function() {
                        that.setData({
                            page: 1,
                        });
                        // 点赞成功刷新
                        that.getCommentsList();
                    }, 1000);

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
    //预览
    previewImage: function(e) {
        let openid = e.currentTarget.dataset.openid;
        let id = e.currentTarget.dataset.id;

        let urls = [app.host + '/buyerMobile/shop/getCommentPoster/shopid/' + app.shopid + '/id/' + id + '/openid/' + openid];

        wx.previewImage({
            urls: urls // 需要预览的图片http链接列表
        })

    },
    //预览评论图片
    preview: function(e) {

        let src = e.currentTarget.dataset.src;
        let srcs = e.currentTarget.dataset.srcs;

        for (var i = 0; i < srcs.length; i++) {
            srcs[i] = app.host + srcs[i];
        }

        let current = app.host + src;

        wx.previewImage({
            current: current,
            urls: srcs // 需要预览的图片http链接列表
        })
    },
    onPullDownRefresh: function() {
        let that = this;
        that.setData({
            page: 1
        })
        that.getdata();

        that.getCommentsList(); //评论区域列表
        wx.stopPullDownRefresh();
    },
    //加载更多
    onReachBottom: function() {
        let that = this;
        let _page = that.data.page + 1;

        if (_page > that.data.totalpage) {

            wx.showLoading({
                title: '没有更多数据',
            });

            setTimeout(function() {
                wx.hideLoading();
            }, 500);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getCommentsList();
        }

    }
})