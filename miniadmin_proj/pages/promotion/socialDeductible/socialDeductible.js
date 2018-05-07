// 社交立减金
var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();

Page({
    data: {
        promotionid: null,

        info: null,

        status: 1, //默认开启1 2关闭
    },
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            promotionid: options.promotionid
        });
        this.getdata();
    },
    onShow: function() {

    },
    // 获取初始数据
    getdata: function() {
        /*
        shopMobile/shareCoupon/singleShareCoupon
        参数 promotionid
         */
        let that = this;
        let _promotionid = that.data.promotionid;
        let params = { promotionid: _promotionid };

        utils.ajaxRequest(
            'shopMobile/shareCoupon/singleShareCoupon',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        info: res.data.content,
                        status: res.data.content.promotioninfo.status
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            });
    },
    // 开启活动
    changeActive: function() {
        /*
        shopMobile/shareCoupon/changeState
        参数promotionid,state
         */
        let that = this;

        let content = '确定要开启活动？';
        if (that.data.status == '2') {
            content = '确定要关闭活动？';
        }

        wx.showModal({
            title: '提示',
            content: content,
            success: function(res) {
                if (res.confirm) {
                    let _promotionid = that.data.promotionid;
                    let _state = that.data.status == '1' ? '2' : '1';
                    let params = { promotionid: _promotionid, state: _state };

                    utils.ajaxRequest(
                        'shopMobile/shareCoupon/changeState',
                        params,
                        function(res) {
                            if (res.data.status == 1) {

                                that.getdata();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function(res) {}
                                })
                            }
                        });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    }

})