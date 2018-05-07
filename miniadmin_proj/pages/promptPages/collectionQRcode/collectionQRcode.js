const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        host: app.host,
        cdnhost: app.cdnhost,
        maxnum: 10, //添加数量 最多10个
        synum: null, //剩余添加数量 最多10个
    },
    onLoad: function(options) {
        this.getSetting();
    },
    onShow: function() {
        this.sd_getdata();
    },
    goUrl: function() {
        let synum = this.data.synum;
        if (synum == 0) {
            wx.showModal({
                title: '提示',
                content: '最多添加10个二维码',
                showCancel: false
            })
            return;
        }
        wx.navigateTo({
            url: '../addQRcode/addQRcode?synum=' + synum
        })
    },
    // 请求二维码数据
    sd_getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _searchname = encodeURIComponent(that.data.inputVal);
        let _page = '1';
        let params = { shopid: _shopid };
        util.ajaxRequest(
            'shopMobile/scene/sceneList',
            params,
            function(res) {
                let maxnum = that.data.maxnum;
                if (res.data.status == 1) {
                    let lists = res.data.content;
                    let lists_length = lists.length || 0;
                    that.setData({
                        lists: lists,
                        synum: maxnum - lists_length
                    });
                } else {
                    that.setData({
                        synum: maxnum
                    });
                }

            });
    },
    // 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
    saveImageToPhotosAlbum: function(e) {
        let _filePath = e.currentTarget.dataset.src;
        // console.log(_filePath);
        wx.downloadFile({
            url: _filePath,
            success: function(res) {
                // console.log(res);
                //图片保存到本地
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function(data) {
                        // console.log(data);
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: '保存成功',
                            success: function(res) {}
                        });
                    },
                    fail: function(err) {
                        console.log('saveImageToPhotosAlbumErr:', err);
                        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                            console.log("用户一开始拒绝了，再次发起授权");
                            console.log('打开设置窗口');
                            wx.openSetting({
                                success(settingdata) {
                                    console.log(settingdata)
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                                    } else {
                                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                                    }
                                }
                            })
                        }
                    }
                })
            },
            fail: function(err) {
                console.log('downloadFileErr:', err);
            }
        })

    },
    //获取相册授权
    getSetting: function() {
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            console.log('授权成功')
                        }
                    })
                }
            }
        })
    },
    // 图片预览
    preimg: function(e) {
        let piclist = [];
        piclist[0] = e.currentTarget.dataset.src;

        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: piclist, // 需要预览的图片http链接列表
        })
    },

})