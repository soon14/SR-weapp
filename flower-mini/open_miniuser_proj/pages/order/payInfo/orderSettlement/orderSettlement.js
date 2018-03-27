// 订单结算
var md5 = require('../../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        title: null, //商品名
        numArry: null, //商品数量
        numIndex: 0,

        productnum: '1', //商品数量
        price: null, //商品单价

        //配送时间
        songdate: null,

        //总价
        totalprice: '0.00',

        //配送费用
        postage: '0.00',

        isselftake: '0', //配送方式

        canclick: true,

    },
    onLoad: function(options) {

        this.getProduct();

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();

        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;

        var str = year + '-' + month + '-' + date;

        this.setData({
            songdate: str,
            isselftake: app.goBuyData.isselftake,
        });

    },
    // 获取商品信息
    getProduct: function() {
        var that = this;
        var _productid = app.goBuyData.productid;
        var _shopid = app.shopid;

        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: _shopid, id: _productid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/product/ShowProDetailByBuyer',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res)
                let _productnum = parseInt(res.data.content.num); //商品数量
                let numArry = [];
                for (var i = 1; i <= _productnum; i++) {
                    numArry.push(i);
                }

                that.setData({
                    productnum: res.data.content.num,
                    numArry: numArry,
                    title: res.data.content.title,
                    price: res.data.content.price,
                    propic: app.cdnhost + res.data.content.mainpic,
                    totalprice: res.data.content.price,
                    is_useticket: res.data.content.is_useticket,//是否可以使用优惠券0不可以，1可以
                });

                app.goBuyData.totalprice = res.data.content.price;
            }
        });
    },
    // 购买数量
    bindNumChange: function(e) {

        let _totalprice = this.toDecimal(parseInt(this.data.numArry[e.detail.value]) * parseFloat(this.data.price)); //商品总价

        this.setData({
            numIndex: e.detail.value,
            totalprice: _totalprice
        })

    app.goBuyData.totalprice = _totalprice;

    },
    //制保留2位小数，如：2，会在2后面补上00.即2.00 
    toDecimal: function(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    },
    // 配送时间
    bindDateChange: function(e) {
        this.setData({
            songdate: e.detail.value
        })
    },
    formSubmit: function(e) {
        console.log(e.detail.value)
        let formdata = e.detail.value;
        formdata = Object.assign(app.goBuyData, formdata);

        var _formId = e.detail.formId;
        var _shopid = app.shopid;
        var _openid = wx.getStorageSync('openid');
        // var formdata = e.detail.value;
        var that = this;

        if (!that.data.canclick) {
            return;
        };
        that.setData({
            canclick: false
        });
        
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({
            shopid: _shopid,
            openid: _openid,
            productid: formdata.productid,
            title: encodeURIComponent(that.data.title),
            username: encodeURIComponent(formdata.username),
            telphone: formdata.telphone,
            address: app.buyaddress ? encodeURIComponent(app.buyaddress) : '',//到店自提传空值
            productprice: that.data.price,
            productnum: formdata.productnum,
            postage: app.fareyunfei ? app.fareyunfei :'0.00',
            note: formdata.note ? encodeURIComponent(formdata.note) : '',
            needcard: formdata.needcard,
            cardwords: formdata.cardwords ? encodeURIComponent(formdata.cardwords) : '',
            isanonymous: formdata.isanonymous=='1' ? formdata.isanonymous : '-1',//匿名1，不匿名-1
            purpose: encodeURIComponent(formdata.purpose),
            isselftake: formdata.isselftake,
            needsendtime: formdata.songdate,
            couponid: app.mycouponid,//优惠券id
            // coupon_code: formdata.coupon_code,//优惠券码
            formId: _formId
        });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        if (app.haveBindGuangda) {
            console.log('have bind');
            var addUrl = app.host + '/buyerMobile/orderBank/add';
            var orderSucUrl = app.host + '/buyerMobile/orderBank/ordersuc';
        } else {
            var addUrl = app.host + '/buyerMobile/order/wxOrderAdd';
            var orderSucUrl = app.host + '/buyerMobile/order/ordersuc';
        }
        console.log(addUrl);
        console.log(orderSucUrl);
        console.log(that.data.is_useticket);
        console.log(app.buyaddress);
        console.log(_params);
        // return;
        wx.request({
            url: addUrl,
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log('--下单完成success');
                // console.log(res.data)
            },
            complete: function(res) {
                // console.log('--下单完成complete');
                // console.log(res.data);


                var suc = res.data.suc;
                if (suc == 1) {
                    var _orderid = res.data.orderid;
                    var _prepayid = res.data.package;
                    wx.requestPayment({
                        timeStamp: res.data.timeStamp + '',
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: res.data.signType,
                        paySign: res.data.paySign,
                        'success': function(res) {
                            console.info(res);
                            that.setData({
                                canclick: true
                            });
                            var _timestamp1 = app.getTimeStamp();
                            var _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
                            var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);

                            wx.request({
                                url: orderSucUrl,
                                data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                                header: { "Content-Type": "application/x-www-form-urlencoded" },
                                method: 'POST',
                                complete: function(res) {
                                    app.goBuyData = null;
                                    wx.redirectTo({
                                        url: '/pages/order/ordersuc?id=' + _orderid
                                    });
                                }
                            })

                        },
                        'fail': function(res) {
                            that.setData({
                                canclick: true
                            });
                            wx.redirectTo({
                                url: '/pages/me/orderdetails?id=' + _orderid
                            });
                        }
                    });
                } else {
                    that.setData({
                        canclick: true
                    });
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {

                        }
                    });
                    return;
                }
            }
        })
    }

})