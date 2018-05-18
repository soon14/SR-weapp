/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-08 11:31:08 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-08 11:49:26
 */

const util = require("util");

// 初始化 授权 获取所需数据
function auth() {
  let wxapp = getApp(),
    _msession = "";

  try {
    //当小程序初始化完成时调用API从本地缓存中获取数据
    _msession = wx.getStorageSync("msession") || "";

    //当小程序初始化完成时从本地缓存中获取数据进行本地缓存
    wx.setStorageSync("msession", _msession);

    wxapp.msession = _msession;
  } catch (err) {
    console.log(err);
  }

  if (_msession) {
    console.log("有msession", _msession);
    getMember();
  } else {
    console.log("没有msession");
    //调用登录接口重新登录
    login();
  }
}

function getMember() {
  /**
   *  商家中心
   *  有msesssion获取用户信息
   *  shopMobile/invite/getMember
   *  参数 {msesssion:''}
   */
  let wxapp = getApp(),
    params = {
      msession: wx.getStorageSync("msession")
    };

  util.ajaxRequest("centerMobile/login/getMemberInfo", params, function(res) {
    console.log("首页获取用户信息", res.data.content);
    if (res.data.status == 1) {
      //进行数据本地缓存
      var _content = res.data.content;
      wx.setStorageSync("msession", _content.msession);
      wxapp.userInfo = _content;
      wxapp.msession = _content.msession;

      //这里没有拿到手机号，跳转到手机号绑定页面
      if (!_content.telphone) {
        bindphone();
        return;
      }
    } else {
      // 如果msession过期，重新执行登陆
      login();
    }
  });
}

// 登陆获取 code
function login() {
  let wxapp = getApp();
  wx.login({
    success: function(res) {
      if (res.code) {
        // console.log('code', res.code);
        var param = { code: res.code };
        codeGetInfo(param); //换取SessionKey
      } else {
        console.log("获取用户登录态失败！" + res.errMsg);
      }
    }
  });
}

function codeGetInfo(params) {
  /**
   * 商家中心
   * code换取sessionkey
   * 接口URL：/centerMobile/login/code
   * 交互类型：POST
   * 传入参数：
   * code     用户登录凭证
   */
  let wxapp = getApp();
  util.ajaxRequest("centerMobile/login/code", params, function(res) {
    // console.log('换取SessionKey', res.data);
    wx.setStorageSync("unionid", res.data.unionid);
    wx.setStorageSync("openid", res.data.openid);
    wx.setStorageSync("session_key", res.data.session_key);

    try {
      wx.setStorageSync("msession", res.data.msession);
    } catch (e) {}

    var checkBindPhone_params = {
      unionId: res.data.unionid,
      openId: res.data.openid
    };
    checkBindPhone(checkBindPhone_params); // 判断绑定状态
  });
}

function checkBindPhone(_params) {
  /**
   * 检查用户是否绑定手机号：
   * 接口URL：/centerMobile/login/checkBindPhone
   * 交互类型：POST
   * 传入参数：
   * unionId     用户凭证
   * 成功json:
    {
          "telphone":"121212",         --用绑定手机号
          "bindPhoneStatus":"true",     --true,用户已绑定，false未绑定
          "msession":"", 
      }
   */
  let wxapp = getApp(),
    params = _params;

  util.ajaxRequest("centerMobile/login/checkBindPhone", params, function(res) {
    if (res.data.status == 1) {
      //进行数据本地缓存
      var _content = res.data.content;
      if (_content.telphone.length > 0) {
        wx.setStorageSync("msession", _content.msession);
        wxapp.msession = _content.msession;

        auth(); //执行登陆
      } else {
        //用户的手机号 可能为空 为空需要强制跳转到绑定页面
        bindphone();
        return;
      }
    } else {
      bindphone();
      return;
    }
  });
}

// 去绑定手机号
function bindphone() {
  console.log("暂无手机号注册");
  // wx.reLaunch({
  //   url:
  //     "/pages/component/register/register?inviteCode=" +
  //     this.recommendInviteCode
  // });
}

module.exports = {
  auth: auth //身份验证
};
