/**
 *  @author Shirui 2018/01/25
 *  37780012@qq.com
 */
const utils = require('../../../../utils/util.js');
const app = getApp();

Page({
    data: {
        commentid: null,
        btntext: '保存',
        replytxt: ''
    },
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            commentid: options.commentid
        })

        this.getdata();
    },
    // 获取初始数据
    getdata: function() {
        /**
         * 单条评论
         * shopMobile/comments/getComment
         * 参数 commentid
         */
        let that = this;
        let _commentid = that.data.commentid;
        let params = {
            commentid: _commentid,
        };

        utils.ajaxRequest(
            'shopMobile/comments/getComment',
            params,
            function(res) {
                if (res.data.status == 1) {

                    that.setData({
                        replytxt: res.data.content.reply
                    });

                } else {
                    console.log(res.data.msg)
                }
            });
    },
    // 回复评论
    formSubmit: function(e) {
        /**
         * 回复评论
         * shopMobile/comments/reply
         * shopid , commentid, replytxt:'回复内容'
         */
        let _formId = e.detail.formId;
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _commentid = that.data.commentid;
        let _replytxt = encodeURIComponent(that.data.replytxt);
        let params = {
            shopid: _shopid,
            commentid: _commentid,
            replytxt: _replytxt,
            formid: _formId
        };

        utils.ajaxRequest(
            'shopMobile/comments/reply',
            params,
            function(res) {
                if (res.data.status == 1) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })

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
    bindKeyInput: function(e) {
        this.setData({
            replytxt: e.detail.value
        })
    },

})