var utils = require("../../utils/util.js");
var app = getApp();
Page({
    data: {
        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数
        list: null, //记录列表
        inputVal: '', //搜索内容
    },
    onLoad: function(options) {
        this.getdata();

    },
    onShow: function() {

    },
    // 搜索栏
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        // console.log(e.detail.value);
        this.setData({
            inputVal: e.detail.value
        });
    },
    // 跳转到客户资料卡操作页
    goUrl: function() {
        let that = this;
        let _phone = that.data.inputVal; //phone
        if (that.checkUserName(_phone)) {
            that.search();
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入正确的客户手机号',
                success: function(res) {}
            });
        }
    },
    // 搜索
    search: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var _phone = that.data.inputVal; //phone
        var params = { shopid: _shopid, phone: _phone };
        // console.log(_params);
        /*财务管理-手机号查找客户 shopMobile/balance/getWxuserByTelForBalance
        参数 phone,shopid
        */

        utils.ajaxRequest(
            'shopMobile/balance/getWxuserByTelForBalance',
            params,
            function(res) {

                if (res.data.status == 1) {

                    let userInfo = res.data.content;
                    userInfo.address = userInfo.province + userInfo.city;//用户地址

                    try {
                        wx.removeStorageSync('search_user_Info'); //清除 搜到的用户信息缓存
                        wx.setStorageSync('search_user_Info', userInfo); //设置 搜到的用户信息缓存
                    } catch (e) {
                        console.log(e);
                    }

                    //跳转到客户资料卡操作页
                    wx.navigateTo({
                        url: '/pages/financialManagement/financialOperation/financialOperation'
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
    // 获取初始数据
    getdata: function() {
        var that = this;
        let _page = that.data.page;
        let _limit = that.data.limit;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid, page: _page, limit: _limit };
        /*财务管理 shopMobile/balance/operationList
          参数shopid,page,limit
        */
        utils.ajaxRequest(
            'shopMobile/balance/operationList',
            params,
            function(res) {
                let _list = [];
                let _page = that.data.page;

                if (_page > 1) {
                    _list = that.data.list.concat(res.data.content.list);
                } else if (_page == 1) {
                    _list = res.data.content.list
                }
                
                if (res.data.status == 1) {
                    that.setData({
                        list: _list,
                        totalpage: res.data.content.totalpage,
                    });
                }
            });
    },
    // 正则检测输入手机号
    checkUserName: function(param) {
        var phone = utils.regexConfig().phone; //验证手机号正则
        var inputUserName = param.trim();
        if (phone.test(inputUserName)) {
            return true;
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入正确的手机号码'
            });
            return false;
        }
    },
    //下拉刷新
    onPullDownRefresh: function() {
        let that = this;

        wx.showNavigationBarLoading(); //在标题栏中显示加载

        that.setData({
            page: 1,
        });

        //模拟加载
        setTimeout(function() {
            that.getdata();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
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