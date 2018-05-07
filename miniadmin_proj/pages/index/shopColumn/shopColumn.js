/**
 *  @author Shirui 2018/01/25
 *  37780012@qq.com
 */
/*shopColumn.js (店铺栏目)*/
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        showallcate: null, //顶部全部商品栏目
        //按钮文字
        changebttext: "新增栏目",
        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、可提前设置栏目并做好商品选择；" },
            { text: "2、在预览无误后，可选择“启用”；" },
            { text: "3、启用后的栏目在店铺首页即可看到" },
            { text: "4、最多可添加10个栏目，最多启用5个栏目；" },
            { text: "5、只有未启用的栏目才可以删除。" },
        ],
        // 栏目数据
        list: null,

    },
    onLoad: function(options) {

    },
    onShow: function() {
        this.getdata();
    },
    // 启用 未启用 开关
    switchChange: function(e) {
        // console.log('switch'+checkid+' 发生 change 事件，携带值为', e.detail.value)
        let _shopcateid = e.currentTarget.dataset.shopcateid; //栏目ID
        let _state = e.currentTarget.dataset.state; //栏目状态

        if (_state == "2") {
            _state = "1"; //关闭
        } else {
            _state = "2"; //启用
        }

        let that = this;
        //改变栏目按钮状态
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid, shopcateid: _shopcateid, state: _state };
        utils.ajaxRequest(
            'shopMobile/column/changeShopCateState',
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
                    });
                }

            });
    },
    // 调整对应链接
    goUrl: function(e) {
        let _url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: _url
        })
    },
    // 置顶
    goTop: function(e) {
        /*
         shopMobile/column/shopCateSetTop
         shopid,shopcateid（要置顶的栏目id）
         Json格式，{"success":"true","msg":"提示数据"}
         */
        let that = this;
        let _shopcateid = e.currentTarget.dataset.shopcateid; //栏目ID
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid, shopcateid: _shopcateid };
        utils.ajaxRequest(
            'shopMobile/column/shopCateSetTop',
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
                    });
                }

            });
    },
    // 删除栏目
    delcColumn: function(e) {
        /*
         shopMobile/column/delShopCate
         shopcateid（要删除的栏目id）
         Json格式，{"success":"true","msg":"提示数据"}
         */
        let that = this;
        let _shopcateid = e.currentTarget.dataset.shopcateid; //栏目ID
        let params = { shopcateid: _shopcateid };
        wx.showModal({
            title: '提示',
            content: '确定要删除这个栏目？',
            success: function(res) {
                if (res.confirm) {

                    utils.ajaxRequest(
                        'shopMobile/column/delShopCate',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500
                                });
                                that.getdata();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: res.data.msg,
                                    success: function(res) {}
                                });
                            }

                        });

                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    // 新增栏目页
    goAddcolumn: function(e) {
        wx.navigateTo({
            url: '/pages/index/addcolumn/addcolumn?shopcateid=add'
        })
    },
    //请求店铺栏目数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/column/getShopCatesByShopid',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        list: res.data.content.lists,
                        showallcate: res.data.content.showallcate
                    })

                } else {
                    that.setData({
                        list: null,
                        showallcate: res.data.content.showallcate
                    })
                    // wx.showModal({
                    //     title: '提示',
                    //     showCancel: false,
                    //     content: res.data.msg,
                    //     success: function(res) {}
                    // });
                }

            });
    },
    //单独全部商品栏目
    changeShowAllCate: function(e) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');

        let _state = e.currentTarget.dataset.state; //栏目状态

        if (_state == "1") {
            _state = "0"; //关闭
        } else {
            _state = "1"; //启用
        }

        let params = { shopid: _shopid, showallcate: _state };
        /*
         *showallcate 0关闭，1开启
         *shopid
         */
        utils.ajaxRequest(
            'shopMobile/column/changeShowAllCate',
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
                    });
                }

            });
    }
})