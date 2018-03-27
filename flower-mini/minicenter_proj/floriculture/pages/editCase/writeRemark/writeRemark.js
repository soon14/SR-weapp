 /**
  *  @author Shirui 2018/03/21
  *  37780012@qq.com
  */
 const app = getApp();
 Page({
     data: {
         schemeIntro: null
     },
     onLoad: function() {
         if (app.addFormInfo.schemeIntro) {
             this.setData({
                 schemeIntro: app.addFormInfo.schemeIntro
             })
         }
     },
     //方案简介
     formSubmit: function(e) {

         app.addFormInfo = Object.assign(app.addFormInfo, e.detail.value);

         wx.navigateBack({
             delta: 1
         });

     }
 })