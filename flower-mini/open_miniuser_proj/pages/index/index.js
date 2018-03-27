const md5 = require('../../utils/md5.js');
//获取应用实例
const sliderWidth = 96;
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        toplist: null,
        catelist: null,
        host: app.cdnhost,

        activeIndex: 0,

        title: '',
        background: '',
        sliderwidth: 0,
        isshow: false,

        imgdefault: null, //默认图
        current: 0,
        imglist: null, //轮播图
        indicatorDots: true,
        circular: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,

        styleid: 0, //首页样式

        toviewlist: ['red', 'yellow', 'blue', 'green', 'cc'],
        toView: 'red',

        has_group_Url: '/pages/groupon/groupon', //团购详情地址
        is_useticket_Url: '/pages/details/details', //普通详情地址

    },
    onLoad: function() {

        let shopid = app.shopid;
        // console.log(shopid);
        if (shopid == null || shopid == '' || shopid == 'undefined' || shopid == undefined) {
            // 如果shopid没有值就刷新页面
            wx.reLaunch({
                url: '/pages/index/index'
            })
        }

        var _openid = wx.getStorageSync('openid');
        if (_openid == '' || _openid == 'undefined' || _openid == undefined) {
            this.applyuser();
        }

        this.sd_getdata();
        this.getBaseInfo();

    },
    onShow: function() {
        var _title = this.data.title;
        wx.setNavigationBarTitle({
            title: _title
        })

        this.getStyle(); //首页模版

        this.get();

        this.getSlidersByShopid();
    },
    //首页模版
    getStyle: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        var that = this;
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: app.shopid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/style/getStyle',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                wx.hideToast();
                console.log(res);
                if (res.data.suc == 1) {
                    that.setData({
                        styleid: res.data.content.styleid
                    })
                } else {
                    console.log(res.data.msg)
                }
            }
        });
    },
    tabClick: function(e) {
        let that = this;
        let toviewlist = that.data.toviewlist;
        let toView = that.data.toView;
        let id = e.currentTarget.id;

        if (toviewlist[0] === id || toviewlist[1] === id) {

            toView = toviewlist[0];

        } else if (toviewlist[2] === id || toviewlist[3] === id || toviewlist[4] === id) {

            toView = toviewlist[2];

        }

        that.setData({
            toView: toView,
            activeIndex: e.currentTarget.dataset.id,
        });

    },
    sd_getdata: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        var _shopid = app.shopid;
        var that = this;
        var _openid = wx.getStorageSync('openid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: _shopid, openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/product/getShopCateListProducts',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                console.log(res);
                wx.hideToast();
                var _list = res.data.content.list;
                var _title = res.data.content.title;

                that.setData({
                    catelist: _list,
                    title: _title,
                    background: app.cdnhost + res.data.content.background,
                    isshow: true
                });

                wx.setNavigationBarTitle({
                    title: _title
                })

            }
        });
    },
    applyuser: function() {
        wx.login({
            success: function(res) {
                if (res.code) {

                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ code: res.code, shopid: app.shopid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                    wx.request({
                        url: app.host + '/buyerMobile/wxuser/index',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        success: function(res) {
                            // console.info(res.data);
                            var openid = res.data.openid;
                            var session_key = res.data.session_key;
                            wx.setStorage({
                                key: "openid",
                                data: openid
                            });
                            wx.setStorage({
                                key: "session_key",
                                data: session_key
                            });
                        }
                    });
                }
            },
            fail: function(res) {
                console.info('login fail ');
            }
        })
    },
    //轮播图
    getSlidersByShopid: function() {
        let that = this;
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ shopid: app.shopid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/shop/getSlidersByShopid',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.info(res);
                if (res.data.status == 1) {
                    that.setData({
                        imgdefault: res.data.content.default,
                        imglist: res.data.content.sliders
                    })
                } else {
                    console.log(res.data.msg)
                }

            }
        });
    },
    swiperChange: function(e) {
        /**
         * 轮播图
         */
        let _current = e.detail.current;

        this.setData({
            current: _current
        })

    },
    gotodetail: function(e) {
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?id=' + id
        })
    },
    getBaseInfo: function() {
        /**
         * 首页的一些基本信息
         * buyerMobile/index/getBaseInfo
         * 参数{openid:'xxxx',shopid:204}
         */
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ openid: _openid, shopid: app.shopid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/index/getBaseInfo',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res);
                if (res.data.suc == 1) {

                    that.setData({
                        recharge: res.data.content.recharge,
                    })

                } else {
                    console.log(res.data.msg)
                }
            }
        });
    },
    get: function() {
        var _openid = wx.getStorageSync('openid');
        var that = this;
        if (_openid != null && _openid != '') {

            var _timestamp0 = app.getTimeStamp();
            var _params0 = JSON.stringify({ openid: _openid });
            var _sign0 = md5.hex_md5(_timestamp0 + _params0 + app.shopkey);

            wx.request({
                url: app.host + '/buyerMobile/wxuser/get',
                data: { shopid: app.shopid, timestamp: _timestamp0, params: _params0, sign: _sign0 },
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                method: 'POST',
                success: function(res) {
                    // console.log(res)
                    if (res.data == false) {
                        wx.getUserInfo({
                            success: function(res) {
                                that.setData({
                                    avatarUrl: res.userInfo.avatarUrl,
                                    nickName: res.userInfo.nickName
                                });

                                var _timestamp1 = app.getTimeStamp();
                                var _params1 = JSON.stringify({
                                    shopid: app.shopid,
                                    openid: _openid,
                                    name: encodeURIComponent(res.userInfo.nickName),
                                    sex: res.userInfo.gender,
                                    faceurl: res.userInfo.avatarUrl,
                                    country: res.userInfo.country,
                                    province: res.userInfo.province,
                                    city: res.userInfo.city
                                });

                                var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);

                                wx.request({
                                    url: app.host + '/buyerMobile/wxuser/insertUserinfo',
                                    data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                                    method: 'POST',
                                    complete: function(res) {
                                        // console.info(res);
                                        wx.setStorage({
                                            key: "inserted",
                                            data: 1
                                        });
                                    }
                                });
                            },
                            fail: function(res) {
                                that.setData({
                                    avatarUrl: '/images/face.png',
                                    nickName: '未授权用户'
                                });

                                wx.showModal({
                                    title: '温馨提示',
                                    content: '用户信息未授权，无法继续浏览，点击授权进行设置',
                                    cancelText: '取消',
                                    confirmText: '授权',
                                    success: function(res) {
                                        if (res.confirm) {
                                            that.openset();
                                        } else if (res.cancel) {
                                            console.log('用户点击取消');
                                        }
                                    }
                                })
                            }
                        });
                    } else {
                        var bind = false;
                        if (res.data.telphone != null && res.data.telphone != '') {
                            bind = true;
                        }
                        that.setData({
                            isbind: bind,
                            isshow: true
                        });
                    }

                }
            })
        }
    },
    //授权设置
    openset: function() {
        wx.openSetting({
            success: (res) => {}
        })
    },
    onShareAppMessage: function() {
        var _title = '向你推荐' + this.data.title;
        let cdnhost = this.data.cdnhost;
        let _current = this.data.current;
        let _imglist = this.data.imglist;
        let _imageUrl;

        for (var i = 0; i < _imglist.length; i++) {

            _imageUrl = cdnhost + _imglist[_current].pic;

        }

        return {
            title: _title,
            imageUrl: _imageUrl,
            path: 'pages/index/index'
        }
    },
    onPullDownRefresh: function() {
        this.sd_getdata();
        wx.stopPullDownRefresh();
    }
})