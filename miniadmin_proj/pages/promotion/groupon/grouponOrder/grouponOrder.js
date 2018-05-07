/**
 *  @author Shirui 2018/03/15
 *  37780012@qq.com
 *  拼团订单管理
 *  
    说明：订单类型与状态说明
            type=1时， state的值
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
            type=2时，state的值
                    0=>'待付款',
                    3=>'已报名',
                    5=>'已完成',
                    7=>'已关闭',
                    8=>'待退款',
                    9=>'已退款',
            type=3时，state的值
                    0=>'未支付',
                    1=>'已支付',
                    4=>'已取消',
                    5=>'已取货',
                    7=>'已关闭',

 */
const util = require('../../../../utils/util.js');
const app = getApp();
Page({
    data: {
        host: app.cdnhost,
        type: '3', //活动商品订单type传2,实物商品订单传1,3拼团订单,默认type为空表示所有订单

        groupstatus: '3', // 拼团状态，2待成团，3已成团，4已完成，6已关闭

        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数

        list: null, //订单数据

        inputShowed: false,
        inputVal: '',

        //订单管理页面是否显示拼团订单
        isShowGroup: true,

        //顶部导航（选项卡)
        topNavbarData: {
            'currentTab': 1,
            'navbar': [{
                    name: "待成团",
                },
                {
                    name: "待发货",
                    num: '0'
                },
                {
                    name: "已完成",
                },
                {
                    name: "已关闭",
                },
            ]
        },

        orderCountByState: 'null', //订单数量
    },
    onLoad: function(options) {

        let type = options.type;

        if (type == 3) { //3拼团订单

            this.setData({
                type: type,
            })
        }

    },
    onShow: function() {
        this.getdata();
    },
    //顶部选项卡切换
    navbarTap: function(e) {
        let that = this;
        let _topNavbarData = that.data.topNavbarData;
        _topNavbarData.currentTab = e.currentTarget.dataset.idx;

        let _groupstatus = this.data.groupstatus;
        switch (_topNavbarData.currentTab) {
            case 0:
                _groupstatus = '2'; //待成团
                break;
            case 1:
                _groupstatus = '3'; //待发货
                break;
            case 2:
                _groupstatus = '4'; //已完成
                break;
            case 3:
                _groupstatus = '6'; //已关闭
                break;
        }

        that.setData({
            topNavbarData: _topNavbarData,
            groupstatus: _groupstatus,
            page: 1,
        });

        that.getdata();

    },
    // 请求数据
    getdata: function(searchval) {
        /**
         * * 拼团订单列表：
            * 接口URL：/shopMobile/orderManage/GetOrderListByType
            * 交互类型：POST
            * 传入参数：
            params{
                shopid:204,
                key:'',//搜索内容 需转码
                state:1,//订单状态 可以不填
                page:1,
                limit:10,
                type:3,//1普通订单，2活动订单,3拼团订单
                groupstatus:2;//拼团订单，此参数才传值，拼团状态，2待成团，3已成团，4已完成，6已关闭
            }
         */

        let that = this;

        let _shopid = wx.getStorageSync('shopid');
        let _searchname = searchval || '';

        //判断导航栏是否显示拼团订单
        let params2 = {
            shopid: _shopid
        };
        util.ajaxRequest(
            'shopMobile/shopadmin/activityConfig',
            params2,
            function (res) {
                that.setData({
                    isShowGroup:res.data.content.group
                })
            });
        let params = {
            shopid: _shopid,
            key: encodeURIComponent(_searchname),
            type: that.data.type,
            page: that.data.page,
            limit: that.data.limit,
            groupstatus: that.data.groupstatus,
        };

        util.ajaxRequest(
            'shopMobile/orderManage/GetOrderListByType',
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

        that.groupListBase();
    },
    //获取订单处理数量
    groupListBase: function() {
        /**
         *  拼团订单基础数量统计：
         *  接口URL：/shopMobile/orderManage/groupListBase
         *  交互类型：POST
         *  传入参数：
                {
                    shopid:204,
                }
         */
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let type = that.data.type;
        let params = {
            shopid: _shopid,
            type: type //1普通订单 2活动订单 3拼团订单
        };

        util.ajaxRequest(
            'shopMobile/orderManage/groupListBase',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let numlist = res.data.content;
                    let topNavbarData = that.data.topNavbarData;

                    topNavbarData.navbar[1].num = numlist.group.suc; //待发货

                    that.setData({
                        topNavbarData: topNavbarData,
                    })

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