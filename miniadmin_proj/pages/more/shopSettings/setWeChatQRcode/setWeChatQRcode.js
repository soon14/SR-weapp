/**
 *  @author Shirui 2018/02/07
 *  37780012@qq.com
 */
const md5 = require('../../../../utils/md5.js');
const util = require('../../../../utils/util.js');
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        contact: '',
        welcome: '',
        imgUrl: null,
    },
    onLoad: function(options) {

        this.getdata();
    },
    getdata: function() {
        /**
         * 客服消息展示
         * shopMobile/shopCustomReply/showCustomInfo，
         * 参数shopid
         */
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        //店铺售后服务
        util.ajaxRequest(
            'shopMobile/shopCustomReply/showCustomInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        contact: res.data.content.contact,
                        welcome: res.data.content.welcome,
                        imgUrl: res.data.content.content,
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
    // 更换微信二维码
    changeWeimg: function() {
        let that = this;
        let shopid = wx.getStorageSync('shopid');
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                let tempFilePaths = res.tempFilePaths;
                wx.showLoading({
                    title: '微信二维码上传中...',
                });
                let _timestamp = app.getTimeStamp();
                let _params = JSON.stringify({ 'shopid': shopid });
                let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                /*
                更换微信二维码
                shopMobile/shopCustomReply/customImage
                参数 shopid
                 */
                wx.uploadFile({
                    url: app.host + 'shopMobile/shopCustomReply/customImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                    },
                    success: function(res) {
                        // console.log(res);
                        wx.hideLoading();
                        if (res.data) {

                            wx.showToast({
                                title: '上传成功',
                                icon: 'success',
                            })

                            that.setData({
                                imgUrl: res.data
                            });

                        } else {
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: '上传失败，请稍后重试',
                                success: function(res) {}
                            })
                        }
                    }
                });
            }
        })
    },
    formSubmit: function(e) {
        /**
         * 客服消息添加/修改
         * shopMobile/shopCustomReply/addCustomInfo
         * 参数shopid,welcome(店铺欢迎语),contact(二维码链接文字),img(图片上传后返回的路径)
         */
        let that = this;
        let params = e.detail.value;
        params.shopid = wx.getStorageSync('shopid');
        params.formid = e.detail.formId;
        params.status = e.detail.target.dataset.status; //1保存并显示2保持并隐藏
        params.welcome = encodeURIComponent(params.welcome);
        params.contact = encodeURIComponent(params.contact);

        util.ajaxRequest(
            'shopMobile/shopCustomReply/addCustomInfo',
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
                } else if (res.data.status == 2) {
                    wx.showModal({
                        title: '注意！',
                        showCancel: false,
                        content: "您还未授权客服权限给乐墨花时光，\r\n请用电脑打开my.ilearnmore.cn，\r\n重新授权后方可使用该功能",
                        success: function(res) {}
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
    },

})