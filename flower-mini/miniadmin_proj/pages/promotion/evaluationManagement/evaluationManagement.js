/**
 *  @author Shirui 2018/01/25
 *  37780012@qq.com
 */
const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,
        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数

        state: 1, //1新评论,2展示

        list: null, //1新评论列表
        list2: null, //2展示列表

    },
    onLoad: function(options) {
        this.getdata();
    },
    onShow: function() {

    },
    // 获取初始数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _page = that.data.page;
        let _limit = that.data.limit;
        let _state = that.data.state;

        let params = {
            shopid: _shopid,
            page: _page,
            limit: _limit,
            state: _state,
        };
        /**
         * 评论管理
         * shopMobile/comments/getListByState
         * 参数 state=1新评论,2展示
         * shopid,page,limit,state
         */
        utils.ajaxRequest(
            'shopMobile/comments/getListByState',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let _list = [];
                    let _page = that.data.page;

                    if (_state == 1) {

                        if (_page > 1) {
                            _list = that.data.list.concat(res.data.content.lists);
                        } else if (_page == 1) {
                            _list = res.data.content.lists
                        }

                        that.setData({
                            list: _list,
                            totalpage: res.data.content.totalpage,
                        });

                    } else {

                        if (_page > 1) {
                            _list = that.data.list2.concat(res.data.content.lists);
                        } else if (_page == 1) {
                            _list = res.data.content.lists
                        }

                        that.setData({
                            list2: _list,
                            totalpage: res.data.content.totalpage,
                        });
                    }



                } else {
                    console.log(res.data.msg)
                }
            });
    },
    // 选项卡
    changeState: function(e) {
        let that = this;
        let state = e.target.dataset.id;

        that.setData({
            state: state,
            page: 1,
        })

        that.getdata();
    },
    // 展示评论
    show: function(e) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _commentid = e.currentTarget.dataset.id;
        let params = {
            shopid: _shopid,
            commentid: _commentid,
        };
        /**
         * 展示评论
         * shopMobile/comments/show
         * shopid，commentid
         */
        wx.showModal({
            title: '提示',
            content: '确定展示？',
            success: function(res) {
                if (res.confirm) {
                    utils.ajaxRequest(
                        'shopMobile/comments/show',
                        params,
                        function(res) {
                            if (res.data.status == 1) {

                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'success',
                                    duration: 1000
                                })

                                setTimeout(function() {
                                    that.setData({
                                        page: 1,
                                    });
                                    that.getdata();
                                }, 1000);

                            } else {
                                console.log(res.data.msg)
                            }
                        });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // 删除评论
    del: function(e) {
        let that = this;
        let _commentid = e.currentTarget.dataset.id;
        let _shopid = wx.getStorageSync('shopid');
        let params = {
            shopid: _shopid,
            commentid: _commentid,
        };
        /**
         * 删除评论
         * shopMobile/comments/del
         * shopid , commentid
         */
        wx.showModal({
            title: '提示',
            content: '确定删除？',
            success: function(res) {
                if (res.confirm) {

                    utils.ajaxRequest(
                        'shopMobile/comments/del',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: res.data.msg,
                                    success: function(res) {

                                        that.setData({
                                            page: 1,
                                        });

                                        that.getdata();
                                    }
                                })

                            } else {
                                console.log(res.data.msg)
                            }
                        });

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // 评论置顶
    setUp: function(e) {
        let that = this;
        let _commentid = e.currentTarget.dataset.id;
        let _shopid = wx.getStorageSync('shopid');
        let params = {
            shopid: _shopid,
            commentid: _commentid,
        };
        /**
         * 评论置顶
         * shopMobile/comments/setUp
         * shopid , commentid
         */
        utils.ajaxRequest(
            'shopMobile/comments/setUp',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {

                            that.setData({
                                page: 1,
                            });

                            that.getdata();
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
            });
    },
    // 回复评论
    reply: function(e) {
        let that = this;
        let _commentid = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/promotion/evaluationManagement/reply/reply?commentid=' + _commentid
        })
    },
    // 预览
    previewImage: function(e) {
        let src = e.currentTarget.dataset.src;
        let srcs = e.currentTarget.dataset.srcs;

        for (var i = 0; i < srcs.length; i++) {
            srcs[i] = app.host + srcs[i];
        }

        let current = app.host + src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: srcs // 需要预览的图片http链接列表
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
        });
        this.getdata();
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

            that.getdata();
        }

    }


})