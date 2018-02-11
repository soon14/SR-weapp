//index.js
//获取应用实例
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
const app = getApp()

var jc_zl;
var jc_lc;
var gj;
var lucheng;
var gl;
var jcfee = 0;
var luchengs;//路程
var num = 0;//新增重量
var dis = 0;//新增里程数
var yijia = 0;//新增里程数

Page({
  data: {
    imgUrls: [
      '/images/pic.png',
      '/images/pic.png',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    payprice: '',
    jiAddress: '',
    jipostion: '',
    shouAddress: '',
    shoupostion: '',
    unit: '公斤以下',
    num: '',
    lucheng: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('2222');
    var that = this;
    console.log(options);
    console.log(!options);
    console.log(typeof(options) == "undefined");
    // console.log(isNaN(options));

    console.log(JSON.stringify(options)=='{}');

    
    // console.log('jiAddress='+wx.getStorageSync('jiAddress'));
    // if (wx.getStorageSync('jiAddress')!=''){
    if (JSON.stringify(options)!='{}') {
      this.setData({
        jiAddress: options.ji_address,
        shouAddress: options.shouAddress,
        jipostion: options.jipostion,
        shoupostion: options.shoupostion,
      });
    }

    //   this.getDisOrMoney(this,wx.getStorageSync('shoupostion'), wx.getStorageSync('jipostion'));

    // }

    this.getBaseInfo(this);
    wx.request({
      url: getApp().globalData.baseURL + 'Order/getBaseStatusFee',
      method: 'post',
      success: function (res) {
        console.log(res.data);

        if (res.data.code == 1) {
          if (res.data.data.status == 1) {
            yijia = res.data.data.yijia;
          } else {
            yijia = 0;
          }
        }
        // console.log(parseFloat(jcfee) + parseFloat(yijia));
        that.setData({
          payprice: parseFloat(jcfee) + parseFloat(yijia),

        });
      },

      fail: function () {
        console.log('数据加载失败')
      }
    })

    that.setData({
      city: getApp().globalData.city
    })


  },
  onShow: function () {
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    var that = this;

    if (this.data.shoupostion != '' && this.data.jipostion != '') {
      this.getBaseInfo(this);
      this.getDisOrMoney(this, this.data.shoupostion, this.data.jipostion);

    }
  },
  congna: function () {
    console.log(this.data.city);
    if (this.data.city == '城市') {
      wx.showToast({
        title: '请先选择城市！',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/address/address?pos=0',
    })
  },
  songna: function () {
    if (this.data.city == '城市') {
      wx.showToast({
        title: '请先选择城市！',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/address/address?pos=1',
    })
  },


  /* 物品重量 减 */
  cutNum: function () {
    var num = this.data.num;
    var unit = this.data.unit;
    var jian_zl;

    // 大于5，才可以减  
    if (num > jc_zl) {
      num--;
      jian_zl = num - jc_zl
      var ss = this.getmoney(jian_zl, dis);
      console.log('钱数11' + jian_zl);

      console.log('钱数11' + ss);

      this.setData({
        unit: '公斤'
      });
    };
    if (num == jc_zl) {
      this.setData({
        unit: '公斤以下'
      });
    };
    // 将数值写回  
    this.setData({
      num: num,
    });

    this.setData({
      payprice: ss
    });
  },
  /* 加 */
  addNum: function () {
    num = this.data.num;
    num++;
    var xin_zl = num - jc_zl;
    console.log('新增公斤' + xin_zl);

    if (num > jc_zl) {
      this.setData({
        unit: '公斤'
      });
    }
    // 数值写回  
    this.setData({
      num: num
    });
    var ss = this.getmoney(xin_zl, dis);
    this.setData({
      payprice: ss
    });

  },
  /* 输入框 */
  CountNum: function (e) {
    var num = e.detail.value;
    // 将数值写回  
    this.setData({
      num: num
    });
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  nextBtn: function () {


    if (this.data.jiAddress == '') {
      wx.showToast({
        title: '请选择寄件地址！',
      })
      return;
    }
    if (this.data.shouAddress == '') {
      wx.showToast({
        title: '请选择收件地址！',
      })
      return;
    }

    var jiAddresses = getApp().globalData.city+this.data.jiAddress;
    var shouAddresses = getApp().globalData.city+this.data.shouAddress;

    wx.navigateTo({
      url: '/pages/order/order?jiAddress=' + jiAddresses + '&shouAddress=' + shouAddresses + '&jipostion=' + this.data.jipostion + '&shoupostion=' + this.data.shoupostion + '&payprice=' + this.data.payprice + '&gl=' + this.data.lucheng + '&zl=' + this.data.num,
    })


  },

  getmoney: function (e, distance) {

    console.log("公里===" + distance);
    console.log("公斤===" + e);


    var zlsPrice = 0;//15公斤以内钱数

    var gls = 0;


    if (parseInt(e) == 0) {
      zlsPrice = 0;
      //console.log(333333);

    };
    console.log(parseInt(e) <= 15);

    if (parseInt(e) <= 15) {
      zlsPrice = e * 2;

    } else if (parseInt(e) > 15) {

      var pr = parseInt(e) - 15;
      // console.log('公斤差' + pr);
      // console.log('原价' + zlsPrice);

      zlsPrice = 15 * 2 + pr * 5;
      // console.log('现价' + zlsPrice);

      //console.log(222222);

    };
    /**
     * 公里数
     */

    if (distance <= 0) {
      console.log(55555);
      gls = 0;
    } else if (distance > 0 && distance <= 15) {
      console.log(15151515);
      var s = distance / 2.5;
      gls = Math.ceil(s) * 5

    } else if (distance > 15) {
      console.log(20202020);
      var h = (distance - 15) / 2.5;
      gls = 21 + Math.ceil(h) * 8

    }


    // if (distance< 15) {
    //    console.log('距离111' + (distance / 2.5) );

    //   gls = 3.5 * distance / 2.5;
    // };
    // if (distance > 15) {
    //   gls = 15 / 2.5 * 3.5 + 5 * distance / 2.5;
    // };
    // console.log('增加公斤数' + e);
    // //console.log('增加公斤数' + zlsPrice);
    // // console.log('增加公斤数' + yijia);
    // console.log('距离' + distance);
    // console.log('基础钱数' + jcfee);
    // console.log('重量钱数' + zlsPrice);
    // console.log('公里钱数' + gls);

    var allMoney = parseFloat(jcfee) + parseFloat(zlsPrice) + parseFloat(gls) + parseFloat(yijia);
    // var allMoney = parseFloat(jcfee) + parseFloat(e * gj) + parseFloat(distance * gl);
    //var allMoney = parseFloat(jcfee) + parseFloat(e * gj) + parseFloat(lucheng * gl);
    //console.log(allMoney);
    var sallMoney = Math.round(allMoney);
    return sallMoney;

  }
  ,
  getDisOrMoney: function (that, shoupostion, jipostion) {
    wx.request({
      url: getApp().globalData.baseURL + 'Address/getdistance',
      data: {
        shoupostion: shoupostion,
        jipostion: jipostion,
      },
      method: 'get',
      success: function (res) {
        console.log('getDisOrMoney' + res.data.results[0].distance)
        console.log('getDisOrMoney' + jc_lc)

        var distances = res.data.results[0].distance;
        if (parseFloat(distances) / 1000 > jc_lc) {

          var luchengs = parseFloat(distances) / 1000;
          console.log(luchengs);

          console.log(luchengs.toFixed(2));
          that.setData({
            // lucheng: Math.round(luchengs)
            lucheng: luchengs.toFixed(2)
          });
          dis = parseFloat(distances) / 1000 - jc_lc;

          var ss = that.getmoney(0, dis);
          that.setData({
            payprice: ss
          });
        } else {

          that.getBaseInfo(that);
        }
      }
    })
  },

  getBaseInfo: function (that) {
    wx.request({
      url: getApp().globalData.baseURL + 'Order/getBaseInfo',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)

        jc_zl = res.data.data.jc_zl
        jc_lc = res.data.data.jc_lc
        gj = res.data.data.yi_gj
        gl = res.data.data.yi_gl
        jcfee = res.data.data.jcfee

        console.log(parseFloat(jcfee) + parseFloat(yijia));

        that.setData({
          payprice: parseFloat(jcfee) + parseFloat(yijia),
          num: jc_zl,
          lucheng: jc_lc,
        });

      },

      fail: function () {
        console.log('数据加载失败')
      }
    })
  },
   onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邻速达',
      path: '/pages/index1/index1',
      success: function (res) {
        // 转发成功
        console.log(res)

      },
      fail: function (res) {
        // 转发失败
        console.log(res)

      }
    }
  }

})
