var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        // 系统标签
        systemlabelData: null,
        // 系统标签显示收起
        showidx: null,

    },
    onLoad: function(options) {
        //标签管理更新数据
        this.getAllSystemTag();
    },
    onShow: function() {

    },
    //获取系统标签
    getAllSystemTag: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/tags/tagsShowForSys',
            params,
            function(res) {
                if(res.data.status==1){
                    that.setData({
                        systemlabelData: res.data.content,
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    });
                }

            });
    },
    //展示收起系统标签
    showlabel: function(e) {
        let idex = e.currentTarget.dataset.idx;
        if (this.data.showidx == idex) {
            idex = null;
        }
        this.setData({
            showidx: idex,
        });

    },

});