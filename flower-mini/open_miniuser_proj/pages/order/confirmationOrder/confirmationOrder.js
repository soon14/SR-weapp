// 订单结算
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        type: '1', //1实物 2活动
        title: null, //商品名
        numArry: null, //商品数量
        numIndex: 0,

        productnum: '1', //商品数量
        price: null, //商品单价

        needcard: '0', //1需要卡片 0不需要

        purposeIndex: 0,
        purposes: app.purpose, //赠送对象列表

        //总价
        totalprice: '0.00',

        //配送费用
        postage: '0.00',

        isanonymous: '-1', //是否匿名 匿名1，不匿名-1

        canclick: true,

        isselftake: '1', //配送方式 默认自提1 非自提0
        productnum: '0',
        goods_id: null,
        productprice: null,
        needsendtime: null,

        purpose: null,

        discount: null, //优惠金额

        commodityAggregate: '0.00', //商品合计

        isyt: '0', //是否自用

        songdate: null, //配送日期

        songdatename: false, //配送时间名称显示

        address: null, //地址

        // 订购人电话
        telphone: null,
        // 订购人姓名
        username: null,

        // 收花人地址
        faddress: null,
        // 收花人姓名
        fusername: null,
        // 收花人电话
        ftelphone: null,

        // 支付方式 余额支付3 微信支付1 光大2
        peytypeList: [{
            'name': '余额支付',
            'id': '3',
            'checked': true
        }, {
            'name': '微信支付',
            'id': '1'
        }],
        isbalancepay: '3', //支付方式

        nowbalance: null, //余额
        canusewxpay: 0,

    },
    onLoad: function(options) {
        var that = this;
        that.songdate();
        that.getUserTel();

        let _id = options.id;
        let _isyt = options.isyt;

        app.payinfodata.productid = _id;
        let productnum = app.payinfodata.productnum;
        let productprice = app.payinfodata.productprice;
        let isselftake = app.payinfodata.isselftake;
        let type = app.payinfodata.type;
        let commodityAggregate = parseFloat(productnum * productprice).toFixed(2);
        let songdatename = that.data.songdatename;
        let calprice = app.payinfodata.calprice;

        console.log('-----calprice' + calprice);

        if (isselftake == 1 && _isyt == 0) {
            songdatename = true;
        }

        that.setData({
            id: _id,
            isselftake: app.payinfodata.isselftake,
            productnum: app.payinfodata.productnum,
            goods_id: app.payinfodata.goods_id,
            productprice: app.payinfodata.productprice,
            isselftake: app.payinfodata.isselftake,
            isyt: app.payinfodata.isyt,
            commodityAggregate: commodityAggregate,
            isyt: _isyt,
            type: type,
            songdatename: songdatename,
            totalprice: calprice
        });

        if (that.data.totalprice == '0' || that.data.totalprice == '0.00' || that.data.totalprice == 0) {
            that.setData({
                canusewxpay: 0
            });
        } else {
            that.setData({
                canusewxpay: 1
            });
        }
        if (parseFloat(that.data.nowbalance) >= parseFloat(app.payinfodata.calprice)) {
            that.setData({
                isbalancepay: '3'
            });
        } else {
            that.setData({
                isbalancepay: '1'
            });
        }
        console.log('微信支付' + that.data.canusewxpay);

        that.getProduct();

        that.getValidCoupons();
    },
    onShow: function() {
        var that = this;
        console.log('-----合计------')
        if (app.payinfodata.couponid) {
            that.getOneCoupon()
        }
        console.log('app.payinfo');
        console.log(app.payinfodata);

        that.setData({
            totalprice: app.payinfodata.calprice
        });
        if (that.data.totalprice == '0' || that.data.totalprice == '0.00' || that.data.totalprice == 0) {
            that.setData({
                canusewxpay: 0
            });
        } else {
            that.setData({
                canusewxpay: 1
            });
        }
        console.log('微信支付' + that.data.canusewxpay);

    },
    //日期
    songdate: function() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        var that = this;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;

        let str = year + '-' + month + '-' + date;

        that.setData({
            songdate: str,
            startdata: str
        })
        // console.log(str)
    },
    // 配送时间
    bindDateChange: function(e) {
        var that = this;
        that.setData({
            songdate: e.detail.value
        })
    },
    // 是否使用余额支付
    checkboxChange: function(e) {
        let isbalancepay = e.detail.value;
        this.setData({
            isbalancepay: isbalancepay
        })
        console.log(isbalancepay)

    },
    // 订购人姓名
    bindusername: function(e) {
        this.setData({
            username: e.detail.value
        })
        app.payinfodata.username = e.detail.value;
    },
    // 订购人电话
    bindtelphone: function(e) {
        this.setData({
            telphone: e.detail.value
        })
        app.payinfodata.telphone = e.detail.value;
    },
    // 取花人姓名
    bindfusername: function(e) {
        this.setData({
            fusername: e.detail.value
        })
        app.payinfodata.fusername = e.detail.value;
    },
    // 取花人电话
    bindftelphone: function(e) {
        this.setData({
            ftelphone: e.detail.value
        })
        app.payinfodata.ftelphone = e.detail.value;
    },
    // 获取商品信息
    getProduct: function() {
        var that = this;
        var _productid = that.data.id;
        var _shopid = app.shopid;
        var _openid = wx.getStorageSync('openid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: _shopid, id: _productid, openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/product/ShowProDetailByBuyer',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res)
                let nowbalance = parseFloat(res.data.content.nowbalance); //当前用户余额
                let isbalancepay = that.data.isbalancepay; //支付方式

                that.setData({
                    title: res.data.content.title,
                    price: res.data.content.price,
                    propic: app.cdnhost + res.data.content.mainpic,
                    is_useticket: res.data.content.is_useticket, //是否可以使用优惠券0不可以，1可以
                    sharecouponid: res.data.content.sharecouponid, //是否有在进行的社交立减金活动,0没有,其他为社交立减金活动id
                    nowbalance: nowbalance, //当前用户余额
                    isbalancepay: isbalancepay, //支付方式
                    telphone: res.data.content.userinfo.telphone, //订购人电话
                    ftelphone: res.data.content.userinfo.telphone, //订购人电话
                    username: res.data.content.userinfo.name, //订购人姓名
                    fusername: res.data.content.userinfo.name, //订购人姓名
                    totalprice: app.payinfodata.calprice
                });
                if (that.data.totalprice == '0' || that.data.totalprice == '0.00' || that.data.totalprice == 0) {
                    that.setData({
                        canusewxpay: 0
                    });
                } else {
                    that.setData({
                        canusewxpay: 1
                    });
                }

                if (parseFloat(that.data.nowbalance) >= parseFloat(app.payinfodata.calprice)) {
                    that.setData({
                        isbalancepay: '3'
                    });
                } else {
                    that.setData({
                        isbalancepay: '1'
                    });
                }
                console.log('微信支付' + that.data.canusewxpay);

                console.log('----余额--' + that.data.nowbalance);
                console.log('----默认支付方式--' + that.data.isbalancepay);
                console.log('----总价--' + that.data.totalprice);

            }
        });
    },
    //需要卡片
    switchneedcardChange: function(e) {

        let needcard = this.data.needcard;

        if (e.detail.value == true) {
            needcard = '1';
        } else {
            needcard = '0';
        }

        this.setData({
            needcard: needcard
        })
    },
    //是否匿名
    switchisanonymousChange: function(e) {

        let isanonymous = this.data.isanonymous;

        if (e.detail.value == true) {
            isanonymous = '-1';
        } else {
            isanonymous = '1';
        }

        this.setData({
            isanonymous: isanonymous
        })
    },
    // 送给谁
    bindPurposeChange: function(e) {
        this.setData({
            purposeIndex: e.target.dataset.index
        })
    },
    //选择地址
    selectaddress: function() {
        var that = this;
        var _shopid = app.shopid;
        var _productid = that.data.id;
        wx.chooseAddress({
            success: function(res) {
                // console.log(res)
                let provinceName = res.provinceName;
                let cityName = res.cityName;
                let countyName = res.countyName;
                let ftelphone = res.telNumber;
                let fusername = res.userName;

                that.setData({
                    hasaddress: true,
                    userinfo: res.userName + ' ' + res.telNumber,
                    address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    ftelphone: ftelphone,
                    fusername: fusername,
                });

                app.payinfodata.fusername = fusername;
                app.payinfodata.ftelphone = ftelphone;

                //用户填写的地址，到店自提时留空
                app.buyaddress = null;
                app.buyaddress = that.data.address;

                var _timestamp = app.getTimeStamp();
                var _params = JSON.stringify({
                    shopid: _shopid,
                    proid: _productid,
                    province: encodeURIComponent(res.provinceName),
                    city: encodeURIComponent(res.cityName),
                    county: encodeURIComponent(res.countyName),
                    detailinfo: encodeURIComponent(res.detailInfo)
                });
                var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

                wx.request({
                    url: app.host + '/buyerMobile/faretmpl/newGetYunFei',
                    data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    method: 'POST',
                    complete: function(res) {
                        console.log('----获取运费');
                        console.log(_params);
                        console.log(res);
                        if (parseFloat(res.data.suc) == 0) {

                            that.setData({
                                disable: true
                            });
                            wx.showModal({
                                title: '提示',
                                content: res.data.msg,
                                showCancel: false,
                                success: function(res) {

                                }
                            });
                            return;
                        } else {
                            that.setData({
                                disable: false,
                                postage: res.data.money,
                            });
                            console.log('---实际运费');
                            console.log(that.data.postage);
                            app.payinfodata.postage = null;
                            app.payinfodata.postage = that.data.postage;

                            //计算价格
                            var _timestamp = app.getTimeStamp();
                            var _params = JSON.stringify({ productprice: app.payinfodata.productprice, productnum: app.payinfodata.productnum, postage: app.payinfodata.postage });
                            var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                            console.log('计算价格---');
                            console.log(_params);
                            // return;
                            //后台计算价格
                            wx.request({
                                url: app.host + '/buyerMobile/order/calPrice',
                                data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                                header: { "Content-Type": "application/x-www-form-urlencoded" },
                                method: 'POST',
                                complete: function(res) {
                                    console.log('选择地址拿到运费之后的价格');
                                    console.log(res);
                                    app.payinfodata.calprice = res.data.info;
                                    that.setData({
                                        totalprice: app.payinfodata.calprice
                                    });
                                    if (that.data.totalprice == '0' || that.data.totalprice == '0.00' || that.data.totalprice == 0) {
                                        that.setData({
                                            canusewxpay: 0
                                        });
                                    } else {
                                        that.setData({
                                            canusewxpay: 1
                                        });
                                    }
                                    if (parseFloat(that.data.nowbalance) >= parseFloat(app.payinfodata.calprice)) {
                                        that.setData({
                                            isbalancepay: '3'
                                        });
                                    } else {
                                        that.setData({
                                            isbalancepay: '1'
                                        });
                                    }
                                    console.log('微信支付' + that.data.canusewxpay);
                                }
                            })
                        }

                    }
                });
            },
            fail: function(res) {
                // console.info(res);
                if (res.errMsg.indexOf('auth deny') > 0) {
                    wx.showModal({
                        title: '提示',
                        confirmText: '去授权',
                        content: '请授权访问你的收货地址',
                        showCancel: false,
                        success: function(res) {
                            wx.openSetting({
                                success: function() {

                                }
                            })
                        }
                    });
                }
            }
        })
    },
    formSubmit: function(e) {
        var that = this;

        var _openid = wx.getStorageSync('openid');

        if (_openid == '' || _openid == 'undefined' || _openid == undefined || _openid == null) {
            wx.showModal({
                title: '提示',
                confirmText: '去授权',
                content: '您还没有授权获取您的信息',
                showCancel: false,
                success: function(res) {
                    that.applyuser();
                }
            });
            return;
        }

        // console.log(e.detail.value)
        let formdata = e.detail.value;

        formdata = Object.assign(app.payinfodata, formdata);
        // console.log(formdata)
        // return;
        var _formId = e.detail.formId;
        var _shopid = app.shopid;
        let isselftake = formdata.isselftake;
        let address = formdata.address || '';

        if (that.data.disable) {
            wx.showModal({
                title: '提示',
                content: '不支持配送到指定的收花地址',
                showCancel: false
            });
            return;
        }

        if (isselftake == 0 && address == '') {
            wx.showModal({
                title: '提示',
                content: '请选择地址',
                showCancel: false
            });
            return;
        }

        if (!that.data.canclick) {
            return;
        };
        that.setData({
            canclick: false
        });

        let isyt = that.data.isyt;

        if (parseInt(isyt) == 0) {
            formdata.purpose = '自用';
        }

        let m_username = formdata.isselftake == '1' ? encodeURIComponent(formdata.fusername) : (parseInt(isyt) == 0 ? '' : encodeURIComponent(formdata.username));
        let m_telphone = formdata.isselftake == '1' ? formdata.ftelphone : (parseInt(isyt) == 0 ? '' : formdata.telphone)
        let m_needcards = formdata.needcard;
        let m_cardwords = formdata.cardwords ? encodeURIComponent(formdata.cardwords) : '';
        if (that.data.type == 2) {
            m_username = encodeURIComponent(formdata.username);
            m_telphone = formdata.telphone;
            m_needcards = 0;
            formdata.purpose = '其他';
        }
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({
            shopid: _shopid,
            openid: _openid,
            goods_id: formdata.goods_id,
            title: encodeURIComponent(that.data.title),
            username: m_username,
            telphone: m_telphone,
            faddress: formdata.address ? encodeURIComponent(formdata.address) : '', //到店自提传空值
            goodsprice: formdata.productprice,
            productnum: formdata.productnum,
            postage: formdata.postage ? formdata.postage : '0.00',
            note: formdata.note ? encodeURIComponent(formdata.note) : '',
            needcard: m_needcards,
            cardwords: m_cardwords,
            isanonymous: that.data.isanonymous, //匿名1，不匿名-1
            purpose: encodeURIComponent(formdata.purpose),
            isselftake: formdata.isselftake,
            needsendtime: that.data.songdate,
            couponid: that.data.couponid, //优惠券id
            formid: _formId,
            fusername: formdata.isselftake == '1' ? '' : encodeURIComponent(formdata.fusername),
            ftelphone: formdata.isselftake == '1' ? '' : formdata.ftelphone,
            isbalancepay: that.data.isbalancepay,
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
        console.log('------order---');
        console.log(_params);
        console.log(addUrl);
        console.log('----立减金id---' + that.data.sharecouponid);
        console.log('----优惠券id---' + that.data.couponid);
        // return;
        wx.request({
            url: addUrl,
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {

            },
            complete: function(res) {
                console.log('--下单完成complete');
                console.log(res.data);

                var suc = res.data.suc;
                if (suc == 1) {
                    var _orderid = res.data.orderid;

                    //根据支付类型判断跳转
                    if (that.data.isbalancepay == '3') {
                        wx.redirectTo({
                            url: '/pages/order/confirmationOrder/paysuc/paysuccess?promotionid=' + that.data.sharecouponid + '&orderid=' + _orderid
                        });
                        // //店铺有立减金活动 去立减金页面
                        // if (that.data.sharecouponid > 0) {
                        //     // console.log('-wx----balancepay1');
                        //     wx.redirectTo({
                        //         url: '/pages/me/sharingCoupons/sharingCoupons?promotionid=' + that.data.sharecouponid + '&orderid=' + _orderid
                        //     });
                        // } else {
                        //     wx.showModal({
                        //         title: '提示',
                        //         content: '支付成功',
                        //         showCancel: false,
                        //         success: function(res) {
                        //             // console.log('-wx----balancepay2');
                        //             wx.redirectTo({
                        //                 url: '/pages/me/orderdetails?id=' + _orderid
                        //             });
                        //         }
                        //     });
                        // }
                        // return;

                    } else if (that.data.isbalancepay == '1') {
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
                                        // wx.redirectTo({
                                        //     url: '/pages/order/confirmationOrder/paysuc/paysuccess?promotionid=' + that.data.sharecouponid + '&orderid=' + _orderid
                                        // });
                                        // 店铺有立减金活动 去立减金页面
                                        if (that.data.sharecouponid > 0) {
                                            // console.log('-wx----wxpay1');
                                            wx.redirectTo({
                                                url: '/pages/me/sharingCoupons/sharingCoupons?promotionid=' + that.data.sharecouponid + '&orderid=' + _orderid
                                            });
                                        } else {
                                            // console.log('-wx----wxpay2');
                                            wx.redirectTo({
                                                url: '/pages/me/orderdetails?id=' + _orderid
                                            });
                                        }

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
                                // console.log('-wx----wxpay3');
                            }
                        });
                    } else {
                        console.log('暂不支持此支付方式');
                    }

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
    },
    //用户单个优惠券信息
    getOneCoupon: function() {
        let that = this;
        let _shopid = app.shopid;
        let couponid = app.payinfodata.couponid;
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            couponid: couponid
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/coupon/showUserCoupon',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.info('-----用户单个优惠券信息----')
                console.log(_params)
                console.log(res)
                try {
                    that.setData({
                        discount: res.data.value,
                    })
                } catch (e) {
                    console.log(e)
                }

                //计算价格
                var _timestamp = app.getTimeStamp();
                var _params = JSON.stringify({ productprice: app.payinfodata.productprice, productnum: app.payinfodata.productnum, postage: app.payinfodata.postage, couponid: couponid });
                var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                console.log('用户选择优惠券之后---');
                console.log(_params);
                // return;
                //后台计算价格
                wx.request({
                    url: app.host + '/buyerMobile/order/calPrice',
                    data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    method: 'POST',
                    complete: function(res) {
                        console.log('用户选择优惠券之后的价格');
                        console.log(res);
                        app.payinfodata.calprice = res.data.info;
                        that.setData({
                            totalprice: app.payinfodata.calprice
                        });
                        if (that.data.totalprice == '0' || that.data.totalprice == '0.00' || that.data.totalprice == 0) {
                            that.setData({
                                canusewxpay: 0
                            });
                        } else {
                            that.setData({
                                canusewxpay: 1
                            });
                        }

                        if (parseFloat(that.data.nowbalance) >= parseFloat(app.payinfodata.calprice)) {
                            that.setData({
                                isbalancepay: '3'
                            });
                        } else {
                            that.setData({
                                isbalancepay: '1'
                            });
                        }

                        console.log('微信支付' + that.data.canusewxpay);
                    }
                })
            }
        });
    },
    // 获取数据
    getValidCoupons: function() {
        /*
        可用优惠券列表接口 buyerMobile/coupon/getValidCoupons
        参数 product_id(商品id),openid,total_money(总价),shopid
        */
        let that = this;
        let _proid = app.payinfodata.productid;
        let total_money = that.data.commodityAggregate; //总价
        let _shopid = app.shopid;
        let _openid = wx.getStorageSync('openid');

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            openid: _openid,
            shopid: _shopid,
            product_id: _proid,
            total_money: total_money
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        console.log('----最优优惠券参数');
        console.log(_params);
        wx.request({
            url: app.host + '/buyerMobile/coupon/getValidCoupons',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log('----最优优惠券');
                console.log(res);
                try {
                    that.setData({
                        discount: res.data.data[0].value,
                        couponid: res.data.data[0].id,
                    })

                    console.log('优惠券id--');
                    console.log(that.data.couponid);
                    //计算价格
                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ productprice: app.payinfodata.productprice, productnum: app.payinfodata.productnum, postage: app.payinfodata.postage, couponid: that.data.couponid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                    console.log('获取最优优惠券之后---');
                    console.log(_params);
                    // return;
                    //后台计算价格
                    wx.request({
                        url: app.host + '/buyerMobile/order/calPrice',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: 'POST',
                        complete: function(res) {
                            console.log('获取最优优惠券之后的价格');
                            console.log(res);
                            app.payinfodata.calprice = res.data.info;
                            that.setData({
                                totalprice: app.payinfodata.calprice
                            });

                            if (that.data.totalprice == '0' || that.data.totalprice == '0.00' || that.data.totalprice == 0) {
                                that.setData({
                                    canusewxpay: 0
                                });
                            } else {
                                that.setData({
                                    canusewxpay: 1
                                });
                            }
                            if (parseFloat(that.data.nowbalance) >= parseFloat(app.payinfodata.calprice)) {
                                that.setData({
                                    isbalancepay: '3'
                                });
                            } else {
                                that.setData({
                                    isbalancepay: '1'
                                });
                            }
                            console.log('微信支付' + that.data.canusewxpay);

                        }
                    })

                } catch (e) {
                    console.log(e)
                }
            }
        });
    },
    //判断是否有手机号
    getUserTel: function() {
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            openid: _openid
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/wxuser/getUserTel',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                if (res.data.suc == 1) {
                    let telphone = res.data.info;
                    that.setData({
                        telphone: telphone,
                        ftelphone: telphone
                    })
                }
            }
        });
    },
    applyuser: function() {
        wx.login({
            success: function(res) {
                if (res.code) {
                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ code: res.code, shopid: app.shopid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                    wx.request({
                        url: app.host + '/mobile/wxuser/index',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        success: function(res) {
                            // console.info(res.data);
                            var openid = res.data.openid;
                            wx.setStorage({
                                key: "openid",
                                data: openid
                            });
                        }
                    });
                }
            },
            fail: function(res) {
                console.info('login fail ');
            }
        })
    }

})