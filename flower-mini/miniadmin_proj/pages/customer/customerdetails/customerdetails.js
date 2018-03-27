var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var city = require('../../../utils/citys.js');
var app = getApp();
Page({
    data: {
        host: app.cdnhost,
        page: '1',
        more: '1', //是否还有数据 1 0
        inputVal: '', //需要搜索的字符
        searchTags: null, //搜索到的标签
        userlist: [], //放置返回数据的数组 用户数据
        // 客户页面固定数据
        customerpageData: {
            mylabeltext: "标签",
            customlabeltext: "自定义标签",
            customlabelExplain: "说明：点击可为用户新增标签",
            systemlabeltext: "系统标签",
            systemlabeltext1: "以下是系统定义的标签，您可以直接使用。",
            labelmanagementDeltext: "删除标签",
            labelmanagementAddtext: "新增标签",
        },
        //消费记录（选项卡）数据 动态 订单 标签
        recordNavbarData: {
            'currentTab': 0,
            'navbar': [
                { name: "动态", number: null },
                { name: "订单", number: '6' },
                { name: "标签", number: '3' }
            ]
        },
        //客户openid
        openid: null,
        // 客户详情数据
        customerdetailsData: null,
        //客户详情 行为记录数据
        customerbehaviorData: null,
        // 订单数据
        orderData: null,
        //用户订单总数
        userOrderTotalNum: 0,
        // 我的标签
        mylabelData: null,
        // 自定义标签
        customlabelData: null,
        // 系统标签
        systemlabelData: [],
        // 系统标签显示收起
        showidx: null,
        address: '',
        telphone: '',

    },
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {

                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        let _address = options.address,
            _openid = options.openid;
        that.setData({
            address: _address,
            openid: _openid,
        });

    },
    onShow: function() {
        this.getdata();
    },
    //消费记录选项卡切换
    navbarRecord: function(e) {
        var that = this;

        var _recordNavbarData = that.data.recordNavbarData;
        _recordNavbarData.currentTab = e.currentTarget.dataset.idx;

        that.setData({
            recordNavbarData: _recordNavbarData
        });

        if (that.data.recordNavbarData.currentTab == 0) {
            // 加载客户动态

        } else if (that.data.recordNavbarData.currentTab == 1) {
            that.setData({
                page: 1
            });
            //获取用户订单，分页获取  传shopid,page
            that.getPaidOrders();

        } else if (that.data.recordNavbarData.currentTab == 2) {

            //获取用户标签 传openid
            that.getUsertags();

            //自定义标签展示 传shopid
            that.getShoptags();

            //系统标签展示 传shopid
            that.getAllSystemTag();

        }

    },
    //获取用户订单，分页获取  传shopid,page
    getPaidOrders: function() {
        var that = this;
        var _page = that.data.page;
        var _openid = that.data.openid;
        var params = { openid: _openid, page: _page };

        utils.ajaxRequest(
            'shopMobile/poster/getPaidOrdersByOpenid',
            params,
            function(res) {
                let _orderData = res.data.content.lists;
                that.setData({
                    page: that.data.page + 1,
                    more: res.data.content.more,
                    orderData: _orderData,
                    userOrderTotalNum: res.data.content.count,
                });
            });
    },
    //获取用户标签 传openid
    getUsertags: function() {
        var that = this;
        var _openid = that.data.openid;
        var params = { openid: _openid };

        utils.ajaxRequest(
            'shopMobile/tags/tagsShowByOpenid',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let _usertags = res.data.content;
                    that.setData({
                        mylabelData: _usertags
                    });
                    console.log(_usertags)
                }
                // else{
                //     wx.showModal({
                //         title: '提示',
                //         showCancel: false,
                //         content: res.data.msg,
                //         success: function(res) {}
                //     });
                // }
            });
    },
    //自定义标签展示 传shopid
    getShoptags: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/tags/tagsShowForShop',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let _shoptags = res.data.content;
                    that.setData({
                        customlabelData: _shoptags
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });
    },
    //获取系统标签
    getAllSystemTag: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/tags/tagsShowForSys',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        systemlabelData: res.data.content,
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });
    },
    // 删除我的标签
    delmylabel: function(e) {
        var that = this;
        let _delid = e.currentTarget.dataset.id;
        let _openid = that.data.openid;
        wx.showModal({
            title: '提示',
            content: '确定要删除这个标签？',
            success: function(res) {
                if (res.confirm) {
                    var params = { openid: _openid, tagid: _delid };

                    utils.ajaxRequest(
                        'shopMobile/tags/delWxuserTag',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500
                                });
                                // 重新加载用户标签
                                that.getdata();
                                that.getUsertags();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: res.data.msg,
                                    success: function(res) {}
                                });
                            }
                        });
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    //添加标签到我的标签
    addlabel: function(e) {
        var that = this;
        let _addid = e.currentTarget.dataset.id;
        let _openid = that.data.openid;
        var params = { openid: _openid, tagid: _addid };

        utils.ajaxRequest(
            'shopMobile/tags/addWxuserTag',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 1500
                    });
                    // 重新加载用户标签
                    that.getUsertags();
                    that.getdata();
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });
    },
    //展示收起系统标签
    showlabel: function(e) {
        let idex = e.currentTarget.dataset.idx;
        if (this.data.showidx == idex) {
            idex = null;
        }
        this.setData({
            showidx: idex,
        });

    },
    // 搜索栏
    searchuser: function() {
        this.searchtag();
    },
    // 搜索栏
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    // 搜索栏
    clearInput: function() {
        this.setData({
            inputVal: "",
            searchTags: null,
            page: 1,
        });
    },
    //搜索标签
    searchtag: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var inputVal = encodeURIComponent(that.data.inputVal);
        var params = { shopid: _shopid, tagname: inputVal };

        utils.ajaxRequest(
            'shopMobile/tags/searchTagsByName',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        searchTags: res.data.content
                    })
                } else {
                    that.setData({
                        searchTags: null
                    })
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }
            });
    },
    //搜索输入
    inputTyping: function(e) {

        var inputVal = e.detail.value;
        this.setData({
            inputVal: inputVal,
            page: 1,
        });

        if (inputVal.length == 0) {
            this.setData({
                searchTags: null
            })
        }

    },
    //打电话
    callphone: function() {
        let telphone = this.data.telphone;
        if (telphone.length > 0) {
            wx.makePhoneCall({
                phoneNumber: telphone
            })
        }
    },
    //客户详情
    getdata: function() {
        var that = this;
        var _openid = that.data.openid;
        var address = that.data.address;
        var params = { openid: _openid };

        utils.ajaxRequest(
            'shopMobile/poster/shopGetWxuser',
            params,
            function(res) {
                var _customerdetailsData = res.data.content;
                var telphone = res.data.content.telphone;
                _customerdetailsData.address = address;
                that.setData({
                    customerdetailsData: res.data.content,
                    customerbehaviorData: res.data.content.actions,
                    telphone: telphone
                })
            });
    },
    // 客户优惠券
    gouCoupon() {
        let _openid = this.data.openid;
        wx.navigateTo({
            url: '/pages/customer/customerCoupons/customerCoupons?openid='+_openid
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setData({
            page: 1
        });
        this.getdata();
        wx.stopPullDownRefresh();
    },
    scroll: function(e) {
        this.setData({
            scrollTop: e.detail.scrollTop
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

        let that = this;
        if (that.data.more == '1') {
            wx.showToast({
                title: '加载更多数据',
            })
            that.getPaidOrders();
        } else {
            wx.showToast({
                title: '没有更多数据',
            })
        }
    },

});