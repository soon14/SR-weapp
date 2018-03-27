var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        title: '', //主题
        promotion_id: '', //充值活动ID 没有为空
        max_money: '', //限制金额
        isOpeningActivity: true,
    },
    onLoad: function(options) {
        this.refresh();
        this.getdata();
    },
    onShow: function() {

    },
    // 开启 停止 活动
    changeActive: function() {
        let that = this;

        if (!that.data.isMainManager) {
            wx.showModal({
                title: '提示',
                content: '仅主管理员可以修改活动',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        let content = '确定要开启活动？';
        if (that.data.isOpeningActivity) {
            content = '确定要停止活动？';
        }

        wx.showModal({
            title: '提示',
            content: content,
            success: function(res) {
                if (res.confirm) {

                    that.setData({
                        isOpeningActivity: !that.data.isOpeningActivity
                    });

                    var _shopid = wx.getStorageSync('shopid');
                    var _msession = wx.getStorageSync('msession');
                    var _state = that.data.isOpeningActivity ? '2' : '1';
                    var _promotionid = that.data.promotion_id;
                    var params = {
                        msession: _msession,
                        shopid: _shopid,
                        state: _state,
                        promotionid: _promotionid,
                    };

                    utils.ajaxRequest(
                        'shopMobile/rechargeInfo/changeStatus',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                that.getdata();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function(res) {}
                                });
                            }
                        });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })



    },
    // 修改活动
    modify: function(e) {
        let promotion_id = e.currentTarget.dataset.promotion_id;
        var that = this;
        if (!that.data.isMainManager) {
            wx.showModal({
                title: '提示',
                content: '仅主管理员可以修改活动',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/promotion/sechargeSettings/sechargeSettings?promotion_id=' + promotion_id
        })
    },
    // 获取初始数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/rechargeInfo/view',
            params,
            function(res) {
                if (res.data.status == 1) {
                    for (let i = res.data.content.list.length - 1; i >= 0; i--) {
                        var m_total = res.data.content.list[i]['money'] * 1 + res.data.content.list[i]['gift_money'] * 1;
                        m_total = m_total.toFixed(2);
                        res.data.content.list[i]['total'] = m_total;
                    }
                    that.setData({
                        addColumnData: res.data.content.list,
                        title: res.data.content.title,
                        promotion_id: res.data.content.promotion_id,
                        max_money: res.data.content.max_money,
                    });
                    if (res.data.content.status == '1') {
                        that.setData({
                            isOpeningActivity: false,
                        })
                    } else {
                        that.setData({
                            isOpeningActivity: true,
                        })
                    }
                    // console.log(that.data.addColumnData);
                } else {
                    console.log(res.data.msg)
                }
            });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    },
    /**
     * [refresh 请求数据]
     * 是否店铺主管理员
     * mobile/shopadmin/isMainManager
     * 参数 shopid,msession
     */
    refresh: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid, msession: _msession };

        utils.ajaxRequest(
            'shopMobile/shopadmin/isMainManager',
            params,
            function(res) {
                if (res.data.status == 1) {
                    //是主管理员
                    that.setData({
                        isMainManager: true
                    });
                } else {
                    that.setData({
                        isMainManager: false
                    });
                }

                // console.info("是否店铺主管理员", that.data.isMainManager);
            });
    },

})