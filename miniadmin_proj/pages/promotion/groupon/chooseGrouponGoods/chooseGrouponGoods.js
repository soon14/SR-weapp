/**
 *  @author Shirui 2018/03/12
 *  37780012@qq.com
 *  选择商品
 */
const utils = require('../../../../utils/util.js');
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        page: 1,
        limit: 10, //(每页多少条记录)
        totalpage: 1, //最大页数

        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、只能选择上架中的商品；" },
            { text: "2、需要选择某个商品，可从顶部搜索框里输入关键词搜索；" },
            { text: "3、售罄和下架中的商品不可选择。" },
        ],

        inputShowed: false,
        inputVal: '',

        list: null, //商品数据

    },
    onLoad: function(options) {

        this.getdata();
    },
    // 搜索栏
    showInput: function() {
        this.setData({
            inputShowed: true,
            page: 1,
        });
    },
    // 搜索栏
    search: function() {
        this.getdata();
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
        if (inputVal.length < 1) {
            this.setData({
                inputVal: ''
            });
            this.getdata();
        }
        this.setData({
            inputVal: inputVal
        });
    },
    // 选择商品
    radioChange: function(e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value);
        let product_id = e.detail.value;//产品ID
        this.check(product_id);
    },
    check: function(productId) {
        /**
          * 卖家版 拼团活动设置：
          * 接口URL：/shopMobile/groupSet/check
          * 交互类型：POST
          * 传入参数：
                {
                    product_id:2953,//产品id
                }
        */
        let that = this,
        product_id= productId;
        
        let params = {
            product_id:product_id
        };
        utils.ajaxRequest(
            'shopMobile/groupSet/check',
            params,
            function(res) {
                if (res.data.status == 1) {

                    that.setData({
                        product_id: product_id//产品ID
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                    return;
                }

            });
    },
    // 请求数据
    getdata: function() {
        /**
          * 拼团商品选择列表：
          * 接口URL：/shopMobile/groupSet/selectGoods
          * 交互类型：POST
          * 传入参数：{
             shopid:204,
             searchname:'测试',//需转码
             page:1,//页数
             limit:10,//每页显示数量
         }
        */
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _searchname = that.data.inputVal;
        let _page = that.data.page;
        let _limit = that.data.limit;
        let params = {
            shopid: _shopid,
            searchname: encodeURIComponent(_searchname),
            page: _page,
            limit: _limit
        };
        utils.ajaxRequest(
            'shopMobile/groupSet/selectGoods',
            params,
            function(res) {
                if (res.data.status == 1) {

                    let _list = [];
                    let _page = that.data.page;

                    if (_page > 1) {
                        _list = that.data.list.concat(res.data.content.lists);
                    } else if (_page == 1) {
                        _list = res.data.content.lists
                    }

                    that.setData({
                        totalpage: res.data.content.totalpage,
                        list: _list
                    });

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
    //保存成功
    savechange: function() {
        let product_id = this.data.product_id;
        let list = this.data.list;
        let chooseGoodsData = null;

        for (var i = 0; i < list.length; i++) {
            if (list[i].id == product_id) {
                chooseGoodsData = list[i];
            }
        }

        // 选中的产品数据做缓存
        wx.setStorage({
            key: "chooseGoodsData",
            data: chooseGoodsData
        })

        wx.navigateBack({
            delta: 1
        })
    },
    //下拉刷新
    onPullDownRefresh: function() {
        let that = this;

        wx.showNavigationBarLoading(); //在标题栏中显示加载

        that.setData({
            page: 1,
        });

        //模拟加载
        setTimeout(function() {
            that.getdata();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    //加载更多
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