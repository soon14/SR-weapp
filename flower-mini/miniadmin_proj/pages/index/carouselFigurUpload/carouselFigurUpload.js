/*carouselFigurUpload.js (新增轮播图)*/
var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数

        host: app.cdnhost,
        // 说明
        titleText: {
            title1: "第一步：上传轮播图图片",
            title2: "第二步：搜索并选择连接商品",
        },
        inputShowed: false,
        inputVal: '',
        products: null,
        uploadImgShow: null,
        proid: '',
    },
    onLoad: function(options) {
        this.getdata();
    },
    // 新增轮播图
    chooseImage: function() {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                var _type = '2'; //固定值2表示轮播图上传
                var _timestamp = app.getTimeStamp();
                var _params = JSON.stringify({ type: _type });
                var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                // 图片上传
                var uploadTask = wx.uploadFile({
                    url: app.host + 'shopMobile/slider/uploadImg',
                    filePath: tempFilePaths,
                    name: 'file',
                    formData: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                    },
                    success: (res) => {
                        // console.log('调用上传方法成功！', res);
                        that.setData({
                            uploadImgShow: res.data,
                        })
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success',
                            duration: 1000
                        })
                        // console.log(that.data.uploadImgShow);
                    },
                    fail: (res) => {
                        console.log('上传失败:', res);
                    }
                });
            }
        })
    },
    // 选择
    checkboxChange: function(e) {
        var that = this;
        // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        that.setData({
            proid: e.detail.value,
        })
    },
    // 请求数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _searchname = encodeURIComponent(that.data.inputVal);
        let _page = that.data.page;
        let _limit = that.data.limit;
        let params = { shopid: _shopid, searchname: _searchname, page: _page, limit: _limit };

        utils.ajaxRequest(
            'shopMobile/slider/showProductsByPage',
            params,
            function(res) {
                console.log('---轮播图商品列表');
                console.log(res);
                if (res.data.status == 1) {

                    let _page = that.data.page;
                    let products = that.data.products;
                    let _list = [];

                    if (_page > 1) {
                        _list = products.concat(res.data.content.lists);
                    } else if (_page == 1) {
                        _list = res.data.content.lists;
                    }

                    that.setData({
                        products: _list,
                        totalpage: res.data.content.totalpage,
                    });

                } else {
                    console.log(res.data.msg)
                }

            });
    },
    // 搜索栏
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    // 搜索栏
    clearInput: function() {
        this.setData({
            inputVal: "",
            page: 1
        });
        this.getdata();
    },
    inputTyping: function(e) {
        let inputVal = e.detail.value;
        this.setData({
            inputVal: inputVal,
            page: 1,
        });

        if (inputVal.length < 1) {
            this.getdata();
        }
    },
    // 保存
    save: function() {
        //保存轮播图 传shopid,图片路径,关联的商品id
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var _productid = that.data.proid; //商品id
        var _pic = that.data.uploadImgShow; //上传的图片路径
        var params = { shopid: _shopid, productid: _productid, pic: _pic };

        utils.ajaxRequest(
            'shopMobile/slider/slideAdd',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.navigateBack({
                        delta: 1
                    })
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
            inputVal: ''
        });
        this.getdata();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this;
        let _page = that.data.page + 1;

        if (_page > that.data.totalpage) {

            wx.showLoading({
                title: '没有更多数据',
            });

            setTimeout(function() {
                wx.hideLoading();
            }, 500);

            return;

        } else {

            that.setData({
                page: _page,
            });

            that.getdata();
        }

    }
})