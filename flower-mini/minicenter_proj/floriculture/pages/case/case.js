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
        type: 1, //1表示热门方案，2表示已购方案，3表示我的方案

        page: 1,
        limit: 10, //(每页多少条记录)
        totalPage: 1, //最大页数

        publishState: 1, //1草稿 2已发布 3已结束

        list: null,

        navbarTitle:['热门','已购'],

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
         * 热门方案，已购方案，我的方案列表展示：
         * 接口URL：/centerMobile/flowerScheme/hotScheme
         * 交互类型：POST
         * 传入参数：
            {
                "type":1,//1表示热门方案，2表示已购方案，3表示我的方案
                "msession":"bb65090d77f9dbe13761d1965efb9fc5",
                "page":1,
                "limit":10
            }
         */
        let that = this,
            params = {
                msession: wx.getStorageSync('msession'),
                type: that.data.type, //1表示热门方案，2表示已购方案，3表示我的方案
                page: that.data.page, //页码
                limit: that.data.limit, //每页数据条数
            };

        util.ajaxRequest(
            'centerMobile/flowerScheme/hotScheme',
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
                    console.log('热门方案，已购方案，我的方案列表展示：', res.data.msg);
                }

            });
    },
    changeNavbar(e) {
        let type = e.currentTarget.dataset.type;
        let navbarTitle = this.data.navbarTitle;

        this.setData({
            type: type,
            page: 1
        })

        wx.setNavigationBarTitle({
            title: navbarTitle[type - 1] + '方案'
        })

        this.getData();
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