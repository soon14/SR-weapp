/**
 *  @author Shirui 2018/01/25
 *  37780012@qq.com
 */
/*columnStyle.js (栏目样式)*/
var utils = require('../../../../utils/util.js');
var app = getApp();
Page({
    data: {
        host: app.host,
        //按钮文字
        columnStyletext: "使用模板",
        // 样式列表
        stylelist: null,

        maxnum: null, //模版数量

        styleid: 0, //模版id

        circular: false, //是否采用衔接滑动   
        indicatorDots: false, //是否显示面板指示点    
        autoplay: false, //是否自动切换    
        interval: 5000, //自动切换时间间隔   
        duration: 1000, //滑动动画时长 

    },
    onLoad: function(options) {
        this.getdata();
    },
    onShow: function() {},
    columnStyleChange: function(e) {
        // console.log(e)
        let that = this;
        let current = e.detail.current;
        let styleid = that.data.stylelist[current].id;

        that.setData({
            styleid: styleid
        })
    },
    //卖家版 样式列表
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/style/getStyleList',
            params,
            function(res) {
                if (res.data.status == 1) {

                    let _stylelist = res.data.content.stylelist;
                    let _maxnum = res.data.content.stylelist.length;
                    let _nowstyle = res.data.content.nowstyle;
                    let _current = 0;

                    for (var i = 0; i < _stylelist.length; i++) {
                        if (_stylelist[i].id == _nowstyle)
                            _current = i;
                    }

                    that.setData({
                        stylelist: _stylelist,
                        maxnum: _maxnum,
                        styleid: _nowstyle,
                        current: _current,
                    })

                } else {
                    console.log(res.data.msg)
                }

            });
    },
    //卖家版 样式列表
    setStyle: function() {
        let that = this;

        let _styleid = that.data.styleid;
        let _shopid = wx.getStorageSync('shopid');

        let params = {
            shopid: _shopid,
            styleid: _styleid
        };

        utils.ajaxRequest(
            'shopMobile/style/setStyle',
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
    // 向左
    goLeft: function() {
        let that = this;
        let current = that.data.current;

        if (current <= 0) {
            current = 0;
        } else {
            current--;
        }

        that.setData({
            current: current
        })
    },
    //向右
    goRight: function() {
        let that = this;
        let maxnum = that.data.maxnum - 1;
        let current = that.data.current;

        if (current >= maxnum) {
            current = maxnum;
        } else {
            current++;
        }

        that.setData({
            current: current
        })
    },


})