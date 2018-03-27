const utils = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
        isBingGuangda: 0, //是否绑定光大
        recharge: null, //客户充值信息
        sharecoupon: null, //社交立减金
        groupSetList: null, //拼团活动列表
        coupon: null, //优惠券
        goUrl: '/pages/financialManagement/financialOperation/financialOperation', //跳转到客户资料卡操作页

        state: 1, //1进行中的活动 2已过期的活动
    },
    onLoad: function(options) {

    },
    onShow: function() {
        let _isBingGuangda = wx.getStorageSync('isBingGuangda');
        this.setData({
            activityConfig: app.activityConfig,
            isBingGuangda: _isBingGuangda
        });
        this.getdata(_isBingGuangda);
    },
    // 获取初始数据
    getdata: function() {

        let that = this;
        let state = that.data.state;
        let status = 2;

        if (state == 2) {
            status = 1;
        }

        let _shopid = wx.getStorageSync('shopid');
        let params = {
            shopid: _shopid,
            status: status, //2有效的,1失效的 和团购列表状态相反
        };

        utils.ajaxRequest(
            'shopMobile/rechargeInfo/GetListsByStatus',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let data = res.data.content;
                    that.setData({
                        recharge: res.data.content.recharge,
                        coupon: res.data.content.coupon,
                        sharecoupon: res.data.content.sharecoupon,
                    });

                } else {
                    console.log(res.data.msg)
                }
            });

        that.groupSetList(); //拼团活动列表：
    },
    groupSetList: function() {
        /**
         * 拼团活动列表：
         * 接口URL：/shopMobile/groupSet/groupSetList
         * 交互类型：POST
         * 传入参数：{
                shopid:204,
                state:1,//1有效的，2失效的
                page:1,//第几页，
                limit:500//每页数据数
            }
         */
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = {
            shopid: _shopid,
            state: that.data.state, //1有效的，2失效的
            page: 1, //第几页，
            limit: 500 //每页数据数
        };

        utils.ajaxRequest(
            'shopMobile/groupSet/groupSetList',
            params,
            function(res) {
                let data = res.data.content;
                if (res.data.status == 1) {
                    that.setData({
                        groupSetList: res.data.content.list,
                    });

                } else {
                    console.log(res.data.msg)
                }
            });
    },
    // 选择活动
    changeState: function(e) {
        this.setData({
            state: e.currentTarget.dataset.state
        })

        this.getdata();
    },
    goUrl: function(e) {
        let promotion_id = e.currentTarget.dataset.promotion_id;

        wx.navigateTo({
            url: '/pages/promotion/customerRecharge/customerRecharge?promotion_id=' + promotion_id
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

        this.getdata();

        wx.stopPullDownRefresh();
    },
    // 选择活动
    // active: function(e) {
    //     this.setData({
    //         active: e.currentTarget.dataset.active
    //     })
    // },
    /**
     * [refresh 请求数据]
     * 是否店铺主管理员
     * mobile/shopadmin/isMainManager
     * 参数 shopid,msession
     */
    isMain: function() {
        let that = this;
        let _msession = wx.getStorageSync('msession');
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid, msession: _msession };

        utils.ajaxRequest(
            'shopMobile/shopadmin/isMainManager',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.navigateTo({
                        url: '/pages/promotion/sechargeSettings/sechargeSettings'
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: "仅店铺主管理员才可以操作",
                        success: function(res) {}
                    })
                }
            });
    },
    // 拼团
    groupon: function() {
        let groupon = true;
        if (groupon) {
            wx.navigateTo({
                url: '/pages/promotion/groupon/groupon'
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '还没有开通拼团功能，是否开通？',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/promotion/plugIns/plugIns'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    }
})