// 订购人信息
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {

    },
    //下一步
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let formdata = e.detail.value;
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

        wx.navigateTo({
            url: '/pages/order/payCurriculumInfo/orderCurriculumSettlement/orderCurriculumSettlement'
        });
    },

})