//app.js
var baseUrl = 'http://192.168.1.103/getorder/public/api/';
var ImageUrl = 'http://192.168.1.103/getorder/public/';

// var baseUrl = 'https://xiaochengxu.hemiaoit.com/getorder/public/a
// var baseUrl = 'https://xxf.ql178.com/getorder/public/api/';
// var ImageUrl = 'https://xxf.ql178.com/getorder/public/';





App({

  onLaunch: function () {
    // if (wx.getStorageSync('openid')) {
    //   return;
    // }
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: baseUrl + 'User/getOpenid',
          data: {
            code: res.code,
          },
          header: {
            'Content-Type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            console.log("===dd===" + res)
            console.log("===dd===" + res.data)
            console.log("===dd===" + res.data.openid)
           var OPEN_ID = res.data.openid;//获取到的openid
            // var OPEN_ID = 'oZOD20Dcz74p1OR62OmOKk71uB-8';
            var SESSION_KEY = res.data.session_key;//获取到session_key  
            // console.log(SESSION_KEY.length)
            wx.getUserInfo({
              success: function (res) {
              
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl

                console.log("===getUserInfo11===" + OPEN_ID)
                console.log("===getUserInfo22===" + userInfo.avatarUrl)
                console.log("===getUserInfo33===" + userInfo.nickName)


                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country
                wx.setStorageSync('openid', OPEN_ID)

              //   wx.setStorageSync('openid', 'oZOD20Dcz74p1OR62OmOKk71uB-8')
                wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
                wx.setStorageSync('nickName', userInfo.nickName)
                wx.request({
                  //获取openid接口  
                  url: baseUrl + 'User/getUserInfo',
                  data: {
                    openId: OPEN_ID,
                   //  openId:  'oZOD20Dcz74p1OR62OmOKk71uB-8',
                    wename: nickName,
                    weimage: avatarUrl,
                  },
                  method: 'post',
                  success: function (res) {
                    console.log("==11==" + res.data.code)
                    console.log("=222===" + res.data.msg)

                    // var OPEN_ID = res.data.openid;//获取到的openid  
                    // var SESSION_KEY = res.data.session_key;//获取到session_key  
                    // console.log(OPEN_ID.length)
                    // console.log(SESSION_KEY.length)

                  }
                })
              }
            })

          }
        })
         
      }

    })
  },
  globalData: {
    userInfo: null,
    city: wx.getStorageSync('city') ? wx.getStorageSync('city') : '城市',
    lat: null,
    lon: null,
    // baseURL: 'https://xiaochengxu.hemiaoit.com/getorder/public/api/'
    baseURL: baseUrl,
    ImageUrl: ImageUrl,
  }
})