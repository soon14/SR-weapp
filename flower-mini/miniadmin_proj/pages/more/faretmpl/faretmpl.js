var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        list: null
    },
    onShow: function() {
        this.getdata();
    },
    //获取数据
    getdata: function() {
        let _shopid = wx.getStorageSync('shopid');
        let that = this;
        let params = { shopid: _shopid };
        utils.ajaxRequest(
            'shopMobile/faretmpl/showFaretmplByShopid',
            params,
            function(res) {
                // console.log('运费模板列表');
                // console.log(res);
                if (res.data.status == 1) {
                    that.setData({
                        list: res.data.content
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
    //删除
    delitem: function(e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        let _shopid = wx.getStorageSync('shopid');
        wx.showModal({
            title: '提示',
            content: '确定要删除此运费模版？',
            success: function(res) {
                if (res.confirm) {
                    let params = { fareid: id, shopid: _shopid };
// console.log(params);
                    utils.ajaxRequest(
                        'shopMobile/faretmpl/delFaretmpl',
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
                                });
                            }
                        });
                }
            }
        })
    },
    //配送范围
    range: function() {

        wx.navigateTo({
            url: '/pages/more/addrangefaretmpl/addrangefaretmpl?type=add'
        })
    },
     // 配送范围编辑
    rangeEdititem: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/more/addrangefaretmpl/addrangefaretmpl?type=edit&id=' + id
        })
    },
    //行政区域
    region: function() {

        wx.navigateTo({
            url: '/pages/more/addfaretmpl/addfaretmpl?type=add'
        })
    },
    // 行政区域编辑
    edititem: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/more/addfaretmpl/addfaretmpl?type=edit&id=' + id
        })
    },
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    }

})