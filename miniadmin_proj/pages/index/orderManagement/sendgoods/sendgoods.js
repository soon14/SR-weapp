const util = require('../../../../utils/util.js');
const app = getApp();
Page({

    data: {
        expresses: null,
        expresstitles: null,
        expressIndex: 0,

        stype: 1,
        id: 0,
        bindChange: false
    },
    sd_getdata: function() {
        var _shopid = wx.getStorageSync('shopid');
        var that = this;
        var params = { shopid: _shopid };

        util.ajaxRequest(
            'shopMobile/order/getMyExpress',
            params,
            function(res) {
                var _list = res.data.content;
                var titles = [];
                for (var i = 0; i < _list.length; i++) {
                    titles[titles.length] = _list[i].name;
                }

                that.setData({
                    expresses: _list,
                    expresstitles: titles
                });

                if (that.data.expresstitles[0] == '请设置常用快递公司') {
                    that.setData({
                        bindChange: true
                    })
                } else {
                    that.setData({
                        bindChange: false
                    })
                }
            });
    },
    onShow: function() {
        this.sd_getdata();
    },
    onLoad: function(e) {
        this.setData({
            id: e.id
        });
    },
    seltype: function(e) {

        var _stype = e.target.dataset.stype;
        // console.info(_stype);
        this.setData({
            stype: _stype
        });
    },
    bindExpressChange: function(e) {

        if (this.data.expresstitles[0] == '请设置常用快递公司') {
            this.setData({
                bindChange: true
            })
        } else {
            this.setData({
                bindChange: false
            })
        }

        this.setData({
            expressIndex: e.detail.value
        })
    },
    bindExpress: function() {

        if (this.data.expresstitles[0] == '请设置常用快递公司') {
            this.setData({
                bindChange: true
            })
            wx.navigateTo({
                url: '../shop/setexpress'
            })
        } else {
            this.setData({
                bindChange: false
            })
        }
    },
    formSubmit: function(e) {
        /**
         * 拼团发货：
         * 接口URL：原发货接口
         * /shopMobile/order/sendGoods
         * 交互类型：POST
         * 传入参数：
            {
                id:1,//订单id
                shopid:204,//店铺id
                deliverytype:1,//配送方式，1普通配送，2专人配送，3无需物流
                expressnotes:'',//配送备注
                expressnum:111111,//快递单号
                express:圆通,//快递公司名,需转码
                expresstype:YTO,//快递公司type
            }
         */
        var _shopid = wx.getStorageSync('shopid');
        var _stype = this.data.stype;
        var _express = encodeURIComponent(this.data.expresses[this.data.expressIndex].name);
        var expressName = this.data.expresses[this.data.expressIndex].name;
        var _expresstype = this.data.expresses[this.data.expressIndex].type;
        var _expressnum = e.detail.value.expressnum;
        var _expressnotes = encodeURIComponent(e.detail.value.expressnotes);
        var _id = this.data.id;
        var params = {
            id: _id,
            shopid: _shopid,
            deliverytype: _stype,
            express: _express,
            expresstype: _expresstype,
            expressnum: _expressnum,
            expressnotes: _expressnotes
        };

        if (_stype == '1') { //普通快递必须填写订单号
            if (expressName == '请设置常用快递公司' || _expressnum.length <= 0) {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '普通快递必须选择快递公司以及填写单号才能发货',
                    success: function(res) {}
                })

            } else {

                util.ajaxRequest(
                    'shopMobile/order/sendgoods',
                    params,
                    function(res) {
                        if (res.data.status == 1) {
                            wx.navigateBack({
                                url: 1
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: res.data.msg,
                                showCancel: false,
                                success: function(res) {}
                            });
                        }
                    });
            }
        } else {
            util.ajaxRequest(
                'shopMobile/order/sendgoods',
                params,
                function(res) {
                    if (res.data.status == 1) {
                        wx.navigateBack({
                            url: 1
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false,
                            success: function(res) {}
                        });
                    }

                });
        }
    },
    onPullDownRefresh: function() {
        this.sd_getdata();
        wx.stopPullDownRefresh();
    },

})