 var utils = require('../../../../utils/util.js');
 var app = getApp();
 Page({
     data: {
         list: null, //获取备注信息
         id: null,
     },
     onLoad: function(e) {
         let that = this;
         that.setData({
             id: e.id
         });
         /*
         获取备注信息 shopMobile/orderManage/getRemark，参数id
          */
         let params = { id: e.id };

         utils.ajaxRequest(
             'shopMobile/orderManage/getRemark',
             params,
             function(res) {
                 if (res.data.status = 1) {
                     that.setData({
                         list: res.data.content.remark
                     });
                 } else {
                     wx.showModal({
                         title: '提示',
                         showCancel: false,
                         content: res.data.msg,
                         success: function(res) {}
                     })
                 }
             });
     },
     //备注
     formSubmit: function(e) {
         let that = this;
         let _remark = encodeURIComponent(e.detail.value.remark);
         let params = { id: that.data.id, remark: _remark };
         utils.ajaxRequest(
             'shopMobile/orderManage/writeRemark',
             params,
             function(res) {
                 if (res.data.status = 1) {
                     wx.navigateBack({ delta: 1, });
                 } else {
                     wx.showModal({
                         title: '提示',
                         showCancel: false,
                         content: res.data.msg,
                         success: function(res) {}
                     })
                 }
             });
     }
 })