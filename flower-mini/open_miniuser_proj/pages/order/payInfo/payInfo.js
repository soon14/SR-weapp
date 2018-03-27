// 订购人信息
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        productid: null, //商品id

        tellArray: [
            '不告诉',
            '告诉',
        ],
        tellIndex: 1,

        isselftake: '1', //配送方式 默认自提1 非自提0

    },
    onLoad: function(options) {
        // console.log(options);

        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();

        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;

        let str = year + '-' + month + '-' + date;

        this.setData({
            productid: options.productid || '', //产品ID,
            purposes: app.purpose,
            songdate: str
        });

        app.checkisselftake = null;
        app.checkisselftake = this.data.isselftake;
    },
    // 配送方式
    bindDistributionMode: function(e) {
        // console.log(e);
        this.setData({
            isselftake: e.target.dataset.isselftake
        });

        app.checkisselftake = this.data.isselftake;
    },
    // 是否告诉收花人你的名字
    bindPickerChange: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            tellIndex: e.detail.value
        })
    },
    //登陆授权
    applyuser: function() {
        wx.login({
            success: function(res) {
                if (res.code) {
                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ code: res.code, shopid: app.shopid });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                    wx.request({
                        url: app.host + '/buyerMobile/wxuser/index',
                        data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        success: function(res) {
                            console.info(res.data);
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
    },
    //下一步
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let formdata = e.detail.value;
        formdata.productid = this.data.productid;

        // if (_openid == '' || _openid == 'undefined' || _openid == undefined) {
        //     wx.showModal({
        //         title: '提示',
        //         confirmText: '去授权',
        //         content: '您还没有授权获取您的信息',
        //         showCancel: false,
        //         success: function(res) {
        //             that.applyuser();
        //         }
        //     });
        //     return;
        // }else if (formdata.username == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '订购人姓名还未填写',
        //         showCancel: false,
        //         success: function(res) {

        //         }
        //     });
        //     return;
        // } else if (formdata.telphone == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '订购人电话还未填写',
        //         showCancel: false,
        //         success: function(res) {

        //         }
        //     });
        //     return;
        // }

        app.goBuyData = formdata; //购买信息赋值给全局变量

        wx.navigateTo({
            url: '/pages/order/payInfo/consignee/consignee'
        });
    },

})