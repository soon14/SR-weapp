var pos;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: null,
        detailAddresss: '',
        postion: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        pos = options.pos;
        console.log(options);

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log(options.keywords);

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    address() {
        wx.navigateTo({
            url: '/pages/getaddress/address',
        })
    },
    detailAddress(e) {
        this.setData({
            detailAddresss: e.detail.value
        })
    },
    names(e) {
        this.setData({
            name: e.detail.value
        })
    },
    submit() {
        console.log(pos);

        console.log(this.data.postion);


        if (this.data.name == null) {
            wx.showToast({
                title: '请选择地址',
            })
            return;
        }

        // console.log(this.data.detailAddresss);
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面

        pages.map((item) => {
            //首页
            if (item.route == 'pages/index/index') {
                prevPage = item;
            }
        })

        if (pos == 0) {
            prevPage.setData({
                jiAddress: this.data.name + this.data.detailAddresss,
                jipostion: this.data.postion,
            })
        } else {
            prevPage.setData({
                shouAddress: this.data.name + this.data.detailAddresss,
                shoupostion: this.data.postion,

            })
        }

        wx.navigateBack({

            // url: '/pages/index/index?address=' + this.data.name + this.data.detailAddresss + '&lon=' +lon + '&lat=' + lat + '&pos=' + pos,
            url: '/pages/index/index'
        })
    }
})