/**
 *  @author Shirui 2018/03/22
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        page: 1,
        limit: 10, //(每页多少条记录)
        totalPage: 1, //最大页数

        publishState: 1, //1草稿 2已发布 3已结束

        list: null,

        draftNum: '0', //草稿
        publishNum: '0', //已发布

        navbarTitle:['草稿','已发布','已结束'],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
    getData() {
        /**
         * 花艺方案列表：
         * 接口URL：/centerMobile/flowerScheme/list
         * 交互类型：POST
         * 传入参数：
            {
                "publishState":1,//发布状态 1草稿2已发布3已结束
                "page":1,//页码
                "limit":1,//每页数据条数
                "msession":"bb65090d77f9dbe13761d1965efb9fc5",
            }
         */
        let that = this,
            params = {
                msession: wx.getStorageSync('msession'),
                publishState: that.data.publishState, //发布状态 1草稿2已发布
                page: that.data.page, //页码
                limit: that.data.limit, //每页数据条数
            };

        util.ajaxRequest(
            'centerMobile/flowerScheme/list',
            params,
            function(res) {

                if (res.data.status == 1) {

                    let _listArry = [];
                    let _currentPage = parseInt(res.data.pages.currentPage); //当前第几页数据
                    let _totalPage = parseInt(res.data.pages.totalPage); //总页数
                    let list = that.data.list;

                    if (_currentPage > 1) {
                        _listArry = list.concat(res.data.content);
                    } else if (_currentPage == 1) {
                        _listArry = res.data.content;
                    }

                    that.setData({
                        list: _listArry,
                        page: _currentPage, //当前页
                        totalPage: _totalPage, //总页面
                    });

                } else {
                    console.log('花艺方案列表err：', res.data.msg);
                    // wx.showModal({
                    //     title: '提示',
                    //     showCancel: false,
                    //     content: res.data.msg,
                    //     success: function(res) {}
                    // });
                }

            });
    },
    schemeNum() {
        /**
         * 花艺方案给状态数量：
         * 接口URL：/centerMobile/flowerScheme/schemeNum
         * 交互类型：POST
         * 传入参数：
            {
                "msession":"bb65090d77f9dbe13761d1965efb9fc5",
            }
         */
        let that = this,
            params = {
                msession: wx.getStorageSync('msession')
            };

        util.ajaxRequest(
            'centerMobile/flowerScheme/schemeNum',
            params,
            function(res) {

                if (res.data.status == 1) {

                    that.setData({
                        draftNum: res.data.content.draftNum, //草稿
                        publishNum: res.data.content.publishNum //已发布
                    });

                } else {
                    console.log('花艺方案状态数量err：', res.data.msg)
                }

            });
    },
    changeNavbar(e) {
        let publishState = e.target.dataset.index;
        let navbarTitle = this.data.navbarTitle;

        this.setData({
            publishState: publishState,
            page: 1
        })

        wx.setNavigationBarTitle({
            title: navbarTitle[publishState-1]+'方案'
        })

        this.getData();
    },
    // 发布新方案
    create() {
        wx.navigateTo({
            url: '/floriculture/pages/editCase/editCase'
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.getData();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        let that = this;
        let _page = that.data.page + 1;

        if (_page > that.data.totalPage) {

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

            that.getData();
        }
    }
})