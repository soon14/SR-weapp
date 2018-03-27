/**
 *  @author Shirui 2018/03/08
 *  37780012@qq.com
 *  拼团确认订单
 */
const md5 = require('../../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        list: null,

        cantuan: 0, //false开团 true参团

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

        productnum: '0', //商品数量

        goodsprice: '0.00', //开团价钱

        pinfo: '0.00', //商品合计

        postage: '0.00', //运费

        totalprice: '0.00', //总价

        groupitemid: '', //成团id

        canclick: true,
        usebalance: '1',
    },
    onLoad: function(options) {
        let that = this;
        console.info(options)
        that.setData({
            id: options.id,
            cantuan: options.cantuan,
            groupitemid: options.group_item_id || '',
        })

        that.getdata();
    },
    getdata: function() {
        /**
         * 商品详情带拼团信息
         * 接口URL：/buyerMobile/product/showProDetailByBuyer
         * 交互类型：POST
         * 传入参数：params{
                id:2953,//产品id
                shopid:204,
                openid:'o7fYO0XSco9M79b1RhiPybyOE3x4',
            }
         */
        wx.showLoading({
            title: '加载中'
        })
        let _shopid = app.shopid;
        let _id = this.data.id;
        let that = this;
        let _openid = wx.getStorageSync('openid');
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ id: _id, shopid: _shopid, openid: _openid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/product/ShowProDetailByBuyer',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',

            complete: function(res) {
                wx.hideLoading();
                console.log(res);
                if (res.data.status == 1) {
                    let list = res.data.content;
                    let nowbalance = parseFloat(res.data.content.nowbalance); //当前用户余额
                    let isbalancepay = that.data.isbalancepay; //支付方式

                    that.setData({
                        list: list,
                        title: list.group.title,
                        nowbalance: list.nowbalance, //余额
                        goodsprice: list.group.price,
                    });

                } else {
                    console.log(res.data.msg)
                }

            }
        });
    },
    formSubmit: function(e) {

        let that = this;

        let _openid = wx.getStorageSync('openid');

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

        let formdata = e.detail.value;
        let _formId = e.detail.formId;

        formdata.formid = e.detail.formId;

        that.groupOrder(formdata);
    },
    groupOrder: function(formdata) {
        /**
        * 开团操作
        * 接口URL：/buyerMobile/groupItem/addGroupOrder
        * 交互类型：POST
        * 传入参数：params{
             id:2953,//产品product_id
             groupsetid:1,//拼团活动id
             fusername:'张三',//取花人名字
             ftelphone:'13000000000',//取花人手机号
             faddress:'亿利达7a21',//取花人地址
             goods_id:2953,//规格商品goods_id
             shopid:204,
             openid:'o7fYO0SfYSweNGBerBES60Lun-98',
             goodsprice:'9.00',//拼团价
             productnum:1,//购买数量
             postage:'2.00',//邮费
             title:'示例商品',//产品名称,需转码
           }
        */

        /**
         * 参团操作：
         * 接口URL：/buyerMobile/groupItem/attendGroupOrder
         * 交互类型：POST
         * 传入参数：
         * params{
               id:2953,//产品product_id
               groupitemid:1,//成团id
               fusername:'张三',
               ftelphone:'13000000000',
               faddress:'亿利达7a21',
               goods_id:2953,//规格商品goods_id
               shopid:204,
               openid:'o7fYO0SfYSweNGBerBES60Lun-98',
               goodsprice:'9.00',//拼团价
               productnum:1,//购买数量
               title:'示例商品',//产品名称,需转码
             }
         */

        let that = this;

        let params = {
            id: that.data.id,
            shopid: app.shopid,
            openid: wx.getStorageSync('openid'),
            goods_id: that.data.list.group.goodsInfo.id,
            faddress: encodeURIComponent(that.data.faddress) || '',
            fusername: encodeURIComponent(that.data.fusername) || '',
            ftelphone: that.data.ftelphone || '',
            goodsprice: that.data.goodsprice,
            productnum: that.data.productnum,
            title: encodeURIComponent(that.data.title)
        };

        params = Object.assign(params, formdata);

        params.note = encodeURIComponent(params.note);

        if (that.data.disable) {
            wx.showModal({
                title: '提示',
                content: '不支持配送到指定的收花地址',
                showCancel: false
            });
            return;
        }

        if (that.data.cantuan == 0) { //开团

            if (!params.faddress || params.faddress.length < 1) {
                wx.showModal({
                    title: '提示',
                    content: '请选择地址',
                    showCancel: false
                });
                return;
            }
        }

        if (params.productnum <= 0) {
            wx.showModal({
                title: '提示',
                content: '请选择购买数量',
                showCancel: false
            });
            return;
        }

        if (that.data.cantuan == 1) { //参团

            params.fusername = encodeURIComponent(params.fusername);
            params.faddress = '';

            if (!params.fusername || params.fusername.length < 1) {
                wx.showModal({
                    title: '提示',
                    content: '请输入取花人姓名',
                    showCancel: false
                });
                return;
            }

            if (!params.ftelphone || params.ftelphone.length < 1) {
                wx.showModal({
                    title: '提示',
                    content: '请输入取花人电话',
                    showCancel: false
                });
                return;
            }
        }

        if (!that.data.canclick) {
            return;
        };

        that.setData({
            canclick: false
        });

        let addUrl;
        let orderSucUrl;

        if (app.haveBindGuangda) {
            console.log('have bind');
            addUrl = app.host + '/buyerMobile/orderBank/add';
            orderSucUrl = app.host + '/buyerMobile/orderBank/ordersuc';
        } else {

            if (that.data.cantuan == 1) {

                params.groupitemid = that.data.groupitemid; //成团id

                //参团
                addUrl = app.host + '/buyerMobile/groupItem/attendGroupOrder';

            } else {

                params.groupsetid = that.data.list.group.id; //拼团活动id
                params.postage = that.data.postage; //邮费

                // 开团
                addUrl = app.host + '/buyerMobile/groupItem/addGroupOrder';
            }

            orderSucUrl = app.host + '/buyerMobile/order/ordersuc';
        }

        params.isbalancepay = that.data.isbalancepay;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify(params);
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        console.log(params)

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

                if (res.data.suc == 1) {
                    var _orderid = res.data.orderid;
                    var group_item_id = res.data.group_item_id; //成团id

                    //根据支付类型判断跳转
                    if (that.data.isbalancepay == '3') {

                        console.log('余额支付')
                        wx.redirectTo({
                            url: '/pages/groupon/grouponDetails/grouponDetails?group_item_id=' + group_item_id + '&orderid=' + _orderid
                        });

                    } else if (that.data.isbalancepay == '1') {
                        let _prepayid = res.data.package;

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
                                let _timestamp1 = app.getTimeStamp();
                                let _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
                                let _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);

                                wx.request({
                                    url: orderSucUrl,
                                    data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                                    method: 'POST',
                                    complete: function(res) {
                                        console.log('wexinPAY', res)
                                        wx.redirectTo({
                                            url: '/pages/groupon/grouponDetails/grouponDetails?group_item_id=' + group_item_id + '&orderid=' + _orderid
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
    // 是否使用余额支付
    checkboxChange: function(e) {
        let isbalancepay = e.detail.value;
        this.setData({
            isbalancepay: isbalancepay
        })

    },
    // 运费
    newGetYunFei: function(provinceName, cityName, countyName, detailInfo) {
        let that = this;

        let _shopid = app.shopid;
        let _productid = that.data.id;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            shopid: _shopid,
            proid: _productid,
            province: encodeURIComponent(provinceName),
            city: encodeURIComponent(cityName),
            county: encodeURIComponent(countyName),
            detailinfo: encodeURIComponent(detailInfo)
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/faretmpl/newGetYunFei',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log('----获取运费');
                console.log(_params);
                console.log(res);
                if (res.data.suc == 1) {

                    that.setData({
                        disable: false,
                        postage: res.data.money //运费
                    });

                    that.calPrice();

                } else {

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
                }

            }
        });
    },
    // 选择地址拿到运费之后的价格
    calPrice: function() {
        let that = this;

        let _shopid = app.shopid;
        let _productid = that.data.id;

        let productprice = that.data.goodsprice;
        let productnum = that.data.productnum;

        if (productnum < 1) {
            productnum = 1;
        }

        let _postage = that.data.postage;

        if (that.data.cantuan == 1) {
            _postage = '0.00';
        }

        //计算价格
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            productprice: productprice,
            productnum: productnum,
            postage: _postage
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        console.log('计算价格---');
        console.log(_params);

        //后台计算价格
        wx.request({
            url: app.host + '/buyerMobile/order/calPrice',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log('选择地址拿到运费之后的价格');
                console.log(res);
                if (res.data.suc == 1) {
                    that.setData({
                        totalprice: res.data.info || '0.00',
                        pinfo: res.data.pinfo || '0.00'
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
                    if (parseFloat(that.data.nowbalance) >= parseFloat(that.data.totalprice)) {
                        that.setData({
                            isbalancepay: '3',
                            usebalance:'1'
                        });
                    } else {
                        that.setData({
                            isbalancepay: '1',
                            usebalance:'0'
                        });
                    }
                    console.log('是否可用微信支付' + that.data.canusewxpay);
                    console.log(that.data.isbalancepay);
                    console.log(that.data.nowbalance);
                    console.log(that.data.totalprice);

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function() {

                        }
                    });
                }
            }
        })
    },
    //选择地址
    selectaddress: function() {
        let that = this;
        let _shopid = app.shopid;
        let _productid = that.data.id;
        wx.chooseAddress({
            success: function(res) {
                // console.log(res)

                that.setData({
                    hasaddress: true,
                    userinfo: res.userName + ' ' + res.telNumber,
                    faddress: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    ftelphone: res.telNumber,
                    fusername: res.userName,
                });

                that.newGetYunFei(res.provinceName, res.cityName, res.countyName, res.detailInfo);
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
    // 判断库存
    hasEnoughNum: function(productnum) {
        let that = this;
        let goodsid = that.data.sizeId;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            goodsid: that.data.list.group.goodsInfo.id,
            buynum: productnum
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/order/hasEnoughNum',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {

                if (res.data.suc == 1) {

                    that.calPrice();

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function() {
                            that.setData({
                                productnum: 1
                            });
                        }
                    });
                }

            }
        })
    },
    //输入 数量
    inputnum: function(e) {
        let that = this;
        let productnum = e.detail.value;

        if (parseInt(productnum) <= 0) {
            productnum = '0';
        }

        that.setData({
            productnum: productnum
        });

        that.hasEnoughNum(productnum);
    },
    //增加数量
    addnum: function() {
        let that = this;
        let productnum = that.data.productnum;

        productnum++;

        that.setData({
            productnum: productnum,
        });

        that.hasEnoughNum(productnum);

    },
    //减少数量
    jiannum: function() {
        let that = this;
        let productnum = that.data.productnum;

        if (parseInt(productnum) <= 0) {
            productnum = '0';
        } else {
            productnum--;
        }

        that.setData({
            productnum: productnum,
        });

        that.hasEnoughNum(productnum);

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