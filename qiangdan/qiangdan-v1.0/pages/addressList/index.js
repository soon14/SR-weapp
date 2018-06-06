/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-06-06 19:55:03 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-06-06 22:36:06
 * 地址簿
 */
const api = require('../../utils/api.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '',

        startX: 0, //开始坐标
        startY: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            type: options.type
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getdata();
    },
    getdata() {
        let that = this;
        wx.request({
            url: api.getRememberAddresses(),
            data: {
                openid: wx.getStorageSync('openid')
            },
            method: 'post',

            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(that.data.type)
                try {
                    that.setData({
                        list: res.data.data
                    })
                } catch (e) {}

            }
        })

    },
    addAddress() {
        let type = this.data.type;
        wx.navigateTo({
            url: `/pages/address/address?pos=${type}`
        })
    },
    goBack(e) {
        let pages = getCurrentPages(),
            address = e.currentTarget.dataset.address,
            name = e.currentTarget.dataset.name,
            postion = e.currentTarget.dataset.postion,
            currPage = pages[pages.length - 1], //当前页面
            prevPage = pages[pages.length - 2]; //上一个页面

        pages.map((item) => {
            //首页
            if (item.route == 'pages/index/index') {
                prevPage = item;
            }
        })

        if (this.data.type == 0) {
            prevPage.setData({
                jiAddress: name + address,
                jipostion: postion,
            })
        } else {
            prevPage.setData({
                shouAddress: name + address,
                shoupostion: postion,

            })
        }

        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({
            page: 1
        });
        this.getData();
        wx.stopPullDownRefresh();
    }
})