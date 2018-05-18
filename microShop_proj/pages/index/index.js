//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: null,
    hasUserInfo: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function() {
    this.getInfo();
  },
  getInfo() {
    if (app.userInfo) {
      this.setData({
        userInfo: app.userInfo,
        hasUserInfo: true
      });
    } else if (wx.canIUse("button.open-type.getUserInfo")) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    app.userInfo = userInfo;
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    });
  }
});
