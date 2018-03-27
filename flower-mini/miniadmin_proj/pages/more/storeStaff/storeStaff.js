/**
 * Created by SR on 2017/9/25.
 * 37780012@qq.com
 */
var utils = require("../../../utils/util.js");
var app = getApp();
Page({
    data: {
        msession: null,
        shopid: null,
        isShow: false,
        phoneNum: '', //手机号
        list: null,
        isshowimg: false
    },
    onLoad: function(options) {
        let _msession = wx.getStorageSync('msession') || '';
        let _shopid = wx.getStorageSync('shopid') || '';
        this.setData({
            msession: _msession,
            shopid: _shopid
        });
    },
    onShow: function() {
        this.refresh();
    },
    onPullDownRefresh: function() {
        this.refresh();
        wx.stopPullDownRefresh();
    },
    /**
     * [refresh 请求数据]
     * 当前店铺所有副管理员
     * mobile/shopadmin/isNonMainManager
     * 参数 shopid 
     */
    refresh: function() {
        let that = this;
        let _shopid = that.data.shopid;
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/shopadmin/isNonMainManager',
            params,
            function(res) {
                if (res.data.content.length > 0) {
                    that.setData({
                        list: res.data.content,
                        isshowimg: false
                    });

                } else {
                    that.setData({
                        list: null,
                        isshowimg: true
                    });
                }

                that.setData({
                    list: res.data.content
                });
            });
    },
    /**
     * [deletePhoneNum 删除副管理员]
     * 删除副管理员
     * mobile/shopadmin/delNonMainManager
     * 参数id,delid（要删除的id）,shopid
     */
    deletePhoneNum: function(e) {
        let that = this;
        let _deletePhoneNum = e.currentTarget.dataset.telphone;
        let _delid = e.currentTarget.dataset.delid;
        let _shopid = that.data.shopid;
        wx.showModal({
            title: '温馨提示',
            content: '确定删除该员工吗？',
            cancelText: '取消',
            confirmText: '确定',
            success: function(res) {
                if (res.confirm) {
                    let _msession = that.data.msession;
                    let params = { msession: _msession, shopid: _shopid, delid: _delid, telphone: _deletePhoneNum };

                    utils.ajaxRequest(
                        'shopMobile/shopadmin/delNonMainManager',
                        params,
                        function(res) {
                            // console.info("删除副管理员", _params);

                            setTimeout(function() {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'success',
                                    duration: 1000
                                });
                            }, 1000);

                            that.refresh();
                        });

                }
            }
        })

    },
    /**
     * [setupManager 设置主管理员]
     * mobile/shopadmin/isNonMainManager
     * 参数id,changemainid,shopid
     */
    setupManager: function(e) {
        let that = this;
        let _deletePhoneNum = e.currentTarget.dataset.telphone;
        let _changemainid = e.currentTarget.dataset.delid;
        let _shopid = that.data.shopid;
        wx.showModal({
            title: '温馨提示',
            content: '确定设置该员工为主管理员吗？',
            cancelText: '取消',
            confirmText: '确定',
            success: function(res) {
                if (res.confirm) {
                    let _msession = that.data.msession;
                    let params = { msession: _msession, shopid: _shopid, changemainid: _changemainid };

                    utils.ajaxRequest(
                        'shopMobile/shopadmin/changeMainManager',
                        params,
                        function(res) {
                            /// console.info("主管理员", res);

                            setTimeout(function() {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'success',
                                    duration: 1000
                                });
                            }, 1000);

                            wx.redirectTo({
                                url: '/pages/more/more'
                            })
                        });

                }
            }
        })
    },
    /**
     * [additem 添加员工按钮]
     */
    additem: function() {
        this.setData({
            isShow: true,
            phoneNum: ''
        });
    },
    /**
     * [cancel 取消添加]
     */
    cancel: function() {
        this.setData({
            isShow: false,
            phoneNum: ''
        });
        this.refresh();
    },
    /**
     * [confirm 确定添加]
     */
    confirm: function() {
        let that = this;
        let _telphone = that.data.phoneNum;
        if (that.checkTelphone(_telphone)) {
            that.sendAddTelphone(_telphone);

        } else {
            that.setData({
                phoneNum: ''
            });
        }

    },
    /**
     * [getPhoneNum 获取手机号]
     * @param  {[type]} e [description]
     */
    getPhoneNum: function(e) {
        let phoneNum = e.detail.value;
        this.setData({
            phoneNum: phoneNum
        });
    },
    /**
     * [checkTelphone 正则检测输入手机号]
     * @param  {[type]} telphone [输入的手机号]
     */
    checkTelphone: function(telphone) {
        let phone = utils.regexConfig().phone; //验证手机号正则
        let inputTelphone = telphone.trim();
        if (phone.test(inputTelphone)) {
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
    /**
     * [sendAddTelphone 添加副管理员]
     * @param  {[type]} phoneNum [添加的手机号码]
     * 添加副管理员
     * mobile/shopadmin/addNonMainManager
     * 参数id,shopid,telphone
     */
    sendAddTelphone: function(phoneNum) {
        let that = this;
        let _msession = that.data.msession;
        let _shopid = that.data.shopid;
        let params = { msession: _msession, shopid: _shopid, telphone: phoneNum };

        utils.ajaxRequest(
            'shopMobile/shopadmin/addNonMainManager',
            params,
            function(res) {
                // console.info("发送添加手机号码", res);
                if (res.data.status==1) {

                    setTimeout(function() {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1000
                        });

                    }, 1500);

                    that.setData({
                        isShow: false
                    });

                    that.refresh();

                } else {

                    wx.showModal({
                        title: '温馨提示',
                        content: res.data.msg,
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {}
                    })

                }
            });
    }

})