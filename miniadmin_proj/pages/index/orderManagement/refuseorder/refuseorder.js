 const utils = require('../../../../utils/util.js');
 const app = getApp();
 Page({

     data: {
         orderid: 0,
         stype: 1,
         
         type: 1, //1 实物订单 2 活动订单
     },
     onLoad: function(options) {

         let type = this.data.type;

         if (options.type == 2) {
             type = 2;
         }

         this.setData({
             orderid: options.id,
             type: type,
         });

     },
     seltype: function(e) {

         let _stype = e.target.dataset.stype;
         // console.info(_stype);
         this.setData({
             stype: _stype
         });
     },
     formSubmit: function(e) {
         let v = e.detail.value.inputtext;
         let _msession = wx.getStorageSync('msession');
         let _orderid = this.data.orderid;
         let stype = this.data.stype;
         let _formId = e.detail.formId;

         if (stype == 1) {
             v = '商家无法提供时令花材';
         } else if (stype == 2) {
             v = '商家不方便接单';
         } else if (stype == 3) {
             v = '无法满足定制鲜花要求（价格、花材等）';
         } else if (stype == 4) {
             v = '订单要求制作时间过短，不接急单';
         } else if (stype == 5) {
             v = '顾客预算与定制需求不匹配';
         } else if (stype == 6) {
             v = '超出配送范围';
         } else if (stype == 8) {
             v = '课程报名人数不足';
         } else if (stype == 9) {
             v = '商家取消活动';
         }

         let params = { id: _orderid, msession: _msession, reason: encodeURIComponent(v), formid: _formId };

         utils.ajaxRequest(
             'shopMobile/refund/refuse',
             params,
             function(res) {
                 if (res.data.status == 1) {
                     wx.showModal({
                         title: '提示',
                         content: res.data.msg,
                         showCancel: false,
                         success: function(res) {
                             wx.navigateBack({
                                 delta: 1
                             })
                         }
                     });
                 } else {
                     wx.showModal({
                         title: '提示',
                         content: res.data.msg,
                         showCancel: false,
                         success: function(res) {}
                     });
                 }

             });
     }


 })