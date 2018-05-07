Page({
    data: {
        windowHeight: '',
        title: "审核失败",
        imgurl: "../../../images/del.png",
        textData: {
            text: "请使用电脑登陆",
            text1: "my.ilearnmore.cn",
            text2: "开通乐墨花时光收款账户",
        },
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