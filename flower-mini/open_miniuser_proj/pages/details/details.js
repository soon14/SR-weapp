var md5 = require('../../utils/md5.js');
var app = getApp()
Page({

    data: {
        list: null,
        showShare: false, //分享按钮
        markers: [{
            id: 0,
            latitude: null,
            longitude: null,
        }],
        type: '1', //1实物 2活动
        headlist: null,
        detaillist: null,
        host: app.cdnhost,
        aftersell: '',
        id: 0,
        gotobuytitle: '立即购买',
        gotoothertitle: '查看店铺其他商品',
        canshow: true,

        // 分享按钮
        // sharedate: [ '转发至朋友圈','生成海报'],

        num: '1', //商品数量

        isselftake: '1', //配送方式 默认自提1 非自提0
        isselftakelist: [
            { name: '到店自提', id: '1' },
            { name: '商家配送', id: '0' }
        ],
        //用途
        isytlist: [
            { name: '自用', id: '0' },
            { name: '送人', id: '1' }
        ],
        isyt: null,

        alertcolumeshow: false, //规格弹出层 默认隐藏

        sizeId: null, //规格id
        size: null, //规格名
        sizenum: null, //数量
        sizeprice: null, //价钱

        goods: null, //规格列表

        nickName: null, //用户昵称
        telphone: null, //用户手机号

        payinfodata: app.payinfodata,

    },
    onLoad: function(e) {

        // var _id = e.id;
        var _id = (e.id == 'undefined' || e.id == '' || e.id == null) ? e.scene : e.id;
        // console.log('-----参数');


        this.setData({
            id: _id,
            payinfodata: app.payinfodata || null
        });
        this.getdata();
    },
    // 去首页
    goindex: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    //下一步
    bindnext: function(telphone) {
        let that = this;
        let id = that.data.id;
        app.payinfodata = that.data.payinfodata;

        let goods_id = that.data.sizeId;
        let productnum = that.data.num;
        let productprice = that.data.sizeprice;
        let isselftake = that.data.isselftake;
        let isyt = that.data.isyt;
        let type = that.data.type;

        if (!goods_id) {
            wx.showModal({
                title: '提示',
                content: '请选择规格',
                showCancel: false
            });
            return;
        } else if (!isyt && type == 1) {
            wx.showModal({
                title: '提示',
                content: '请选择用途',
                showCancel: false
            });
            return;
        }

        app.payinfodata = {
            goods_id: goods_id,
            productnum: productnum,
            productprice: productprice,
            isselftake: isselftake,
            type: type,
            isyt: isyt,
            calprice: null,
        }
        console.log('选择的goods---');
        console.log(app.payinfodata);

        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ productprice: app.payinfodata.productprice, productnum: app.payinfodata.productnum });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        console.log('计算价格---');
        console.log(_params);
        // return;
        //后台计算价格
        wx.request({
            url: app.host + '/buyerMobile/order/calPrice',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                console.log(res);
                app.payinfodata.calprice = res.data.info;
            }
        })

        that.hasEnoughNum(); //判断库存 库存不足不能跳转

        // wx.navigateTo({
        //     url: '/pages/order/confirmationOrder/confirmationOrder?id=' + id + '&isyt=' + that.data.isyt
        // })

    },
    // 判断库存
    hasEnoughNum: function() {
        let that = this;
        let goodsid = that.data.sizeId;
        let buynum = that.data.num;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ goodsid: goodsid, buynum: buynum });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/order/hasEnoughNum',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {

                if (res.data.suc == 1) {

                    wx.navigateTo({
                        url: '/pages/order/confirmationOrder/confirmationOrder?id=' + that.data.id + '&isyt=' + that.data.isyt
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function() {}
                    });
                }

            }
        })
    },
    // 显示规格弹出层
    alertcolumeshow: function() {
        this.setData({
            alertcolumeshow: !this.data.alertcolumeshow
        })
    },
    // 选择规格
    checksizeChange: function(e) {
        this.setData({
            sizeId: e.target.dataset.id,
            size: e.target.dataset.value,
            sizenum: e.target.dataset.num,
            sizeprice: e.target.dataset.price,
        });
    },
    // 选择配送方式
    bindDistributionMode: function(e) {
        this.setData({
            isselftake: e.target.dataset.id
        });
    },
    // 用途
    bindisyt: function(e) {
        let isyt = e.target.dataset.id;
        this.setData({
            isyt: isyt
        });

    },
    //输入 数量
    inputnum: function(e) {
        let num = e.detail.value;
        let maxnum = this.data.sizenum;
        let sizeId = this.data.sizeId;
        if (sizeId == null) {
            wx.showModal({
                title: '提示',
                content: '请先选择规格',
                showCancel: false
            });
            return;
        }
        if (parseInt(num) >= parseInt(maxnum)) {
            wx.showModal({
                title: '提示',
                content: '以达到该商品最大库存',
                showCancel: false
            });
            num = maxnum;
        }

        if (parseInt(num) < 1) {
            num = '1';
        }

        this.setData({
            num: num
        })
    },
    //增加数量
    addnum: function() {
        let that = this;
        let num = that.data.num;
        let maxnum = that.data.sizenum;

        if (parseInt(num) >= parseInt(maxnum)) {
            wx.showModal({
                title: '提示',
                content: '以达到该商品最大库存',
                showCancel: false
            });
            num = maxnum;
        } else {

            num++;

        }

        that.setData({
            num: num
        });
    },
    //减少数量
    jiannum: function() {
        let that = this;
        let num = that.data.num;
        if (parseInt(num) <= 1) {
            num = '1';
        } else {
            num--;
        }
        that.setData({
            num: num
        });
    },
    getdata: function() {
        wx.showLoading({
            title: '加载中'
        })
        var _shopid = app.shopid;
        var _id = this.data.id;
        var that = this;
        let _openid = wx.getStorageSync('openid');
        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ id: _id, shopid: _shopid, openid: _openid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/product/ShowProDetailByBuyer',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',

            complete: function(res) {
                wx.hideLoading();
                console.log(res);
                if (res.data.status == 0 || res.data.content.mainpic == '') {
                    that.setData({
                        canshow: false,
                    });
                } else {
                    var hhlist = null;
                    var goods = res.data.content.goods;
                    var moredetail = res.data.content.moredetail;
                    var isselftake = res.data.content.onlyselftake; //默认配送方式
                    var markers = that.data.markers;
                    markers[0].latitude = res.data.content.latitude;
                    markers[0].longitude = res.data.content.longitude;

                    if (parseInt(isselftake) == 0) {
                        that.setData({
                            isselftake: '1',
                            isselftakelist: [
                                { name: '到店自提', id: '1' },
                                { name: '商家配送', id: '0' }
                            ]
                        });
                    } else if (parseInt(isselftake) == 1) {
                        that.setData({
                            isselftake: '1',
                            isselftakelist: [
                                { name: '到店自提', id: '1' }
                            ]
                        });
                    } else if (parseInt(isselftake) == 2) {
                        that.setData({
                            isselftake: '0',
                            isselftakelist: [
                                { name: '商家配送', id: '0' }
                            ]
                        });
                    }


                    if (res.data.content.pics.trim() != '') {
                        hhlist = res.data.content.pics.split(",");
                    }

                    if (goods.length == 1) {
                        that.setData({
                            sizeId: goods[0].id,
                            sizeprice: goods[0].price,
                            sizenum: goods[0].num,
                        })
                    }

                    if (res.data.content.state == 1) {
                        that.setData({
                            canshow: false,
                        });
                    }


                    that.setData({
                        list: res.data.content,
                        headlist: res.data.content.headpics.split(","),
                        detaillist: hhlist,
                        type: res.data.content.type,
                        goods: goods,
                        customaccess: res.data.content.customaccess,
                        moredetail: moredetail,
                        markers: markers
                    });

                    wx.setNavigationBarTitle({
                        title: res.data.content.title
                    });
                }

            }
        });

        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ shopid: _shopid });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/shop/getShopById',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                that.setData({
                    aftersell: res.data.shopinfo.aftersell
                });
                if (that.data.canshow == false) {
                    wx.setNavigationBarTitle({
                        title: res.data.shopinfo.name
                    })
                }
            }
        })
    },
    preimg: function(e) {

        let imgsrc = e.currentTarget.dataset.src;
        var piclist = [imgsrc];

        wx.previewImage({
            current: imgsrc,
            urls: piclist
        })
    },
    preimg2: function(e) {
        var piclist = [];
        for (var i = 0; i < this.data.headlist.length; i++) {
            piclist[piclist.length] = app.cdnhost + this.data.headlist[i];
        }


        wx.previewImage({
            current: e.target.dataset.src,
            urls: piclist
        })
    },
    gotobuy: function(e) {

        if (this.data.canshow) {
            if (this.data.list.num > 0) {
                var _id = this.data.id;

                app.goBuyData = null; //初始化购买信息

                wx.redirectTo({
                    // url: '/pages/order/order?proid=' + _id
                    url: '/pages/order/payInfo/payInfo?productid=' + _id
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: '对不起，该商品库存不足',
                    showCancel: false,
                    success: function(res) {

                    }
                });
                return;
            }
        } else {
            wx.switchTab({
                url: '/pages/cate/cate',
            })
        }



    },
    gotohome: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    gotome: function(e) {
        wx.switchTab({
            url: '/pages/me/me'
        })
    },
    onShareAppMessage: function(res) {
        console.log(res);
        var _title = this.data.list.title;
        var _id = this.data.list.id;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: _title,
            path: 'pages/details/details?id=' + _id,
            success: function(res) {
                console.log('转发成功')
            },
            fail: function(res) {
                console.log('转发失败')
            }
        }

    },
    phonecall: function() {
        wx.makePhoneCall({
            phoneNumber: '0755-82101025'
        })
    },
    markertap: function(e) {
        var that = this;
        wx.openLocation({
            latitude: parseFloat(that.data.list.latitude),
            longitude: parseFloat(that.data.list.longitude),
            name: that.data.list.name,
            address: that.data.list.address,
            scale: 18
        })
    },
    //分享
    shareImage: function() {

        this.showShare();

        let openid = wx.getStorageSync('openid');
        let id = this.data.id;
        let urls = [app.host + '/buyerMobile/shop/getProductPoster/shopid/' + app.shopid + '/id/' + id + '/openid/' + openid + '/random/' + Math.random()];

        wx.previewImage({
            urls: urls // 需要预览的图片http链接列表
        })

    },
    //分享按钮显示
    showShare: function() {
        this.setData({
            showShare: !this.data.showShare
        })
    },
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    }

})