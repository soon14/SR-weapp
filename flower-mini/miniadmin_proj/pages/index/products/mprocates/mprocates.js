var md5 = require('../../../../utils/md5.js');
var utils = require('../../../../utils/util.js');
var app = getApp();
Page({

    data: {
        list: null
    },

    onLoad: function() {

    },
    onShow: function() {
        this.sd_getdata();
    },
    onPullDownRefresh: function() {
        this.sd_getdata();
        wx.stopPullDownRefresh();
    },

    sd_getdata: function() {

        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/shopadmin/getCategorysForAdmin',
            params,
            function(res) {
                if(res.data.status==1){
                    that.setData({
                        list: res.data.content
                    });
                }
            });
    },

    tabClick: function() {
        wx.redirectTo({
            url: '/pages/index/products/products'
        })
    },
    addnew: function() {
        wx.navigateTo({
            url: '/pages/input/input?title=新增分类&desc=分类名称&key=addcategory'
        })
    },
    /**
     * 删除分类
     */
    delitem: function(event) {
        let that = this;
        let _id = event.target.dataset.id;
        let _shopid = wx.getStorageSync('shopid');
        wx.showModal({
            title: '提示',
            content: '确定要删除这个分类？',
            success: function(res) {
                if (res.confirm) {
                    let params = { id: _id, shopid: _shopid };
                    utils.ajaxRequest(
                        'shopMobile/shopadmin/delCategory',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                that.sd_getdata();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function(res) {}
                                });
                            }
                        });
                }
            }
        })
    }


})