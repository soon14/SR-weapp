var openId;
var ZMPath = '';
var FMPath = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ZM: '/images/pic.jpg',
    FM: '/images/pic.jpg',
    realname: '',
    card: '',
    tel: '',
    ji_tel:'',
    cards:'',
    bankName: '',
    ImageUrl: getApp().globalData.ImageUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = wx.getStorageSync('openid');
    // card: '',
    //   bankName: '',
  },
  /**
   * 获取银行卡号
   */
  cards: function (e) {
    this.setData({
      cards: e.detail.value
    })
  },
  /**
   * 获取银行名称
   */
  bankName: function (e) {
    this.setData({
      bankName: e.detail.value
    })
  },
  /**
   * 获取真实姓名
   */
  realname: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },
  /**
  * 获取身份证号码
  */
  card: function (e) {
    this.setData({
      card: e.detail.value
    })
  },
  /**
  * 获取手机号码
  */
  tel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  ji_tel: function (e) {
    this.setData({
      ji_tel: e.detail.value
    })
  },
  ZMImage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album', 0)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera', 0)
          }
        }
      }
    })
  },
  FMImage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album', 1)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera', 1)
          }
        }
      }
    })
  },
  chooseWxImage: function (type, imageType) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // console.log(imageType);
        if (imageType == 0) {
          _this.upLoadImage(openId, 0, res.tempFilePaths[0])
        } else {
          _this.upLoadImage(openId, 1, res.tempFilePaths[0])
        }
      }
    })
  },
  upLoadImage: function (openId, types, filePath) {
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.baseURL + 'UploadImage/upload',
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'openId': openId,
        'types': types
      },
      success: function (res) {
        console.log(res.data);
        console.log(res.data.code);

        var data = res.data
        var datas = JSON.parse(res.data);

        if (types == 0) {
          console.log(datas.cardpic_z);

          console.log(filePath);
          that.setData({
            ZM: getApp().globalData.ImageUrl + datas.cardpic_z,
          })
          ZMPath = datas.cardpic_z
        } else {
          console.log(datas.cardpic_f);
          that.setData({
            FM: getApp().globalData.ImageUrl + datas.cardpic_f,
          })
          FMPath = datas.cardpic_f
        }

        //do something
      }
    })
  },
  sureBtn: function () {
    console.log(this.data.realname);
    console.log(this.data.tel);
    console.log(this.data.card);
    if (this.data.realname == '') {
      wx.showToast({
        title: '请输入真实姓名',
      })
      return;
    }
    if (this.data.tel == '') {
      wx.showToast({
        title: '请输入手机号码',
      })
      return;
    }
    if (this.data.ji_tel == '') {
      wx.showToast({
        title: '请输入紧急联系人',
      })
      return;
    }
    if (this.data.cards == '') {
      wx.showToast({
        title: '请输入银行卡号',
      })
      return;
    }
    if (this.data.bankName == '') {
      wx.showToast({
        title: '请输入身份证号码',
      })
      return;
    }
    if (ZMPath == '') {
      wx.showToast({
        title: '请选择正面照片',
      })
      return;
    }

    if (FMPath == '') {
      wx.showToast({
        title: '请选择反面照片',
      })
      return;
    }

    wx.request({
      url: getApp().globalData.baseURL + 'User/applyDC',
      data: {
        realname: this.data.realname,
        card: this.data.card,
        tel: this.data.tel,
        ji_tel: this.data.ji_tel,
        cards: this.data.cards,
        bankName: this.data.bankName,

        openId: openId,
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.navigateBack({
        })
        console.log(res.data);
        if (res.data.code == 0) {
          wx.showToast({
            title: '申请失败，请稍后再试！',
          })
        } else {
          wx.showToast({
            title: '申请成功，请耐心等待！',
          })
        }

      }
    })

  }
})