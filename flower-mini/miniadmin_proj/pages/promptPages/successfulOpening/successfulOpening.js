Page({
    data: {
        windowHeight: '',
        textData: [
            { text: "您已成功开通乐墨花时光收款账户" },
            { text: "现在可以使用会员充值及二维码收款服务了" },
        ],
    },
    onLoad: function(options) {

        try {
            var res = wx.getSystemInfoSync();
            this.setData({
                windowHeight: res.windowHeight + "rpx",
            });
        } catch (e) {
            // Do something when catch error
        }

    }
})