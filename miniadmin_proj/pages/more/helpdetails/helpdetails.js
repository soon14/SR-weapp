var app = getApp();
Page({
  data:{
    backBtnTxt:'返回'
  },
  onLoad:function(){
    
  },
  
  savepic:function(){
   
    wx.saveImageToPhotosAlbum({
      filePath: '/images/1.jpeg',
      success: function () {
        wx.showToast({
          title: '二维码已保存到相册',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  copywxnum:function(){
   
    wx.setClipboardData({
      data: 'bit817',
      success: function (res) {
        wx.showToast({
          title: '订单号已复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  back:function(){
    wx.navigateBack({
      delta:1
    });
  }
  
})