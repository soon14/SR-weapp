// 收花人信息
var md5 = require('../../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        productid: null,

        hasaddress: false,
        userinfo: '',
        address: '',

        purposes: null, //送给谁
        purposeIndex: 0,

        needCard: ['不需要', '需要'], //1需要卡片 0不需要
        needCardIndex: 1,

        checkisselftake:app.checkisselftake

    },
    onLoad: function() {
        // console.info(app.checkisselftake)
        this.setData({
            purposes: app.purpose,
            productid: app.goBuyData.productid,
            checkisselftake:app.checkisselftake
        });
    },
    // 配送方式
    bindDistributionMode: function(e) {
        // console.log(e);
        this.setData({
            type: e.target.dataset.type
        });
    },
    // 送给谁
    bindPurposeChange: function(e) {
        this.setData({
            purposeIndex: e.detail.value,
        })

    },
    // 需要卡片
    bindNeedCardChange: function(e) {
        this.setData({
            needCardIndex: e.detail.value,
        })

    },
    //选择地址
    selectaddress: function() {
        var that = this;
        var _shopid = app.shopid;
        var _productid = that.data.productid;
        wx.chooseAddress({
            success: function(res) {
                // console.log(res)
                let provinceName = res.provinceName;
                let cityName = res.cityName;
                let countyName = res.countyName;
                // let detailInfo = res.detailInfo;
                // that.userDistance(provinceName, cityName, countyName, detailInfo);

                that.setData({
                    hasaddress: true,
                    userinfo: res.userName + ' ' + res.telNumber,
                    address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                });

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
                                yunfei: res.data.money,
                                totalprice: (parseFloat(res.data.money) + parseFloat(that.data.price)).toFixed(2)
                            });
                            console.log('---实际运费');
                            console.log(that.data.yunfei);
                            app.fareyunfei = null;
                            app.fareyunfei = that.data.yunfei;
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
    //获取位置经纬度
    // userDistance: function(provinceName, cityName, countyName, detailInfo) {
    //     let that = this;
    //     let _productid = that.data.productid;
    //     let _timestamp = app.getTimeStamp();
    //     let _params = JSON.stringify({
    //         shopid: app.shopid,
    //         productid: _productid,
    //         provincename: encodeURIComponent(provinceName),
    //         cityname: encodeURIComponent(cityName),
    //         countyname: encodeURIComponent(countyName),
    //         detailinfo: encodeURIComponent(detailInfo),
    //     });
    //     let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

    //     wx.request({
    //         url: app.host + '/buyerMobile/order/userDistance',
    //         data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
    //         header: { "Content-Type": "application/x-www-form-urlencoded" },
    //         method: 'POST',
    //         complete: function(res) {
    //             console.log(res)
    //             if (res.data.suc == 1) {
    //                 that.setData({
    //                     latitude: res.data.latitude,
    //                     longitude: res.data.longitude,
    //                 });

    //             } else {
    //                 wx.showModal({
    //                     title: '提示',
    //                     content: res.data.msg,
    //                     showCancel: false,
    //                     success: function(res) {

    //                     }
    //                 });
    //             }

    //         }
    //     });
    // },
    //下一步
    formSubmit: function(e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let formdata = e.detail.value;

        // if (formdata.address == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '请选择收货地址',
        //         showCancel: false,
        //         success: function(res) {

        //         }
        //     });
        //     return;
        // } else if (formdata.needcard && formdata.cardwords == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '卡片留言还未填写',
        //         showCancel: false,
        //         success: function(res) {

        //         }
        //     });
        //     return;
        // }

        app.goBuyData = Object.assign(formdata, app.goBuyData);

        wx.navigateTo({
            url: '/pages/order/payInfo/orderSettlement/orderSettlement'
        })
    },

})