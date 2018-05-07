var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        list: null,
        markers: [{
            id: 0,
            latitude: null,
            longitude: null,
        }],
        id: 0,
        orderstatetitle: '',
        orderaddtimestr: '',
        paytimestr: '',
        accepttimestr: '',
        sendtimestr: '',
        orderstatus: '',
        productId: ''
    },

    onLoad: function(e) {
        var _id = e.id;

        this.setData({
            orderstatetitle: app.orderstatetitle,
            id: _id
        });
    },
    onShow: function() {
        var _id = this.data.id;

        this.sd_getdata(_id);

    },
    //刷新
    refresh: function() {
        var _id = this.data.id;
        this.sd_getdata(_id);
    },
    onPullDownRefresh: function() {
        var _id = this.data.id;
        this.sd_getdata(_id);
        wx.stopPullDownRefresh();
    },
    sd_getdata: function(_id) {

        var that = this;
        var _timestamp = app.getTimeStamp();
        var params = { id: _id };

        utils.ajaxRequest(
            'shopMobile/orderManage/getForAdmin',
            params,
            function(res) {
                if (res.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                    return;
                }
                var data = res.data.content;
                let productId = data.proinfo.chosen_goods.productid
                data.proinfo.mainpic = app.host + data.proinfo.mainpic;
                var status = '';
                if (data.state == 1) status = '正在等待商家接单';
                else if (data.state == 2 && data.state2 == 0) status = '商家已接单，正在等待制作';
                else if (data.state == 2 && data.state2 == 1) status = '已制作完成，待配送';
                else if (data.state == 3) {
                    if (data.type == 2) {
                        // 活动商品 开始结束时间
                        let proinfo = data.proinfo;
                        let endtime = parseInt(proinfo.endtime);
                        let now = new Date().getTime();
                        now = parseInt(now / 1000);
                        let dis = endtime - now;
                        if (dis > 0) {
                            if (dis > 86400) {
                                let day = dis / 86400;
                                day = parseInt(day);
                                let h = dis % 86400;
                                h = h / 3600;
                                h = parseInt(h);
                                status = '还有' + day + '天' + h + '小时自动确认';
                            } else {
                                let h = dis / 3600;
                                h = parseInt(h);
                                status = '还有' + h + '小时自动确认';
                            }

                        } else {

                            status = '已完成';
                        }

                    } else {
                        var sendtime = parseInt(res.data.content.sendtime) + 7 * 86400;
                        var now = new Date().getTime();
                        now = parseInt(now / 1000);
                        var dis = sendtime - now;
                        // console.info(dis);
                        if (dis > 86400) {
                            var day = dis / 86400;
                            day = parseInt(day);
                            var h = dis % 86400;
                            h = h / 3600;
                            h = parseInt(h);
                            status = '还有' + day + '天' + h + '小时自动确认';
                        } else {
                            var h = dis / 3600;
                            h = parseInt(h);
                            status = '还有' + h + '小时自动确认';
                        }
                    }

                }

                var markers = that.data.markers;
                markers[0].latitude = data.proinfo.latitude;
                markers[0].longitude = data.proinfo.longitude;
                // console.info(data)
                that.setData({
                    list: data,
                    orderaddtimestr: app.getLocalTime(data.addtime),
                    paytimestr: app.getLocalTime(data.paytime),
                    accepttimestr: app.getLocalTime(data.accepttime),
                    sendtimestr: app.getLocalTime(data.sendtime),
                    orderstatus: status,
                    markers: markers,
                    productId:productId
                });
            });
    },
    addeditnotes: function() {
        var id = this.data.id;
        wx.navigateTo({
            url: '/pages/index/orderManagement/writeRemark/writeRemark?id=' + id,
        })
    },
    sendgoods: function() {
        var id = this.data.id;
        wx.navigateTo({
            url: '/pages/index/orderManagement/sendgoods/sendgoods?id=' + id
        })
    },
    closeorder: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要关闭这个订单？',
            success: function(res) {
                if (res.confirm) {

                    var _shopid = wx.getStorageSync('shopid');
                    var _id = that.data.id;
                    var params = { id: _id, shopid: _shopid };

                    utils.ajaxRequest(
                        'shopMobile/orderManage/closeOrder',
                        params,
                        function(res) {
                            // 刷新
                            that.refresh();

                        });
                }
            }
        })
    },
    refuseorder: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要拒绝接单？',
            success: function(res) {
                if (res.confirm) {
                    var _id = that.data.id;
                    wx.navigateTo({
                        url: '/pages/index/orderManagement/refuseorder/refuseorder?id=' + _id
                    });
                }
            }
        })
    },
    //已完成制作
    formSubmit: function(e) {
        let _formId = e.detail.formId;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定已完成？',
            success: function(res) {
                if (res.confirm) {

                    var _shopid = wx.getStorageSync('shopid');
                    var _id = that.data.id;
                    var params = { id: _id, shopid: _shopid, formid: _formId };
                    utils.ajaxRequest(
                        'shopMobile/orderManage/donegoods',
                        params,
                        function(res) {
                            // 刷新
                            that.refresh();

                        });
                }
            }
        })
    },
    //已完成订单
    doneOrder: function(e) {
        let that = this;
        let _id = that.data.id;
        wx.showModal({
            title: '提示',
            content: '确定要完成订单？',
            success: function(res) {
                if (res.confirm) {
                    let _shopid = wx.getStorageSync('shopid');
                    let _timestamp = app.getTimeStamp();
                    let params = { id: _id, shopid: _shopid };

                    utils.ajaxRequest(
                        'shopMobile/orderManage/doneOrder',
                        params,
                        function(res) {
                            if (res.data.status = 1) {
                                // 刷新
                                that.refresh();

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
        let that = this;
        let _id = that.data.id;
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
                                that.refresh();
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
    takeorder: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要接单？',
            success: function(res) {
                if (res.confirm) {

                    var _shopid = wx.getStorageSync('shopid');
                    var _id = that.data.id;
                    var params = { id: _id, shopid: _shopid };
                    utils.ajaxRequest(
                        'shopMobile/order/takeOrder',
                        params,
                        function(res) {
                            // 刷新
                            that.refresh();

                        });
                }
            }
        })
    },
    copyno: function(e) {
        var num = e.target.dataset.no;
        wx.setClipboardData({
            data: num,
            success: function(res) {
                wx.showToast({
                    title: '订单号已复制成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
    markertap: function(e) {
        var that = this;
        wx.openLocation({
            latitude: parseFloat(that.data.list.proinfo.latitude),
            longitude: parseFloat(that.data.list.proinfo.longitude),
            name: that.data.list.name,
            address: that.data.list.address,
            scale: 18
        })
    },
})