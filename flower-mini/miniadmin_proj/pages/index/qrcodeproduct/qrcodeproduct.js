var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();

Page({
    data: {
        issave: false,
        height: 0,
        width: 0,
        id: 0,
        title: '',
        img: ''
    },
    onLoad: function(e) {

        let _id = e.id;

        this.resetface();

        this.refresh(_id);

    },
    //预加载数据
    refresh: function(_id) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let res = wx.getSystemInfoSync();
        this.setData({
            height: res.windowHeight - 60,
            width: res.windowWidth,
            id: _id
        });
        let y1 = parseInt(res.windowHeight * 0.459);
        let params = { id: _id, shopid: _shopid, width: res.windowWidth, height: y1 };
        utils.ajaxRequest(
            'shopMobile/product/getProductForQrcode',
            params,
            function(res) {
                let title = res.data.content.title;
                let price = res.data.content.price;
                let mainpic = app.host + res.data.content.mainpic;
                let qrcode = app.host + res.data.content.qrcode;

                that.draw(qrcode, title, price, mainpic);
                that.setData({
                    title: res.data.content.title,
                    img: qrcode
                });

            });

    },
    // 重新生成小程序头像
    resetface: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/shopadmin/resetShopFace',
            params,
            function(res) {
                if(res.data.status==1){
                    // wx.showModal({
                    //     title: '提示',
                    //     content: '重新生成成功',
                    //     showCancel: false,
                    //     success: function(res) {}
                    // });
                    return;
                }

            });
    },
    draw: function(qrcode, title, price, mainpic) {
        let that = this;
        let y1 = parseInt(that.data.height * 0.459);

        let context = wx.createCanvasContext('firstCanvas');
        context.setFillStyle('White');
        context.fillRect(0, 0, that.data.width, that.data.height);


        let centerx = parseInt(that.data.width / 2);
        context.setFillStyle('#000000');
        context.setFontSize(18);
        context.setTextAlign('center');
        context.fillText(title, centerx, y1 + 40);

        context.setFillStyle('red');
        context.setFontSize(18);
        context.setTextAlign('center');
        context.fillText('￥' + price, centerx, y1 + 70);

        wx.downloadFile({
            url: mainpic,
            success: function(res1) {
                wx.downloadFile({
                    url: qrcode,
                    success: function(res2) {
                        wx.hideLoading();
                        let size = parseInt(that.data.width / 2);

                        let x = parseInt(size / 2);
                        let y = y1 + 75;
                        context.drawImage(res2.tempFilePath, x, y, size, size);
                        let y2 = y + size + 15;
                        let x2 = size;
                        context.setFillStyle('#aeaeae');
                        context.setTextAlign('center');
                        context.setFontSize(14);
                        context.fillText('扫码购买', x2, y2);

                        context.drawImage(res1.tempFilePath, 0, 0, that.data.width, y1);
                        context.draw();
                    }
                })

            }
        });


    },
    save: function() {

        let that = this;
        wx.saveImageToPhotosAlbum();
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope
        wx.getSetting({
            success(res) {
                // console.log(res.authSetting['scope.writePhotosAlbum'])
                if (res.authSetting['scope.writePhotosAlbum'] == false) {
                    // 提前获取保存到相册权限
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            // 用户已经同意小程序使用保存到相册功能，后续调用 wx.writePhotosAlbum 接口不会弹窗询问
                        }
                    })
                    wx.showModal({
                        title: '温馨提示',
                        content: '保存到相册未授权，无法进行保存，点击授权进行设置',
                        showCancel: false,
                        confirmText: '授权',
                        success: function(res) {

                            wx.openSetting({
                                success: (res) => {
                                    that.savimg();
                                }
                            })

                        }
                    })
                } else {
                    that.savimg();
                }
            }
        })

    },
    savimg: function() {
        let w = this.data.width;
        let h = this.data.height;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: w,
            height: h,
            destWidth: w,
            destHeight: h,
            canvasId: 'firstCanvas',
            success: function(res) {

                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function() {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
    preimg: function(e) {
        let w = this.data.width;
        let h = this.data.height;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: w,
            height: h,
            destWidth: w,
            destHeight: h,
            canvasId: 'firstCanvas',
            success: function(res) {
                let img = res.tempFilePath;
                let piclist = [img];
                wx.previewImage({
                    current: img,
                    urls: piclist
                })
            }
        })



    }
})