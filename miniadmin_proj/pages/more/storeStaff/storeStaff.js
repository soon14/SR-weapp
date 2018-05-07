/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-04 11:20:19 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-04 11:57:23
 */
const config = require("../../../config.js");
const util = require("../../../utils/util.js");
const app = getApp();
Page({
  data: {
    msession: null,
    shopid: null,
    isShow: false,
    phoneNum: "", //手机号
    list: null,
    isshowimg: false
  },
  onLoad: function(options) {
    let _msession = wx.getStorageSync("msession") || "";
    let _shopid = wx.getStorageSync("shopid") || "";
    this.setData({
      msession: _msession,
      shopid: _shopid
    });
  },
  onShow: function() {
    this.refresh();
  },
  bindMinicenter: function() {
    //打开商家中心小程序
    wx.navigateToMiniProgram({
      appId: config.minicenterAppId,
      path: "", //打开的页面路径，如果为空则打开首页
      extraData: {
        // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
      },
      success(res) {
        console.log(res);
        // 打开成功
      },
      fail(res) {
        //接口调用失败的回调函数
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: res.errMsg,
          success: function(res) {}
        });
      }
    });
  },
  /**
   * [refresh 请求数据]
   * 当前店铺所有副管理员
   * mobile/shopadmin/isNonMainManager
   * 参数 shopid
   */
  refresh: function() {
    let that = this;
    let _shopid = that.data.shopid;
    let params = { shopid: _shopid };

    util.ajaxRequest("shopMobile/shopadmin/isNonMainManager", params, function(
      res
    ) {
      if (res.data.content.length > 0) {
        that.setData({
          list: res.data.content,
          isshowimg: false
        });
      } else {
        that.setData({
          list: null,
          isshowimg: true
        });
      }

      that.setData({
        list: res.data.content
      });
    });
  },
  /**
   * [deletePhoneNum 删除副管理员]
   * 删除副管理员
   * mobile/shopadmin/delNonMainManager
   * 参数id,delid（要删除的id）,shopid
   */
  deletePhoneNum: function(e) {
    let that = this;
    let _deletePhoneNum = e.currentTarget.dataset.telphone;
    let _delid = e.currentTarget.dataset.delid;
    let _shopid = that.data.shopid;
    wx.showModal({
      title: "温馨提示",
      content: "确定删除该员工吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: function(res) {
        if (res.confirm) {
          let _msession = that.data.msession;
          let params = {
            msession: _msession,
            shopid: _shopid,
            delid: _delid,
            telphone: _deletePhoneNum
          };

          util.ajaxRequest(
            "shopMobile/shopadmin/delNonMainManager",
            params,
            function(res) {
              // console.info("删除副管理员", _params);

              setTimeout(function() {
                wx.showToast({
                  title: res.data.msg,
                  icon: "success",
                  duration: 1000
                });
              }, 1000);

              that.refresh();
            }
          );
        }
      }
    });
  },
  /**
   * [setupManager 设置主管理员]
   * mobile/shopadmin/isNonMainManager
   * 参数id,changemainid,shopid
   */
  setupManager: function(e) {
    let that = this;
    let _deletePhoneNum = e.currentTarget.dataset.telphone;
    let _changemainid = e.currentTarget.dataset.delid;
    let _shopid = that.data.shopid;
    wx.showModal({
      title: "温馨提示",
      content: "确定设置该员工为主管理员吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: function(res) {
        if (res.confirm) {
          let _msession = that.data.msession;
          let params = {
            msession: _msession,
            shopid: _shopid,
            changemainid: _changemainid
          };

          util.ajaxRequest(
            "shopMobile/shopadmin/changeMainManager",
            params,
            function(res) {
              /// console.info("主管理员", res);

              setTimeout(function() {
                wx.showToast({
                  title: res.data.msg,
                  icon: "success",
                  duration: 1000
                });
              }, 1000);

              wx.redirectTo({
                url: "/pages/more/more"
              });
            }
          );
        }
      }
    });
  },
  /**
   * [additem 添加员工按钮]
   */
  additem: function() {
    this.setData({
      isShow: true,
      phoneNum: ""
    });
  },
  /**
   * [cancel 取消添加]
   */
  cancel: function() {
    this.setData({
      isShow: false,
      phoneNum: ""
    });
    this.refresh();
  },
  /**
   * [confirm 确定添加]
   */
  addNumber: function() {
    let that = this;
    let _telphone = that.data.phoneNum;
    if (that.checkTelphone(_telphone)) {
      that.sendAddTelphone(_telphone);
    } else {
      that.setData({
        phoneNum: ""
      });
    }
  },
  /**
   * [getPhoneNum 获取手机号]
   * @param  {[type]} e [description]
   */
  getPhoneNum: function(e) {
    let phoneNum = e.detail.value;
    this.setData({
      phoneNum: phoneNum
    });
  },
  /**
   * [checkTelphone 正则检测输入手机号]
   * @param  {[type]} telphone [输入的手机号]
   */
  checkTelphone: function(telphone) {
    let phone = util.regexConfig().phone; //验证手机号正则
    let inputTelphone = telphone.trim();
    if (phone.test(inputTelphone)) {
      return true;
    } else {
      wx.showModal({
        title: "提示",
        showCancel: false,
        content: "请输入正确的手机号码"
      });
      return false;
    }
  },
  /**
   * 添加员工接口
   * shopMobile/shopadmin/addNonMainManagerNew
   * 参数id,shopid,telphone
   */
  sendAddTelphone: function(phoneNum) {
    let that = this,
      params = {
        msession: that.data.msession,
        shopid: that.data.shopid,
        telphone: phoneNum
      };

    util.ajaxRequest(
      "shopMobile/shopadmin/addNonMainManagerNew",
      params,
      function(res) {
        if (res.data.status == 1) {
          setTimeout(function() {
            wx.showToast({
              title: res.data.msg,
              icon: "success",
              duration: 1000
            });
          }, 1500);

          that.setData({
            isShow: false
          });

          that.refresh();
        } else if (res.data.status == 2) {
          wx.showModal({
            title: "温馨提示",
            content: res.data.msg,
            confirmText: "邀请注册",
            success: function(res) {
              if (res.confirm) {
                that.bindMinicenter(); //去商家中心
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            }
          });
        } else {
          wx.showModal({
            title: "温馨提示",
            content: res.data.msg,
            showCancel: false,
            confirmText: "确定",
            success: function(res) {}
          });
        }
      }
    );
  },
  onPullDownRefresh: function() {
    this.refresh();
    wx.stopPullDownRefresh();
  }
});
