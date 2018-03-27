var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        inputValue: '',
        sceneid: '0',
        shopname: '',
        logo: '',
        cdnhost: app.cdnhost,
        openid: null,
    },
    onLoad: function(options) {
        let that = this;
        // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
        let scene = decodeURIComponent(options.scene || '');
        let _openid = wx.getStorageSync('openid') || '';
        if (scene == 'undefined' || scene == undefined || scene == null || scene == 'null' || scene == '') {
            scene = 0;
        }
        that.setData({
            sceneid: scene || 0, //,默认，用户自己从付款菜单点进来付款
            openid: _openid,
        });

        if (_openid.length > 0) {} else {
            app.auth();
        }
        that.getdata();
    },
    onShow: function() {

    },
    // 输入数字
    bindInput: function(e) {
        let that = this;
        let _inputValue = that.data.inputValue + e.target.dataset.num;


        _inputValue = this.twoDecimal(_inputValue);


        this.setData({
            inputValue: _inputValue
        })
    },
    // 每次减去一位数
    close: function() {
        let _inputValue = this.data.inputValue;

        this.setData({
            inputValue: _inputValue.substring(0, _inputValue.length - 1) || ''
        })
    },
    // 付款
    sendpay: function() {
        let that = this;
        var _shopid = app.shopid;
        var _timestamp = app.getTimeStamp();
        var _paramsfirst = JSON.stringify({ shopid: _shopid });
        var _signfirst = md5.hex_md5(_timestamp + _paramsfirst + app.shopkey);
        // console.log(_paramsfirst);
        //当前店铺是否已经开通光大支付
        if (app.isBingGuangda == 1) {
            console.log('have bind');
            var Url = app.host + '/buyerMobile/orderBank/selfPay';
        } else {
            var Url = app.host + '/buyerMobile/orderBank/selfPay';
        }

        let _inputValue = that.data.inputValue;
        // _inputValue = that.mustTwoDecimal(_inputValue);
        console.log('-------付款-------');
        var _money = _inputValue;

        if (_money <= 0 || _money == '' || _money == undefined || _money == null || _money == "undefined") {
            return;
        }
        
        var _openid = wx.getStorageSync('openid');
        var _sceneid = that.data.sceneid;
        var _params = JSON.stringify({ shopid: _shopid, money: _money, openid: _openid, sceneid: _sceneid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        console.log(_params);
        console.log(_openid);
        // return;
        wx.request({
            url: Url,
            // url: 'https://ce.ilearnmore.net/buyerMobile/orderBank/selfPay',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res);
                var suc = res.data.suc;
                if (suc == 1) {
                    var _orderid = res.data.orderid;
                    var _prepayid = res.data.package;
                    //余额支付流程
                    if (res.data.msg == 'balancepay') {
                        var _timestamp1 = app.getTimeStamp();
                        var _params1 = JSON.stringify({ orderid: _orderid, prepayid: _prepayid });
                        var _sign1 = md5.hex_md5(_timestamp1 + _params1 + app.shopkey);
                        wx.request({
                            url: app.host + '/buyerMobile/orderBank/selfPaySuc',
                            data: { shopid: app.shopid, timestamp: _timestamp1, params: _params1, sign: _sign1 },
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            method: 'POST',
                            success: function(res3) {
                                console.log(res);
                                // wx.redirectTo({
                                //   url: '/pages/order/selfPaySuc?id=' + _orderid
                                // });

                                //付款成功
                                wx.redirectTo({
                                    url: '/pages/order/paysuccess/paysuccess?id=' + _orderid
                                });

                            },
                            fail: function(reserr) {
                                console.info(reserr);
                            }
                        })
                    } else {
                        //在线支付流程
                        wx.requestPayment({
                            timeStamp: res.data.timeStamp + '',
                            nonceStr: res.data.nonceStr,
                            package: res.data.package,
                            signType: res.data.signType,
                            paySign: res.data.paySign,
                            'success': function(res2) {
                                console.info(res2);
                                // that.setData({
                                //     canclick: false
                                // });
                                wx.switchTab({
                                    url: '/pages/me/me'
                                });
                            },
                            'fail': function(res4) {
                                that.setData({
                                    canclick: false
                                });
                                // wx.redirectTo({
                                //   url: '/pages/me/me' 
                                // });
                            }
                        })

                    }

                } else {
                    that.setData({
                        canclick: false
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

        return;

    },
    // 获取页面信息
    getdata: function() {
        /* 
            场景id获取店铺信息 buyerMobile/shop/getShopInfoBySceneId
            参数sceneid
         */
        var that = this;
        wx.showLoading({
            title: '加载中...',
        });
        var _inputValue = encodeURIComponent(that.data.inputValue);
        var _timestamp = app.getTimeStamp();
        var _paramsscene = JSON.stringify({ sceneid: that.data.sceneid, shopid: app.shopid });
        var _signscene = md5.hex_md5(_timestamp + _paramsscene + app.shopkey);
        console.log(_paramsscene);
        wx.request({
            url: app.host + '/buyerMobile/shop/getShopInfoBySceneId',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _paramsscene, sign: _signscene },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.suc == 1) {
                    that.setData({
                        shopname: res.data.info.name,
                        logo: res.data.info.logo
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        confirmText: '确定',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }

            }
        })
    },
    twoDecimal: function(number) {
        var index = number.indexOf(".");
        var index0 = number.indexOf("0");
        if (index0 == 0 && index !== 1) {
            number = 0 + '.'
        } else if (index >= 0) {
            let arr = number.split(".");
            if (arr[0] < 1) {
                arr[0] = 0;
            }
            number = arr[0] + '.' + arr[1].substring(0, 2);
        }
        return number;
    },
    //历史记录
    historicalRecords: function() {
        wx.navigateTo({
            url: '/pages/order/historicalRecords/historicalRecords'
        })
    }


})