/*(订单管理)*/
/*
    实物商品state状态码对应关系
    0=>'待付款',
    1=>'待接单',
    2=>'待发货',
    3=>'待收货',
    4=>'已取消',
    5=>'已完成',
    6=>'拒绝接单',
    7=>'已关闭',
    8=>'待退款',
    9=>'已退款',
    )

    活动商品state状态码对应关系
    0=>'待付款',
    3=>'待上课',
    5=>'已完成',
    7=>'已关闭',
    8=>'待退款',
    9=>'已退款',
    )
*/
const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        host: app.cdnhost,
        type: '1', //活动商品订单type传2,实物商品订单传1,默认type为空表示所有订单

        state: '1', //默认待接单

        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数

        list: null, //订单数据

        inputShowed: false,
        inputVal: '',

        searchProductsShouw: false, //搜索显示

        //顶部导航（选项卡)
        topNavbarData: {
            'currentTab': 1,
            'navbar': [{
                    id: '0',
                    state: "0",
                    name: "待付款",
                },
                {
                    id: '1',
                    state: "1",
                    name: "待接单",
                    num: '0'
                },
                {
                    id: '2',
                    state: "2",
                    name: "待发货",
                    num: '0'
                },
            ]
        },

        //顶部导航（选项卡) 活动
        topNavbar_active_Data: {
            'currentTab': 1,
            'navbar': [{
                    id: '0',
                    state: "0",
                    name: "待付款",
                },
                {
                    id: '1',
                    state: "3",
                    name: "已报名",
                    num: '0'
                },
                {
                    id: '2',
                    state: "8",
                    name: "待退款",
                    num: '0'
                }
            ]
        },

        //更多选项
        moreShow: false, //默认隐藏
        moreId: false,
        moreData: [{
                id: "3",
                state: "7",
                name: "已关闭",
            },
            {
                id: "4",
                state: "3",
                name: "待收货",
            },
            {
                id: "5",
                state: "8",
                name: "待退款",
                num: '0'
            },
            {
                id: "6",
                state: "5",
                name: "已完成",
            },
        ],

        // 活动
        more_active_Data: [{
                id: '3',
                state: "5",
                name: "已完成",
            },
            {
                id: '4',
                state: "7",
                name: "已关闭",
            },

        ],

        orderCountByState: 'null', //订单数量
    },
    onLoad: function(options) {
        let that = this;
        let type = options.type;
        let state = options.state;

        if (type == 1) {
            state = 1;
        } else if (type == 2) {
            state = 3;
        }

        that.setData({
            type: type,
            state: state
        })

    },
    onShow: function() {
        this.orderCountByState();
        this.getdata();
    },
    //顶部选项卡切换
    navbarTap: function(e) {
        let that = this;

        let _state = e.currentTarget.dataset.state;
        let _id = e.currentTarget.dataset.id;
        let type = that.data.type;

        if (type == 1) {
            let _topNavbarData = that.data.topNavbarData;
            _topNavbarData.currentTab = _id;

            that.setData({
                topNavbarData: _topNavbarData,
            });

        } else if (type == 2) {
            let _topNavbar_active_Data = that.data.topNavbar_active_Data;
            _topNavbar_active_Data.currentTab = _id;

            that.setData({
                topNavbar_active_Data: _topNavbar_active_Data,
            });
        }

        that.setData({
            moreId: null,
            moreShow: false,
            state: _state,
            page: 1,
        });

        that.getdata();

    },
    //more
    bindMoreShow: function() {
        this.setData({
            moreShow: !this.data.moreShow,
            moreId: null,
        });
    },
    //more
    bindchangemore: function(e) {

        let that = this;
        let _state = e.target.dataset.state;
        let _id = e.currentTarget.dataset.id;
        let type = that.data.type;

        if (type == 1) {
            let _topNavbarData = that.data.topNavbarData;
            _topNavbarData.currentTab = _id;

            that.setData({
                topNavbarData: _topNavbarData,
            });

        } else if (type == 2) {
            let _topNavbar_active_Data = that.data.topNavbar_active_Data;
            _topNavbar_active_Data.currentTab = _id;

            that.setData({
                topNavbar_active_Data: _topNavbar_active_Data,
            });
        }


        this.setData({
            moreId: e.currentTarget.dataset.index + '',
            moreIdActive: e.target.dataset.id + '',
            moreShow: !that.data.moreShow,
            state: _state,
            page: 1,
        });

        this.getdata();
    },
    // 请求数据
    getdata: function(searchval) {

        let that = this;
        let _page = that.data.page;
        let _limit = that.data.limit;
        let _state = that.data.state;
        let _shopid = wx.getStorageSync('shopid');
        let _searchname = searchval || '';
        let type = that.data.type;
        let groupstatus = ''; //拼团订单

        if (type != 3) {
            groupstatus = '';
        }

        let params = {
            shopid: _shopid,
            key: encodeURIComponent(_searchname),
            state: _state,
            page: _page,
            limit: _limit,
            type: type,
            groupstatus: groupstatus //拼团订单，此参数才传值，拼团状态，2待成团，3已成团，4已完成，6已关闭
        };

        utils.ajaxRequest(
            'shopMobile/orderManage/getOrderListByType',
            params,
            function(res) {
                if (res.data.status == 1) {

                    let _list = [];
                    let _page = that.data.page;
                    let contentlist = res.data.content.list;

                    if (_page > 1) {
                        _list = that.data.list.concat(contentlist);
                    } else if (_page == 1) {
                        _list = contentlist;
                    }

                    try {
                        for (var i = 0; i < _list.length; i++) {
                            _list[i].host = that.data.host;
                        }
                    } catch (err) {
                        console.log(err);
                    }

                    let searchProductsShouw = false;

                    if (_searchname.length > 0) {
                        searchProductsShouw = true;
                    }

                    that.setData({
                        searchProductsShouw: searchProductsShouw,
                        totalpage: res.data.content.totalpage,
                        list: _list
                    });

                } else {
                    console.log(res.data.msg)
                }

            });
    },
    //获取订单处理数量
    orderCountByState: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let type = that.data.type;
        let params = {
            shopid: _shopid,
            type: type //1普通订单 2活动订单 3拼团订单
        };

        utils.ajaxRequest(
            'shopMobile/orderManage/groupListBase',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let numlist = res.data.content;
                    if (type == 1) {
                        let topNavbarData = that.data.topNavbarData;
                        let moreData = that.data.moreData;
                        topNavbarData.navbar[1].num = numlist.default.agree + '';
                        topNavbarData.navbar[2].num = numlist.default.send + '';
                        moreData[2].num = numlist.default.refunding + '';

                        let kyuan = false;
                        if (numlist.default.agree > 0 || numlist.default.send > 0 || numlist.default.refunding > 0) {
                            kyuan = true;
                        }

                        that.setData({
                            topNavbarData: topNavbarData,
                            moreData: moreData,
                            kyuan: kyuan
                        })

                    } else if (type == 2) {
                        let topNavbar_active_Data = that.data.topNavbar_active_Data;
                        topNavbar_active_Data.navbar[1].num = numlist.virtual.receive + '';
                        topNavbar_active_Data.navbar[2].num = numlist.virtual.refunding + '';

                        let kyuan = false;
                        if (numlist.virtual.receive > 0 || numlist.virtual.refunding > 0) {
                            kyuan = true;
                        }

                        that.setData({
                            topNavbar_active_Data: topNavbar_active_Data,
                            kyuan: kyuan
                        })
                    }

                }
            });
    },
    // 搜索栏
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    // 搜索栏
    search: function() {
        let that = this;
        let _searchname = that.data.inputVal;

        if (_searchname == '' || _searchname == null || _searchname == undefined || _searchname == 'null' || _searchname == 'undefined') {
            return;
        }

        that.getdata(_searchname);

    },
    // 搜索栏
    clearInput: function() {
        this.setData({
            searchProductsShouw: false,
            inputVal: "",
            page: 1,
        });
        this.getdata();
    },
    //搜索栏
    inputTyping: function(e) {
        let inputVal = e.detail.value;
        let searchProductsShouw = this.data.searchProductsShouw;
        if (inputVal.length < 1) {
            searchProductsShouw = false;
        }
        this.setData({
            inputVal: e.detail.value,
            searchProductsShouw: searchProductsShouw,
            page: 1
        });

        if (inputVal.length < 1) {
            this.getdata();
        }
    },
    // 关闭订单
    closeorder: function(e) {
        let _id = e.target.dataset.id;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定要关闭这个订单？',
            success: function(res) {
                if (res.confirm) {
                    let _shopid = wx.getStorageSync('shopid');
                    let params = { id: _id, shopid: _shopid };

                    utils.ajaxRequest(
                        'shopMobile/orderManage/closeOrder',
                        params,
                        function(res) {
                            if (res.data.status = 1) {
                                // 刷新
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
                }
            }
        })
    },
    // 接单
    takeOrder: function(e) {
        let _id = e.target.dataset.id;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定要接单？',
            success: function(res) {
                if (res.confirm) {
                    let _shopid = wx.getStorageSync('shopid');
                    let params = { id: _id, shopid: _shopid };
                    utils.ajaxRequest(
                        'shopMobile/order/takeOrder',
                        params,
                        function(res) {
                            // 刷新
                            that.getdata();

                        });
                }
            }
        })
    },
    // 拒绝接单
    refuseorder: function(e) {
        let _id = e.target.dataset.id;
        let that = this;
        let type = that.data.type;
        wx.showModal({
            title: '提示',
            content: '确定要拒绝接单？',
            success: function(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/index/orderManagement/refuseorder/refuseorder?id=' + _id + "&type=" + type
                    });
                }
            }
        })
    },
    //已完成
    doneOrder: function(e) {
        let _id = e.target.dataset.id;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定要完成订单？',
            success: function(res) {
                if (res.confirm) {
                    let _shopid = wx.getStorageSync('shopid');
                    let params = { id: _id, shopid: _shopid };

                    utils.ajaxRequest(
                        'shopMobile/orderManage/doneOrder',
                        params,
                        function(res) {
                            if (res.data.status = 1) {
                                // 刷新
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
                }
            }
        })
    },
    /*
    标记退款
    微信商户支付订单退款订单paytype为1的时候才用此接口标记退款
    展示标记退款按钮的时候根据这个订单的paytype去展示如果为1展示,2的话是光大自定退款
     */
    wxRefund: function(e) {
        let _id = e.target.dataset.id;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定已经完成退款操作？',
            success: function(res) {
                if (res.confirm) {
                    let params = { id: _id };

                    utils.ajaxRequest(
                        'shopMobile/refund/wxRefund',
                        params,
                        function(res) {
                            if (res.data.status = 1) {
                                // 刷新
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
                }
            }
        })

    },
    //备注
    writeRemark: function(e) {
        let _id = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/index/orderManagement/writeRemark/writeRemark?id=' + _id
        });
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
    /**
     * 页面上拉触底事件的处理函数
     */
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
            }, 1000);

            return;

        } else {

            that.setData({
                page: _page
            });

            that.getdata();
        }

    },

})