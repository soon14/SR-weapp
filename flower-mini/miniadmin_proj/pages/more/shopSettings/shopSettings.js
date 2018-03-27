/**
 * 门店设置
 * Created by SR on 2017/12/05.
 * 37780012@qq.com
 */
var md5 = require('../../../utils/md5.js');
var utils = require("../../../utils/util.js");
var qiniuUploader = require("../../../utils/qiniuUploader.js");
var app = getApp();

// 初始化七牛相关参数
function initQiniu(shopid) {
    var options = {
        region: 'SCN', // 华南区
        uptokenURL: app.host + 'shopMobile/qiniu/getTokenJson' + '/shopid/' + shopid,
        domain: app.cdnhost,
        shouldUseQiniuFileName: true
    };
    qiniuUploader.init(options);
}

Page({
    data: {
        host: app.cdnhost,
        list: null,
        address: '',
        latitude: '',
        longitude: '',

        shoplists: null, //门店服务列表，

        uploadarray: [
            '照片',
            '视频',
        ],
        uploadindex: 0,
        maxDuration: 15, //视频拍摄最大时长 默认15s
        video: null,
        showimg: 1,
    },
    onShow: function(options) {
        var _msession = wx.getStorageSync('msession');
        var _shopid = wx.getStorageSync('shopid');
        this.setData({
            msession: _msession,
            nowshopid: _shopid
        });
        this.getdata();
        this.getServiceByShopid();
    },
    // 获取服务器上地址
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/shopadmin/getShopByIdForAdmin',
            params,
            function(res) {
                // 提前获取位置权限
                wx.authorize({
                    scope: 'scope.userLocation',
                    success() {
                        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                    }
                })

                that.setData({
                    list: res.data.content,
                    showimg: res.data.content.showimg,
                    video: res.data.content.video,
                    address: res.data.content.address,
                    telphone: res.data.content.telphone,
                    background2: res.data.content.background2,
                    logo: res.data.content.logo,
                    weimg: res.data.content.custominfo.content,
                });

            });

    },
    // 打开地图选择位置
    authSetting: function() {
        var that = this;

        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '地理位置未授权，无法修改当前地址，点击授权进行设置',
                        showCancel: false,
                        confirmText: '授权',
                        success: function(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: (res) => {}
                                })
                            }
                        }
                    })
                } else {
                    wx.chooseLocation({
                        success: function(res) {
                            that.upaddress(res.address, res.latitude, res.longitude);
                        }
                    })
                }
            }
        })
    },
    // 提交更新地址
    upaddress: function(address, latitude, longitude) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = {
            key: 'address',
            value: encodeURIComponent(address),
            shopid: _shopid,
            latitude: latitude,
            longitude: longitude
        };
        utils.ajaxRequest(
            'shopMobile/shopadmin/updateInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.getdata();
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            });

    },
    goUrl: function() {
        let telphone = this.data.telphone;
        wx.navigateTo({
            url: '/pages/input/input?title=设置客服电话&desc=客服电话&value=' + telphone + '&key=shoptelphone'
        })
    },
    goshopname: function() {
        wx.navigateTo({
            url: '/pages/more/shopSettings/changeshopname/changeshopname'
        })
    },
    aftersale: function() {
        wx.navigateTo({
            url: '/pages/more/shopSettings/changeaftersale/changeaftersale'
        })
    },
    // 更换门店照片
    changeback2: function() {
        var that = this;
        var shopid = wx.getStorageSync('shopid');
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.showLoading({
                    title: '背景图上传中...',
                });
                var _timestamp = app.getTimeStamp();
                var _params = JSON.stringify({
                    'shopid': shopid,
                    'key': 'background2'
                });
                var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                wx.uploadFile({
                    url: app.host + 'shopMobile/shopadmin/changeImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                    },
                    success: function(res) {
                        wx.hideLoading();
                        that.setData({
                            background2: res.data,
                            showimg: 1
                        });
                    }
                });
            }
        })
    },
    // 更换门店logo
    changelogo: function() {
        var that = this;
        var shopid = wx.getStorageSync('shopid');
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.showLoading({
                    title: '背景图上传中...',
                });
                var _timestamp = app.getTimeStamp();
                var _params = JSON.stringify({
                    'shopid': shopid,
                    'key': 'logo'
                });
                var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                /*
                更换店铺logo，
                shopMobile/shopadmin/changeImage，
                参数shopid,key:"logo"
                 */
                wx.uploadFile({
                    url: app.host + 'shopMobile/shopadmin/changeImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                    },
                    success: function(res) {
                        console.log(res);
                        wx.hideLoading();
                        that.setData({
                            logo: res.data
                        });
                    }
                });
            }
        })
    },
    // 更换微信二维码
    changeWeimg: function() {
        wx.navigateTo({
            url: '/pages/more/shopSettings/setWeChatQRcode/setWeChatQRcode'
        })
    },
    // 门店服务
    getServiceByShopid: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/category/getServiceByShopid',
            params,
            function(res) {
                if (res.data.status == 1) {

                    that.setData({
                        shoplists: res.data.content
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }

            });
    },
    //上传 选择图片或者视频
    binduploadPickerChange: function(e) {
        let that = this;
        let uploadindex = e.detail.value;
        that.setData({
            uploadindex: uploadindex
        })
        if (uploadindex == 1) {
            that.addVideo();
        } else {
            that.changeback2();
        }
    },
    // 上传门店视频
    addVideo: function() {
        let that = this
        let maxDuration = that.data.maxDuration;
        let _shopid = wx.getStorageSync('shopid');
        initQiniu(_shopid);
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: maxDuration,
            camera: 'back',
            success: function(res2) {
                console.log(res2)
                if (res2.duration > maxDuration) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '请上传时长' + maxDuration + '秒以内的视频',
                        success: function(res) {}
                    })
                    return;
                }
                wx.showLoading({
                    title: '视频上传中...',
                });
                // 交给七牛上传
                qiniuUploader.upload(res2.tempFilePath, (res) => {
                    console.log('-----qiniuuploader-res');
                    console.log(res);
                    if (res.ret == 'success') {
                        wx.hideLoading();
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: '上传成功',
                            success: function(res) {
                                that.setData({
                                    showimg: 2
                                })
                                that.getdata();
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: '上传失败，请稍后重试',
                            success: function(res) {}
                        })
                    }
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '上传失败，请稍后重试!',
                        // content: JSON.stringify(error),
                        success: function(res) {}
                    })
                });
            }
        })
    },

})