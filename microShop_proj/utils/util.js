/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-02 19:22:04 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-08 16:03:59
 */
const config = require("../config");
const md5 = require("md5.js");
/*
    正则判断 邮件 手机号
 */
function regexConfig() {
  let reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)\d{9}$/
  };
  return reg;
}

/*
   时间戳格式化为时间 2018/01/08 13:33:33
 */
function timestampToTime(timestamp) {
  let date;
  if (timestamp == 10) {
    date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  } else {
    date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  }
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = date.getDate() + " ";
  let h = date.getHours() + ":";
  let m = date.getMinutes() + ":";
  let s = date.getSeconds();
  return Y + M + D + h + m + s;
}
/*
   时间格式化为时间戳
 */
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

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}

/*
    封装wx.request发送网络请求
 */
function ajaxRequest(url, data, success_callback, fail_callback, sign) {
  //统一开启loading
  wx.showLoading({
    title: "加载中..."
  });

  //开始参数封装
  let app = getApp();
  let _host = config.host;

  let _timestamp = getTimeStamp();
  let _params = JSON.stringify(data);
  let _sign = md5.hex_md5(_timestamp + _params + config.shopkey);

  //请求服务器
  wx.request({
    url: _host + url,
    data: { timestamp: _timestamp, params: _params, sign: _sign },
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
      //如果有正确返回参数就调用
      if (success_callback) {
        success_callback(res);
      } else {
        cAlert("网络请求成功！");
      }
    }
  });
}
/*
    错误提示
 */
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
/*
    modal弹出框
 */
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

/*
   得到当前时间戳
 */
function getTimeStamp() {
  return parseInt(new Date().getTime() / 1000);
}

/*
    当前坐标
 */

function formatLocation(longitude, latitude) {
  if (typeof longitude === "string" && typeof latitude === "string") {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
  }

  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);

  return {
    longitude: longitude.toString().split("."),
    latitude: latitude.toString().split(".")
  };
}

function setLogs() {
  // 设置启动日志
  // 展示本地存储能力
  let logs = wx.getStorageSync("logs") || [];
  logs.unshift({
    timeStamp: Date.now(),
    time: formatTime(new Date())
  });
  wx.setStorageSync("logs", logs);
}

function getuserinfo() {
  // 获取用户信息
  let wxapp = getApp();
  wx.getSetting({
    success: res => {
      if (res.authSetting["scope.userInfo"]) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            wxapp.userInfo = res.userInfo;
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (wxapp.userInfoReadyCallback) {
              wxapp.userInfoReadyCallback(res);
            }
          }
        });
      }
    }
  });
}

module.exports = {
  getuserinfo: getuserinfo,
  setLogs: setLogs,
  formatLocation: formatLocation, //坐标
  cAlert: cAlert, //modal弹出框
  getTimeStamp: getTimeStamp, //得到当前时间戳
  regexConfig: regexConfig, //判断手机号 邮件
  formatTime: formatTime, //当前日期 格式化
  timestampToTime: timestampToTime,
  ajaxRequest: ajaxRequest //网络请求
};
