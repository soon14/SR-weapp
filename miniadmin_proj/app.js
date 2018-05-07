/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-04-09 15:12:55 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-04 11:53:42
 */
const config = require("config.js");
const md5 = require("utils/md5.js");
const util = require("utils/util.js");
const updateMiniApp = require("utils/updateMiniApp.js");
App({
  host: config.host,
  cdnhost: config.cdnhost,
  shopkey: config.shopkey,
  isBingGuangda: 0, //未开通广大支付
  isIpx: false, //不是iPhone X
  lmxtAppId: config.lmxtAppId, //乐墨学堂小程序appid
  orderstatetitle: [
    "待付款",
    "待接单",
    "待发货",
    "待收货",
    "已取消",
    "已完成",
    "拒绝订单",
    "已关闭"
  ],
  deliverys: ["", "普通快递", "专人配送", "无需物流"],
  deliverystatus: ["", "在途中", "派件中", "已签收", "派送失败"],
  globalData: {},
  activityConfig: null, //显示配置
  onLaunch: function() {
    let wxapp = this;

    updateMiniApp.updateMiniApp(); //小程序更新

    if (wxapp.host == "https://ce.ilearnmore.net/") {
      wx.showModal({
        title: "提示",
        showCancel: false,
        content: "这是测试服务器"
      });
    }

    wx.getSystemInfo({
      success: function(res) {
        if (res.model == "iPhone X") {
          wxapp.isIpx = true;
        }
      }
    });

    //登陆授权
    wxapp.auth();
  },
  auth: function() {
    var that = this;
    // 判断有没有签约光大
    // that.isBindGD();

    var _code, _iv, _encryptedData, _msession, _sessionkey, _shopid, _telphone;

    try {
      //当小程序初始化完成时调用API从本地缓存中获取数据
      _msession = wx.getStorageSync("msession") || "";
      _sessionkey = wx.getStorageSync("sessionkey") || [];
      _shopid = wx.getStorageSync("shopid") || "";

      //当小程序初始化完成时从本地缓存中获取数据进行本地缓存
      wx.setStorageSync("msession", _msession);
      wx.setStorageSync("sessionkey", _sessionkey);
      wx.setStorageSync("shopid", _shopid);
      that.msession = _msession;
      that.shopid = _shopid;
    } catch (err) {
      console.log(err);
    }

    if (_msession) {
      console.log("有msession");
      var _timestamp = that.getTimeStamp();
      var _params = JSON.stringify({
        msession: _msession,
        shopid: _shopid
      });
      var _sign = md5.hex_md5(_timestamp + _params + that.shopkey);

      wx.request({
        url: that.host + "shopMobile/shopadmin/getShopidByMsession",
        data: {
          timestamp: _timestamp,
          params: _params,
          sign: _sign
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        complete: function(res) {
          console.log("---you msesssion res");

          wx.hideLoading();
          _msession = res.data.content.msession;
          _shopid = parseInt(res.data.content.shopid);
          _telphone = parseInt(res.data.content.telphone);

          wx.setStorageSync("msession", _msession);
          wx.setStorageSync("shopid", _shopid);
          that.msession = _msession;
          that.shopid = _shopid;

          if (res.data.status == 0) {
            that.auth();
            // wx.showModal({
            //     title: '温馨提示',
            //     content: '当前网络环境较差，请稍后再试',
            //     showCancel: false,
            //     confirmText: '确定',
            //     success: function(res) {
            //         wx.reLaunch({
            //             url: '/pages/more/storeSwitching/storeSwitching'
            //         });
            //     }
            // })
          } else {
            if (_telphone > 0) {
              // console.log('有telphone：' + _telphone);
              if (_shopid == 0) {
                // console.log('没有shopid');
                wx.reLaunch({
                  url: "/pages/more/storeSwitching/storeSwitching"
                });
              } else {
                that.activityConfig();
              }
            } else {
              // console.log('没有telphone');
              wx.reLaunch({
                url: "/pages/more/bindphone/bindphone"
              });
            }
          }
        }
      });
    } else {
      console.log("没有msession");
      //没有msession去引导页
      wx.reLaunch({
        url: "/pages/bootPage/bootPage"
      });
      //调用登录接口重新登录
      wx.login({
        success: function(res) {
          if (res.code) {
            //从后端换取session_key
            var _timestamp = that.getTimeStamp();
            var _params_code = JSON.stringify({
              code: res.code
            });
            var _sign_code = md5.hex_md5(
              _timestamp + _params_code + that.shopkey
            );
            wx.request({
              url: that.host + "shopMobile/login/index",
              data: {
                timestamp: _timestamp,
                params: _params_code,
                sign: _sign_code
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function(res) {
                // console.log(res);
                _sessionkey = res.data.session_key;

                //获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口。
                wx.getUserInfo({
                  success: function(res) {
                    /**
                     * @method
                     * 发起网络请求 发送完整用户信息的加密数据给后端 获取解密的用户信息
                     *
                     * @param {Object} _params 登录参数配置
                     *                 res.iv 加密算法的初始向量
                     *                 res.encryptedData 包括敏感数据在内的完整用户信息的加密数据
                     * @param {Function} success(res) 登录成功后的回调函数，参数 res 微信用户信息
                     * @param {Function} fail(error) 登录失败后的回调函数，参数 error 错误信息
                     */
                    var _timestamp = that.getTimeStamp();
                    var _params = JSON.stringify({
                      sessionkey: _sessionkey,
                      iv: res.iv,
                      encrypteddata: res.encryptedData
                    });
                    var _sign = md5.hex_md5(
                      _timestamp + _params + that.shopkey
                    );
                    wx.request({
                      url: that.host + "shopMobile/login/new",
                      data: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      method: "POST",
                      success: function(res2) {
                        // console.log(res2);
                        wx.hideLoading();
                        _msession = res2.data.content.msession;
                        that.msession = res2.data.content.msession;
                        _shopid = parseInt(res2.data.content.shopid);
                        _telphone = parseInt(res2.data.content.telphone);

                        //进行数据本地缓存
                        wx.setStorageSync("msession", _msession);
                        wx.setStorageSync("shopid", _shopid);
                        that.msession = _msession;
                        that.shopid = _shopid;

                        // 获取配置权限
                        that.activityConfig();

                        if (_msession) {
                          // console.log('有msession:'+_msession);
                          if (_telphone > 0) {
                            // console.log('有telphone：' + _telphone);
                            if (_shopid > 0) {
                              // console.log('有shopid：' + _shopid);
                            } else {
                              // console.log('没有有shopid');
                              wx.reLaunch({
                                url: "/pages/more/storeSwitching/storeSwitching"
                              });
                            }
                          } else {
                            // console.log('没有telphone');
                            wx.reLaunch({
                              url: "/pages/more/bindphone/bindphone"
                            });
                          }
                        } else {
                          // console.log('没有msession:'+_msession);
                          wx.reLaunch({
                            url: "/pages/login/login"
                          });
                        }
                      },
                      fail: function(error) {
                        console.log("解密失败！" + error);
                      }
                    });
                  },
                  fail: function() {
                    // console.log('获取用户信息失败！');
                    wx.hideLoading();
                    wx.showModal({
                      title: "温馨提示",
                      content:
                        "乐墨花时光是花店用来管理店铺的后台，为保证安全，请授权完成后再继续使用",
                      showCancel: false,
                      confirmText: "授权",
                      success: function(res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success: res => {
                              that.auth();
                            }
                          });
                        }
                      }
                    });
                  }
                });
              },
              fail: function(error) {
                console.log("code传输失败！" + error);
              }
            });
          } else {
            console.log("获取用户登录态失败！" + res.errMsg);
          }
        }
      });
    }
  },
  //活动显示配置
  activityConfig: function() {
    let that = this;
    let _shopid = wx.getStorageSync("shopid");
    let params = {
      shopid: _shopid
    };
    util.ajaxRequest("shopMobile/shopadmin/activityConfig", params, function(
      res
    ) {
      /*
      res.data.content.cloudproduct 云花艺
      res.data.content.sharecoupon 立减金
      res.data.content.shopvideo 视频
      */
      that.activityConfig = res.data.content;
    });
  },
  isBindGD() {
    // 判断有没有签约光大
    let params = { shopid: _shopid };
    util.ajaxRequest("shopMobile/shopadmin/isBindGD", params, function(res) {
      if (res.data.status == 1) {
        that.isBingGuangda = 1;
        wx.setStorageSync("isBingGuangda", that.isBingGuangda);
      }
    });
  },
  getLocalTime: function(nS) {
    var now = new Date(nS * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;
    return (
      year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    );
  },
  // 得到的时间戳
  getTimeStamp: function() {
    return parseInt(new Date().getTime() / 1000);
  }
});
