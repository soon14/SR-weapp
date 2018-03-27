var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        list: null,
        headlist: null,
        detaillist: null,
        host: app.cdnhost,
        aftersell: '',
        id: 0,
        gotobuytitle: '立即购买',
        canshow: true
    },
    onLoad: function(e) {

        let _id = e.id;
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { proid: _id, shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/product/showProDetail',
            params,
            function(res) {
                if (res.data.status == 1) {

                    let hhlist = null;
                    if (res.data.content.product.pics.trim() != '') {
                        hhlist = res.data.content.product.pics.split(",");
                    }

                    that.setData({
                        list: res.data.content.product,
                        headlist: res.data.content.product.headpics.split(","),
                        detaillist: hhlist,
                        moredetail: res.data.content.product.moredetail
                    });

                    wx.setNavigationBarTitle({
                        title: res.data.content.product.title
                    })
                } else {
                    console.log(res.data.msg);
                }
            });

        let params1 = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/shopadmin/getShopByIdForAdmin',
            params1,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        aftersell: res.data.content.aftersell
                    });
                } else {
                    console.log(res.data.msg);
                }
            });
    },
    preimg: function(e) {
        let piclist = [];
        for (let i = 0; i < this.data.detaillist.length; i++) {
            piclist[piclist.length] = app.cdnhost + this.data.detaillist[i];
        }

        wx.previewImage({
            current: e.target.dataset.src,
            urls: piclist
        })
    },
    preimg2: function(e) {
        let piclist = [];
        for (let i = 0; i < this.data.headlist.length; i++) {
            piclist[piclist.length] = app.cdnhost + this.data.headlist[i];
        }

        wx.previewImage({
            current: e.target.dataset.src,
            urls: piclist
        })
    },
    gotobuy: function(e) {
        wx.showToast({
            title: '仅仅预览哦',

            duration: 2000
        })
    },
    gotohome: function(e) {
        wx.showToast({
            title: '仅仅预览哦',

            duration: 2000
        })
    },
    gotome: function(e) {
        wx.showToast({
            title: '仅仅预览哦',

            duration: 2000
        })
    },
    phonecall: function() {
        wx.makePhoneCall({
            phoneNumber: '0755-82101025'
        })
    }

})