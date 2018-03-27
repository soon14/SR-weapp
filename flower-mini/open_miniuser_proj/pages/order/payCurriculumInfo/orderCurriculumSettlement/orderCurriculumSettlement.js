// 订单结算
var md5 = require('../../../../utils/md5.js');
var app = getApp();
Page({
    data: {
        //配送时间
        songdate:null,
        //总价
        totalprice:'0.00',
        //配送费用
        postage: '0.00',

    },
    onLoad: function(options) {

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();

        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;

        var str = year + '-' + month + '-' + date;

        this.setData({
            songdate: str
        });

    },
    // 配送时间
    bindDateChange: function(e) {
        this.setData({
            songdate: e.detail.value
        })
    },
    //下一步
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let formdata = e.detail.value;
        formdata.note = encodeURIComponent(formdata.note);
        // if (formdata.username == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '订购人姓名还未填写',
        //         showCancel: false,
        //         success: function(res) {

        //         }
        //     });
        //     return;
        // }else if (formdata.telphone == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '订购人电话还未填写',
        //         showCancel: false,
        //         success: function(res) {

        //         }
        //     });
        //     return;
        // }
    },

})