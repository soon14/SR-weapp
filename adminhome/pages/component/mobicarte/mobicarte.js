/**
 *  @author Shirui 2018/02/01
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        btntext: '兑换',
        inputValue: ''
    },
    onLoad: function(options) {
        // console.log(options)
    },
    request: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _inputValue = that.data.inputValue;
        let params = { inputValue: _inputValue };

        util.ajaxRequest(
            '',
            params,
            function(res) {
                if (res.data.status == 1) {

                }
                //  else {
                //     wx.showModal({
                //         title: '提示',
                //         showCancel: false,
                //         content: res.data.msg,
                //         success: function(res) {}
                //     });
                // }

            });
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

})