/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-06-06 19:55:03 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-06-06 20:26:18
 * 地址簿
 */

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: ''
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

    },

    goBack() {
        let pages = getCurrentPages(),
            currPage = pages[pages.length - 1], //当前页面
            prevPage = pages[pages.length - 2]; //上一个页面

        if (this.data.type == 1) {
            prevPage.setData({
                jiAddress: this.data.name + this.data.detailAddresss || '1',
                jipostion: this.data.postion,
            })
        } else {
            prevPage.setData({
                shouAddress: this.data.name + this.data.detailAddresss || '2',
                shoupostion: this.data.postion,

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

    }
})