/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-08 10:45:12 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-08 16:08:40
 */

const config = require("config.js");
const util = require("utils/util.js");
const auth = require("utils/auth.js");
const updateMiniApp = require("utils/updateMiniApp.js");
App({
  host: config.host,
  cdnhost: config.cdnhost,
  shopkey: config.shopkey,
  msession: "", //用户的msession 唯一标示
  userInfo: null, //用户信息
  globalData: {},
  onLaunch: function(options) {
    console.log("onLaunch参数", options);

    let wxapp = this;
    util.setLogs(); //启动日志记录

    if (config.host == "https://ce.ilearnmore.net/") {
      // wx.showModal({
      //   title: "提示",
      //   showCancel: false,
      //   content: "这是测试服务器"
      // });
      console.log("这是测试服务器");
    }

    updateMiniApp.updateMiniApp(); //小程序更新

    //这是个坑，小程序初始化需要时间，getApp()需要等半秒执行，才保险！
    setTimeout(function() {
      util.getuserinfo(); //获取用户信息
      auth.auth();
    }, 500);
  }
});
