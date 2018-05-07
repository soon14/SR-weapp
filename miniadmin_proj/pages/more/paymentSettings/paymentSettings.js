/**
 * Created by SR on 2017/9/25.
 * 37780012@qq.com
 */
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        list: null,
        shopid: null,

        items: [
            { name: '微信支付', id: "1", checked: 'true' },
            { name: '乐墨支付（开发中）', id: "2" },
        ],
        checked: 1,
        /** 
         * 页面配置 
         */
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
    },
    onLoad: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        that.setData({
            shopid: _shopid
        });
        /** 
         * 获取系统信息 
         */
        wx.getSystemInfo({

            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });

        that.refresh();

    },
    radioChange: function(e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
            checked: e.detail.value
        });
    },
    /**
     * [refresh 请求数据]
     * 支付设置读取
     * mobile/shopadmin/showPaySet
     * 参数 shopid 
     */
    refresh: function() {
        let that = this;
        let _shopid = that.data.shopid;
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/shopadmin/showPaySet',
            params,
            function(res) {
                if(res.data.status==1){
                    that.setData({
                        list: res.data.content
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            });
    },
    /** 
     * 滑动切换tab 
     */
    bindChange: function(e) {

        let that = this;
        that.setData({ currentTab: e.detail.current });

    },
    /** 
     * 点击tab切换 
     */
    swichNav: function(e) {

        let that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    /**
     *保存
     */
    formSubmit: function(e) {

        let that = this;
        let formData = e.detail.value;
        let mchid = formData.mchid;
        let key = formData.key;

        if (that.checkMchid(mchid) && that.checkKey(key)) {
            that.sd_request(mchid, key);
        }

    },
    // check商户号
    checkMchid: function(mchid) {

        if (mchid.length != 10) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '商户号是10位数字哦'
            });
            return false;
        } else {
            return true;
        }

    },
    // check API秘钥
    checkKey: function(key) {

        if (key.length != 32) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '微信支付API秘钥是32位大小写字母+数字组合'
            });
            return false;
        } else {
            return true;
        }

    },
    /**
     * [sd_request 发送切换请求]
     * @param  {[type]} mchid [商户号]
     * @param  {[type]} key   [API秘钥]

     * mobile/shopadmin/paySet
     * 参数 mchid,key,shopid
     */
    sd_request: function(mchid, key) {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid, mchid: mchid, key: key };
        utils.ajaxRequest(
            'shopMobile/shopadmin/paySet',
            params,
            function(res) {
                let data = res.data;
                if (data.status==1) {
                    setTimeout(function() {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 1000
                        });

                    }, 1500);

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '设置失败，请稍后再试'
                    });

                }
            });
    }

})