var app = getApp();
Page({
    data: {
        imgUrls: [
            app.cdnhost + "/resMobile/img/app_guide_1.png",
            app.cdnhost + "/resMobile/img/app_guide_2.png",
            app.cdnhost + "/resMobile/img/app_guide_3.png",
            app.cdnhost + "/resMobile/img/app_guide_4.png",
            "",
        ],
        indicatorDots: true, //是否显示面板指示点    
        autoplay: false, //是否自动切换    
        interval: 5000, //自动切换时间间隔   
        duration: 1000 //滑动动画时长  
    },
    onLoad: function(options) {

    },
    bindChange: function(e) {
        let _current = e.detail.current;
        let num = this.data.imgUrls.length - 1;

        if (_current == num) {
            this.start();
        }
    },
    //开始 进入首页
    start: function() {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    }

})