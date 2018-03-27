
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
   
  },
  phonecall: function () {
    wx.makePhoneCall({
      phoneNumber: '0755-86665949'
    })
  },
})