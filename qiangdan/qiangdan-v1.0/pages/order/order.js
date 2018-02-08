var jiAddress;
var jipostion;
var shouAddress;
var shoupostion;
var payprices;
var isjia = 0;
var ji_lons;
var ji_lats;
var shou_lons;
var shou_lats;
var openid;
var gl;
var zl;
var code;
var orderid;

function countdown(that) {
  var second = that.data.second
  console.log(second);

  if (second == 0) {
    console.log("Time Out...");

    that.setData({
      second1: 'block',
      second2: 'none',
      second: 10,

    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiAddresss: '',
    shouAddresss: '',
    payprice: '',
    jiname: '',
    jitel: '',
    shouname: '',
    shoutel: '',
    goodsname: '',
    remark: '',
    inputCode: '',
    hiddenmodalput: true,
    second: 10,
    second1: 'block',
    second2: 'none',
  },

  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = wx.getStorageSync('openid');

    jiAddress = options.jiAddress;
    jipostion = options.jipostion;
    shouAddress = options.shouAddress;
    shoupostion = options.shoupostion;
    payprices = options.payprice;
    gl = options.gl;
    zl = options.zl;
    if (options.jipostion != '') {
      ji_lons = options.jipostion.split(',')[0];
      ji_lats = options.jipostion.split(',')[1];
    }
    if (options.shoupostion != '') {
      shou_lons = options.shoupostion.split(',')[0];
      shou_lats = options.shoupostion.split(',')[1];
    }


    this.setData({
      jiAddresss: jiAddress,
      shouAddresss: shouAddress,
      payprice: payprices,
      gl: gl,
      zl: zl,
    })
  }

  ,

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jiNames: function (e) {
    this.setData({
      jiname: e.detail.value
    })
  },
  jiTels: function (e) {
    this.setData({
      jitel: e.detail.value
    })
  },
  shouNames: function (e) {
    this.setData({
      shouname: e.detail.value
    })
  },
  shouTels: function (e) {
    this.setData({
      shoutel: e.detail.value
    })
  },
  goodsNames: function (e) {
    this.setData({
      goodsname: e.detail.value
    })
  },
  remarks: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  inputCode: function (e) {
    this.setData({
      inputCode: e.detail.value
    })
  },
  checkboxChange: function (e) {
    if (e.detail.value == '') {
      isjia = 0;
    } else {
      isjia = 1;

    }

  },
  nextBtn: function () {

    if (this.data.jiname == '') {
      wx.showToast({
        title: '请输入寄件人',
      })
      return;
    }
    if (this.data.jitel == '') {
      wx.showToast({
        title: '请输入寄件电话',
      })
      return;
    }
    if (this.data.shou_name == '') {
      wx.showToast({
        title: '请输入收件人',
      })
      return;
    }
    if (this.data.shoutel == '') {
      wx.showToast({
        title: '请输入收件电话',
      })
      return;
    }
    if (this.data.goodsname == '') {
      wx.showToast({
        title: '请输入物品名称',
      })
      return;
    }
    var that = this;
    this.changeYZ();

  },
  changeYZ: function () {
    var that = this;
    /**
    * 判断是否验证过手机号
    */
    wx.request({
      url: getApp().globalData.baseURL + 'user/changeYZ',
      data: {
        openId: openid,
      },
      method: 'post',

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {
          //表示第一次
          that.setData({
            hiddenmodalput: !that.data.hiddenmodalput
          })
        } else {
          wx.request({
            url: getApp().globalData.baseURL + 'order/inputOrder',
            data: {
              openid: openid,
              ji_address: that.data.jiAddresss,
              ji_lon: ji_lons,
              ji_lat: ji_lats,
              shou_address: that.data.shouAddresss,
              shou_lon: shou_lons,
              shou_lat: shou_lats,
              ji_name: that.data.jiname,
              ji_tel: that.data.jitel,
              shou_name: that.data.shouname,
              shou_tel: that.data.shoutel,
              isjia: isjia,
              jia_price: 0,
              payprice: that.data.payprice,
              goodsname: that.data.goodsname,
              remark: that.data.remark,
              gl: gl,
              zl: zl,

            },
            method: 'post',

            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);

              if (res.data.code == 0) {
                wx.showToast({
                  title: '下单失败，请稍后再试！',
                })
              } else if (res.data.code == 1) {
                orderid = res.data.orderid,
                  console.log(orderid);

                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': res.data.data.signType,
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '支付成功！',
                    })

                    wx.redirectTo({
                      url: '/pages/orderDetail/orderDetail?orderid=' + orderid,
                    })
                  },
                  'fail': function (res) {
                    console.log(res);

                    wx.showToast({
                      title: '支付失败！',
                    })

                    wx.request({
                      //获取openid接口  
                      url: getApp().globalData.baseURL + 'Order/del',
                      data: {
                        orderId: orderid,

                      },
                      method: 'post',
                      success: function (res) {
                        console.log(res.data)


                      }
                    })



                  }
                })

              } else {
                wx.showToast({
                  title: '系统繁忙，请稍后再试！',
                })
              }
              // that.setData({
              //   imgUrls: res.data.data,
              // });
            }
          })
        }

      }

    })
  },
  /**
   * 发送验证码
   */
  sendcode: function () {
    var that = this;
    console.log(that.data.jitel);
    countdown(this);
    wx.request({
      url: getApp().globalData.baseURL + 'message/sendCode',
      data: {
        phone: that.data.jitel,
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        code = res.data.data;

        that.setData({
          second1: 'none',
          second2: 'block',


        })

      }
    })
  },
  confirm: function () {

    if (this.data.inputCode == code) {
      this.setData({
        hiddenmodalput: true
      })

      wx.request({
        url: getApp().globalData.baseURL + 'User/updataUser',
        data: {
          openId: openid,
        },
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          // code = res.data.data;
          wx.showToast({
            title: '验证成功！',
          })

        }
      })


    } else {
      wx.showToast({
        title: '验证码错误！',
      })
    }
  }



})