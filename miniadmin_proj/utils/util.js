/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-03 10:48:13 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-03 15:47:57
 */

var md5 = require("md5.js");

function regexConfig() {
  let reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)\d{9}$/
  };
  return reg;
}

function formatTime(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
}

/**
 *  @author Sunkai 2017/12/09
 */
function ajaxRequest(url, data, success_callback, fail_callback) {
  //统一开启loading
  wx.showLoading({
    title: "加载中..."
  });

  //开始参数封装
  let app = getApp();
  let _msession = app.msession;
  let _shopid = app.shopid;

  let _timestamp = app.getTimeStamp();
  let _params = JSON.stringify(data);
  let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

  //请求服务器
  wx.request({
    url: app.host + url,
    data: {
      msession: _msession,
      shopid: _shopid,
      timestamp: _timestamp,
      params: _params,
      sign: _sign
    },
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    fail: function(res) {
      //如果有错误回调方法，就执行错误回调
      if (fail_callback) {
        fail_callback(res);
      } else {
        requestErrorMsg("请检查网络！");
      }
    },
    complete: function(res) {
      //关闭loading
      wx.hideLoading();
      //统一打印debug信息
      console.log("params:", _params);
      console.log(url, ":", res);
    },
    success: function(res) {
      //如果网络返回不是200，提示网络错误
      if (res.statusCode != "200") {
        requestErrorMsg("网络错误：" + res.statusCode);
        return;
      }

      // 如果没有权限 true false
      if (!res.data.access) {
        wx.showModal({
          title: "提示",
          content: res.data.msg,
          showCancel: false,
          complete: function(res) {
            app.auth();
          }
        });
        return;
      }

      //如果有正确返回参数就调用
      if (success_callback) {
        success_callback(res);
      } else {
        cAlert("网络请求成功！");
      }
    }
  });
}

function requestErrorMsg(content) {
  wx.showModal({
    title: "提示",
    content: content,
    confirmText: "重新加载",
    cancelText: "返回",
    complete: function(res) {
      if (res.confirm) {
        ajaxRequest(url, data, success_callback);
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    }
  });
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}

function cAlert(msg) {
  if (msg) {
    wx.showModal({
      title: "提示",
      content: msg,
      confirmText: "确认",
      showCancel: false
    });
  }
}

module.exports = {
  cAlert: cAlert,
  regexConfig: regexConfig,
  formatTime: formatTime,
  ajaxRequest: ajaxRequest
};
