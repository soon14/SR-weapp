Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    order_status: '',
    ji_name: '',
    ji_tel: '',
    ji_address: '',
    ji_lat: '',
    ji_lon: '',
    shou_name: '',
    shou_tel: '',
    shou_address: '',
    shou_lat: '',
    shou_lon: '',
    goodsname: '',
    remark: '',
    is_jia: '',
    jia_price: '',
    pay_price: '',
    gl: '',
    zl: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.orderid);
    this.getOrderDetail(options.orderid);
  },
  querenQJ: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.baseURL + 'Order/getQRSH',
      data: {
        orderId: that.data.orderId,
      },
      method: 'post',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        console.log(res)
        that.getOrderDetail(that.data.orderId);
        if (res.data.code == 1) {
          wx.showToast({
            title: '操作成功！',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })

        }

      },

      fail: function () {
        console.log('数据加载失败')
      }
    })
  },
  querenSH: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.baseURL + 'Order/getQRSD',
      data: {
        orderId: that.data.orderId,
      },
      method: 'post',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        console.log(res)
        that.getOrderDetail(that.data.orderId);

        if (res.data.code == 1) {
          wx.showToast({
            title: '操作成功！',
          })
        }
      },

      fail: function () {
        console.log('数据加载失败')
      }
    })
  },

  getOrderDetail: function (orderid) {
    var that = this;
    wx.request({
      url: getApp().globalData.baseURL + 'order/getOrderDetailById',

      data: {
        orderId: orderid,
      },
      method: 'post',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)

        if (res.data.code == 1) {
          console.log(res.data.data.orderid);
          that.setData({
            orderId: res.data.data.orderid,
            order_status: res.data.data.order_status,
            ji_name: res.data.data.ji_name,
            ji_tel: res.data.data.ji_tel,
            ji_address: res.data.data.ji_address,
            ji_lat: res.data.data.ji_lat,
            ji_lon: res.data.data.ji_lon,
            shou_name: res.data.data.shou_name,
            shou_tel: res.data.data.shou_tel,
            shou_address: res.data.data.shou_address,
            shou_lat: res.data.data.shou_lat,
            shou_lon: res.data.data.shou_lon,
            goodsname: res.data.data.goodsname,
            remark: res.data.data.remark,
            isjia: res.data.data.isjia,
            jia_price: res.data.data.jia_price,
            pay_price: res.data.data.payprice,
            gl: res.data.data.gl,
            zl: res.data.data.zl,
          })
        }
      },

      fail: function () {
        console.log('数据加载失败')
      }
    })
  },
  peisongPos: function () {
    wx.navigateTo({
      url: '/pages/peisongyuan/peisongyuan',
    })
  }
   


})