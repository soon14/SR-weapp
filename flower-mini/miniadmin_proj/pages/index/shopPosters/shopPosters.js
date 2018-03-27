var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        // host: app.cdnhost,//有缓存,弃用
        host: app.host,
        // 页面固定数据
        shopPostersPageData: {
            contenttext: {
                toptitle: "每日推荐",
                topExplain: "说明：每天早上8-9点生成一张推荐海报发到朋友圈，是个不错的宣传方式",
                contenttitle: "基础海报",
                contentExplain: "这里是门店宣传中常用的一些店铺海报",
                contentPtext1: "推广海报",
                contentPtext2: "简洁",
                changebt: "更换推广海报图片",
            },
            // 底部说明
            explainTitle: "说明：",
            explainText: [
                { text: "1、推广海报：商家可上传1张图片，生成商家用于推广的海报；" },
                { text: "2、简洁：只有店铺二维码；" },
                { text: "3、全景海报：由系统提供的图片+店铺二维码，商家仅需要下载即可使用；" },
                { text: "4、文字控：系统提供的文字+店铺二维码，商家仅需下载即可使用；" },
            ],
        },
        // 每日推荐数据
        recommendedDailyData: null,
        //自定义海报
        recommendedCustomData: null,
        //简介二维码
        recommendedSimpleData: null,
        height: 0,
        width: 0,
        title: '',
        img: ''
    },
    // 图片预览
    preimg: function(e) {
        let piclist = [];
        for (let i = 0; i < this.data.recommendedDailyData.length; i++) {
            piclist[piclist.length] = app.host + this.data.recommendedDailyData[i].returnpath;
        }

        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: piclist, // 需要预览的图片http链接列表
        })
    },
    // 图片预览
    preimgsingle: function(e) {
        let piclist2 = [];
        piclist2[0] = app.host + this.data.recommendedCustomData;
        piclist2[1] = app.host + this.data.recommendedSimpleData;
        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: piclist2, // 需要预览的图片http链接列表
        })
    },
    chooseImage: function() {
        let that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths[0]
                let _shopid = wx.getStorageSync('shopid');
                let _type = '1'; //固定值1表示海报上传
                let _timestamp = app.getTimeStamp();
                let _params = JSON.stringify({ shopid: _shopid, type: _type });
                let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                // 图片上传
                let uploadTask = wx.uploadFile({
                    url: app.host + 'shopMobile/poster/posterCreate',
                    filePath: tempFilePaths,
                    name: 'file',
                    formData: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                    },
                    success: (res) => {
                        // console.log('调用上传方法成功！',res);
                        that.setData({
                            recommendedCustomData: res.data,
                        })

                    },
                    fail: (res) => {
                        console.log('上传失败:', res);
                    }
                });
            }
        })
    },
    onLoad: function(options) {
        let that = this;
        //海报页面展示请求 传shopid,返回二维码图片，全景文字海报图片，自定义海报无则返回空
        that.getdata();
    },
    // 获取初始数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/poster/posterShowAll',
            params,
            function(res) {
                that.setData({
                    recommendedDailyData: res.data.content.base,
                    recommendedCustomData: res.data.content.defaultcustom.returnpath,
                    recommendedSimpleData: res.data.content.mark,
                })
            });
    },
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {

    }
})