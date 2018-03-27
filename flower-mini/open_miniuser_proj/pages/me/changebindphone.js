var md5 = require('../../utils/md5.js');
var app = getApp();
var secs = 60;
var timer = null;
Page({
  data:{
   binddesc:'',
    cando:false,
    telphone:''
  },
  
  onLoad: function () {
     this.setData({
        binddesc:'获取验证码'
      });
      
  },

  inputnum:function(e){
     var v = e.detail.value;
    this.setData({
      telphone:v
    });
    if(v.length == 11){
      this.setData({
        cando:true
      });
    }
  },
  sendcode:function(e){
   console.info(e);
    var t = this;
    if(this.data.cando){
      t.realsend();
      timer = setInterval(function(){

          if(secs <= 0){
              clearInterval(timer);
              t.setData({
                cando:true,
                binddesc:'获取验证码'
              });
              secs = 60;
          }else{
              
              t.setData({
                cando:false,
                binddesc:secs+'秒'
              });
          }
          secs--;
      },1000);
    }
  },
  formSubmit: function(e) {
    var _telphone = e.detail.value.telphone;
    var _vercode = e.detail.value.vercode;
    var _openid = wx.getStorageSync('openid');
    var _timestamp = app.getTimeStamp();
    var _params = JSON.stringify({ openid: _openid, telphone: _telphone, vercode: _vercode });
    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

    wx.request({
      url: app.host + '/buyerMobile/wxuser/bindPhone',
      data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      complete: function(res) {
        var s = res.data.suc;
        if(s == 0){
           wx.showToast({
              title: '验证码错误',
              icon: 'success',
              duration: 2000
            })
        }
        else if(s == -1){
             wx.showToast({
                title: '系统错误',
                icon: 'success',
                duration: 2000
              })
        }
        else if(s == 1){
          wx.navigateBack({delta: 1});
        }
       
      }
    })

  
  },
  realsend:function(){
    var _openid = wx.getStorageSync('openid');
    var _telphone = this.data.telphone;
    var _timestamp = app.getTimeStamp();
    var _params = JSON.stringify({ openid: _openid, telphone: _telphone });
    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
    wx.request({
      url: app.host + '/buyerMobile/wxuser/sendCode',
      data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      complete: function(res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})
