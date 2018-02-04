const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        order_status: '',
        ji_name: '',
        ji_tel: '',
        ji_address: '',
        ji_lat: '',
        ji_lon: '',
        shou_name: '',
        shou_tel: '',
        shou_address: '',
        shou_lat: '',
        shou_lon: '',
        goodsname: '',
        remark: '',
        is_jia: '',
        jia_price: '',
        pay_price: '',
        gl: '',
        zl: '',

        noclose: false, //取消订单失败显示
        showSuccess: false, //取消订单成功显示

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options.orderid);
        this.setData({
            orderid: options.orderid
        })

        this.getOrderDetail(options.orderid);
    },
    querenQJ: function() {
        var that = this;
        wx.request({
            url: getApp().globalData.baseURL + 'Order/getQRSH',
            data: {
                orderId: that.data.orderId,
            },
            method: 'post',
            header: { 'content-type': 'application/json' },
            success: function(res) {
                console.log(res.data)
                console.log(res)
                that.getOrderDetail(that.data.orderId);
                if (res.data.code == 1) {
                    wx.showToast({
                        title: '操作成功！',
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                    })

                }

            },

            fail: function() {
                console.log('数据加载失败')
            }
        })
    },
    querenSH: function() {
        var that = this;
        wx.request({
            url: getApp().globalData.baseURL + 'Order/getQRSD',
            data: {
                orderId: that.data.orderId,
            },
            method: 'post',
            header: { 'content-type': 'application/json' },
            success: function(res) {
                console.log(res.data)
                console.log(res)
                that.getOrderDetail(that.data.orderId);

                if (res.data.code == 1) {
                    wx.showToast({
                        title: '操作成功！',
                    })
                }
            },

            fail: function() {
                console.log('数据加载失败')
            }
        })
    },

    getOrderDetail: function(orderid) {
        var that = this;
        wx.request({
            url: getApp().globalData.baseURL + 'order/getOrderDetailById',

            data: {
                orderId: orderid,
            },
            method: 'post',
            header: { 'content-type': 'application/json' },
            success: function(res) {
                console.log('getOrderDetailById')
                console.log(res.data)

                if (res.data.code == 1) {
                    console.log(res.data.data.orderid);
                    that.setData({
                        orderId: res.data.data.orderid,
                        order_status: res.data.data.order_status,
                        ji_name: res.data.data.ji_name,
                        ji_tel: res.data.data.ji_tel,
                        ji_address: res.data.data.ji_address,
                        ji_lat: res.data.data.ji_lat,
                        ji_lon: res.data.data.ji_lon,
                        shou_name: res.data.data.shou_name,
                        shou_tel: res.data.data.shou_tel,
                        shou_address: res.data.data.shou_address,
                        shou_lat: res.data.data.shou_lat,
                        shou_lon: res.data.data.shou_lon,
                        goodsname: res.data.data.goodsname,
                        remark: res.data.data.remark,
                        isjia: res.data.data.isjia,
                        jia_price: res.data.data.jia_price,
                        pay_price: res.data.data.payprice,
                        gl: res.data.data.gl,
                        zl: res.data.data.zl,
                        getorder_status: res.data.data.getorder_status,
                        time: res.data.data.time,
                    })
                }
            },

            fail: function() {
                console.log('数据加载失败')
            }
        })
    },
    peisongPos: function() {
        wx.navigateTo({
            url: '/pages/peisongyuan/peisongyuan',
        })
    },
    closeO() {
        /**
         * 取消订单
         */
        let that = this;

        let orderid = that.data.orderid;
        that.getOrderDetail(orderid);

        let getorder_status = that.data.getorder_status;
        let order_status = that.data.order_status;

        let time = parseInt(that.data.time); //下单时间的时间戳
        let time1 = time + 180; //加三分钟
        let nowTimestamp = Math.round(new Date() / 1000); //当前时间时间戳
        console.log("弹出提示时候的时间戳", nowTimestamp);

        if (order_status == 3) {
            that.noclose();
            return;
        }

        if (getorder_status == 1 && nowTimestamp > time1) {

            wx.showModal({
                title: '提示',
                content: '您的订单已经由邻速达骑手接单，取消将扣除5元爽约金',
                cancelText: '暂不取消',
                cancelColor: '#5c5c5c',
                confirmText: '确定取消',
                confirmColor: '#f58515',
                success: function(res) {
                    if (res.confirm) {

                        that.closeOrder();

                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })

        } else {

            wx.showModal({
                title: '提示',
                content: '确定取消订单？',
                cancelText: '暂不取消',
                cancelColor: '#5c5c5c',
                confirmText: '确定取消',
                confirmColor: '#f58515',
                success: function(res) {
                    if (res.confirm) {

                        that.getOrderDetail(orderid);

                        getorder_status = that.data.getorder_status;
                        order_status = that.data.order_status;

                        let nowTimestamp1 = Math.round(new Date() / 1000); //当前时间时间戳
                        console.log("点击确定取消订单时候的时间戳", nowTimestamp1);

                        if (getorder_status == 1 && nowTimestamp1 > time1) {

                            wx.showModal({
                                title: '提示',
                                content: '您的订单已经由邻速达骑手接单，取消将扣除5元爽约金',
                                cancelText: '暂不取消',
                                cancelColor: '#5c5c5c',
                                confirmText: '确定取消',
                                confirmColor: '#f58515',
                                success: function(res) {
                                    if (res.confirm) {

                                        that.closeOrder();

                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                            return;
                        }

                        that.closeOrder();

                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }




    },
    closeOrder: function() {
        /**
         * 取消订单
         */
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _orderId = that.data.orderId;

        let params = { openId: _openid, orderId: that.data.orderId };

        wx.request({
            url: app.globalData.baseURL + 'Order/cancel',
            data: params,
            method: 'post',
            success: function(res) {
                console.log('Order/cancel',res)
                if (res.data.code == 1) {

                    that.setData({
                        showSuccess: !that.data.showSuccess
                    })

                    that.getOrderDetail(_orderId);

                    setTimeout(function() {
                        that.setData({
                            showSuccess: !that.data.showSuccess
                        })
                    }, 1500)

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    noclose: function() {
        this.setData({
            noclose: !this.data.noclose
        })
    },


})