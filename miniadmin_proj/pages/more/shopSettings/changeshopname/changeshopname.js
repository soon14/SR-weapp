/**
 *  @author Shirui 2018/02/08
 *  37780012@qq.com
 */
const util = require('../../../../utils/util.js');
const app = getApp();
Page({
    data: {
        btntext: '保存',
        value: ''
    },
    onLoad: function(options) {
        // console.log(options)
        this.getdata();
    },
    getdata: function() {
        /*
        获取店铺信息,
        shopMobile/shopadmin/getShopByIdForAdmin,
        参数shopid
         */
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        //店铺售后服务
        util.ajaxRequest(
            'shopMobile/shopadmin/getShopByIdForAdmin',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        value: res.data.content.name
                    })
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
    formSubmit: function(e) {
        /*
        店铺售后服务shopMobile/shopadmin/updateInfo,
        参数shopid,key:"aftersell",value
        店铺名称接口参数同上，key:"name"
         */
        let that = this;
        let params = e.detail.value;
        params.shopid = wx.getStorageSync('shopid');
        params.formid = e.detail.formId;
        params.key = "name";
        params.value = encodeURIComponent(params.value);

        //店铺售后服务
        util.ajaxRequest(
            'shopMobile/shopadmin/updateInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            // 将返回上页面
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }

            });
    }

})