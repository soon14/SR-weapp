var md5 = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var city = require('../../utils/citys.js');
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
// 圆环图
var ringChart = null;
Page({
    data: {
        page: 1,
        limit: 15, //(每页多少条记录)
        totalpage: 1, //最大页数

        topNavbarcurrentTab: 0,
        // 客户页面固定数据
        customerpageData: {
            transactionamount: "交易金额",
            purchasetimes: "购买次数",
            balance: "余额",
            labelmanagementDeltext: "删除标签",
            labelmanagementAddtext: "新增标签",
            labeltoptext: "标签是一种非常灵活的客户信息管理方式，为了您更合理的使用标签，我们采用系统推荐加部分自定义，您最多可以设置 20个标签。",
            labeltoptext1: "点击这里查询系统标签",
        },
        //顶部导航（选项卡）数据 0全部客户 1标签管理 2客户分析
        topNavbarData: {
            'currentTab': 0,
            'navbar': ["全部客户", "标签管理", "客户分析"]
        },
        // 所有用户数据
        userlist: null,
        //客户openid
        openid: null,
        // 系统标签
        systemlabelData: [],
        // 系统标签显示收起
        showidx: null,
        //标签管理数据
        labelmanagementData: [],
        // 客户分析数据
        canvas1Data: null,
        canvas2Data: null,
        canvas3Data: null,
        canvas4Data: null,
        // 客户分析底部购买标签数据
        canvesbottomData: [],
        inputShowed: false,
        inputVal: "",

        scrollHeight: 0,
        hiddenloadmore: true,

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
    },
    onShow: function(options) {

        var that = this;
        var topNavbarcurrentTab = that.data.topNavbarcurrentTab;

        let custormer_topNavbarcurrentTab = app.custormer_topNavbarcurrentTab || 0;

        let topNavbarData_currentTab = that.data.topNavbarData;
        topNavbarData_currentTab.currentTab = custormer_topNavbarcurrentTab || 0;

        that.setData({
            topNavbarData: topNavbarData_currentTab,
            page: 1
        });
        if (custormer_topNavbarcurrentTab == 2) {
            that.getAnalysis();
        }

        if (topNavbarcurrentTab == 0) {
            // 加载全部客户数据
            that.getdata();
        } else if (topNavbarcurrentTab == 1) {
            //标签管理更新数据
            that.getShopTags();
        }
        // console.log(that.data.topNavbarData.currentTab)
    },
    //顶部选项卡切换
    navbarTap: function(e) {
        var that = this;
        var _topNavbarData = that.data.topNavbarData;
        _topNavbarData.currentTab = e.currentTarget.dataset.idx;
        app.custormer_topNavbarcurrentTab = e.currentTarget.dataset.idx;
        that.setData({
            topNavbarData: _topNavbarData
        });

        if (that.data.topNavbarData.currentTab == 0) {
            // 加载全部客户数据
            that.setData({
                topNavbarcurrentTab: 0
            });
        } else if (that.data.topNavbarData.currentTab == 1) {
            // 标签管理
            that.getShopTags();

            that.setData({
                systemTagQueryshow: false,
                topNavbarcurrentTab: 1
            });

        } else if (that.data.topNavbarData.currentTab == 2) {
            //客户分析 传shopid
            that.getAnalysis();

            that.setData({
                topNavbarcurrentTab: 2
            });

        }
    },
    // 获取所有用户信息
    getdata: function() {

        var that = this;
        let _page = that.data.page;
        let _limit = that.data.limit;
        var _shopid = wx.getStorageSync('shopid');
        var params = {
            shopid: _shopid,
            searchname: encodeURIComponent(that.data.inputVal),
            page: _page,
            limit: _limit
        };
        //分页获取客户信息 传shopid,searchname(昵称或者手机号),page(第几页)
        utils.ajaxRequest(
            'shopMobile/poster/ShowWxuserByShopidByPage',
            params,
            function(res) {
                
                if (res.data.status == 1) {

                    let _page = that.data.page;
                    var users = res.data.content.list;
                    var list = [];
                    let _list = [];
                    try {
                        for (var i = 0; i < users.length; i++) {
                            var item = users[i];
                            var key1 = "CN_" + item.province;
                            var key2 = "CN_" + item.province + "_" + item.city;
                            item.provincestr = city.citys[key1];
                            item.citystr = city.citys[key2];
                            list[list.length] = item;
                        }
                    } catch (err) {
                        console.log(err)
                    }

                    if (_page > 1) {
                        _list = that.data.userlist.concat(list);
                    } else if (_page == 1) {
                        _list = list;
                    }

                    that.setData({
                        userlist: _list,
                        totalpage: res.data.content.totalpage,
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
    // 展示客户详情
    goCustomerDetails: function(e) {

        var address = e.currentTarget.dataset.address,
            useropenid = e.currentTarget.dataset.openid;
        this.setData({
            openid: useropenid,
        });
        wx.navigateTo({
            url: '/pages/customer/customerdetails/customerdetails?openid=' + useropenid + '&&address=' + address
        })
    },
    // 拨打电话
    callphone: function(e) {
        var p = e.currentTarget.dataset.telphone;
        wx.makePhoneCall({
            phoneNumber: p
        })
    },
    // 搜索栏
    searchuser: function() {
        this.getdata();
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
            page: 1,
        });
        this.getdata();
    },
    inputTyping: function(e) {

        var inputVal = e.detail.value;
        this.setData({
            inputVal: inputVal,
            page: 1,
        });

        if (inputVal.length == 0) {
            this.getdata();
        }

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
    // 标签管理删除标签
    dellabel: function(e) {
        var that = this;
        var _labelid = e.currentTarget.dataset.labelid;
        wx.showModal({
            title: '提示',
            content: '确定要删除这个标签？',
            success: function(res) {
                if (res.confirm) {
                    var _shopid = wx.getStorageSync('shopid');
                    var params = { shopid: _shopid, tagid: _labelid };

                    utils.ajaxRequest(
                        'shopMobile/tags/delShopTag',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500
                                })
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: res.data.msg,
                                    success: function(res) {}
                                });
                            }

                            //标签管理更新数据
                            that.getShopTags();

                        });
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    // 标签管理
    getShopTags: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/tags/tagsShowForShop',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        labelmanagementData: res.data.content,
                    })
                }
                // else {
                //     wx.showModal({
                //         title: '提示',
                //         showCancel: false,
                //         content: res.data.msg,
                //         success: function(res) {}
                //     });
                // }

            });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var topNavbarcurrentTab = this.data.topNavbarcurrentTab; //是全部客户那页
        this.setData({
            page: 1
        });
        if (topNavbarcurrentTab == 0) {
            this.getdata();
        }
        wx.stopPullDownRefresh();
    },
    //客户分析 传shopid
    getAnalysis: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/poster/analysis',
            params,
            function(res) {
                that.setData({
                    //付费客户
                    canvas1Data: res.data.content.percent,
                    //客单价
                    canvas2Data: res.data.content.average,
                    //客户订单数
                    canvas3Data: res.data.content.payornot,
                    //赠送对象
                    canvas4Data: res.data.content.purpose,
                    //成交标签
                    canvesbottomData: res.data.content.customtag,
                });

                // 创建圆环图
                that.creatRingCharts();

            });
    },
    //创建圆环图 ring
    creatRingCharts: function() {
        var that = this;
        var windowWidth = 375;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        new wxCharts({
            animation: true, //是否动画展示
            canvasId: 'ringCanvas',
            type: 'ring',
            // 其他非通用配置项
            extra: {
                ringWidth: 20, //圆环宽度，单位为px
                pie: {
                    offsetAngle: -45
                }
            },
            // 标题
            title: {
                name: '付费客户比例',
                color: '#282828',
                fontSize: 12,
            },
            //  副标题内容
            subtitle: {
                // name: '付费客户比例',
                // color: '#282828',
                // fontSize: 12
            },
            series: that.data.canvas1Data,
            width: windowWidth, //canvas宽度，单位为px
            height: 210, //canvas高度，单位为px
            background: '#fff', //canvas背景颜色
            disablePieStroke: true, //是否在图表中显示数据点图形标识
            dataLabel: false, //是否在图表中显示数据内容值
            legend: true, //是否显示图表下方各类别的标识
            disablePieStroke: false, //不绘制饼图（圆环图）各区块的白色分割线
            padding: 0,
        });

        new wxCharts({
            animation: true, //是否动画展示
            canvasId: 'ringCanvas2',
            type: 'ring',
            // 其他非通用配置项
            extra: {
                ringWidth: 20, //圆环宽度，单位为px
                pie: {
                    offsetAngle: -45
                }
            },
            // 标题
            title: {
                name: '客单价',
                color: '#282828',
                fontSize: 12,
            },
            //  副标题内容
            subtitle: {
                // name: '客单价',
                color: '#282828',
                fontSize: 12
            },
            series: that.data.canvas2Data,
            width: windowWidth, //canvas宽度，单位为px
            height: 230, //canvas高度，单位为px
            background: '#fff', //canvas背景颜色
            disablePieStroke: true, //是否在图表中显示数据点图形标识
            dataLabel: false, //是否在图表中显示数据内容值
            legend: true, //是否显示图表下方各类别的标识
            disablePieStroke: false, //不绘制饼图（圆环图）各区块的白色分割线
            padding: 0,
        });

        new wxCharts({
            animation: true, //是否动画展示
            canvasId: 'ringCanvas3',
            type: 'ring',
            // 其他非通用配置项
            extra: {
                ringWidth: 20, //圆环宽度，单位为px
                pie: {
                    offsetAngle: -45
                }
            },
            // 标题
            title: {
                name: '客户订单数',
                color: '#282828',
                fontSize: 12,
            },
            //  副标题内容
            subtitle: {
                // name: '客户订单数',
                color: '#282828',
                fontSize: 12
            },
            series: that.data.canvas3Data,
            width: windowWidth, //canvas宽度，单位为px
            height: 210, //canvas高度，单位为px
            background: '#fff', //canvas背景颜色
            disablePieStroke: true, //是否在图表中显示数据点图形标识
            dataLabel: false, //是否在图表中显示数据内容值
            legend: true, //是否显示图表下方各类别的标识
            disablePieStroke: false, //不绘制饼图（圆环图）各区块的白色分割线
            padding: 0,
        });

        new wxCharts({
            animation: true, //是否动画展示
            canvasId: 'ringCanvas4',
            type: 'ring',
            // 其他非通用配置项
            extra: {
                ringWidth: 20, //圆环宽度，单位为px
                pie: {
                    offsetAngle: -45
                }
            },
            // 标题
            title: {
                name: '赠送对象',
                color: '#282828',
                fontSize: 12,
            },
            //  副标题内容
            subtitle: {
                // name: '赠送对象',
                color: '#282828',
                fontSize: 12
            },
            series: that.data.canvas4Data,
            width: windowWidth, //canvas宽度，单位为px
            height: 210, //canvas高度，单位为px
            background: '#fff', //canvas背景颜色
            disablePieStroke: true, //是否在图表中显示数据点图形标识
            dataLabel: false, //是否在图表中显示数据内容值
            legend: true, //是否显示图表下方各类别的标识
            disablePieStroke: false, //不绘制饼图（圆环图）各区块的白色分割线
            padding: 0,
        });

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
            }, 500);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getdata();
        }

    }

});