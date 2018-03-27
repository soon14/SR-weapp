//logs.js
var cnum = 1;
var cprice = 955;
Page({
  data: {
    num :cnum,
    price:cprice*cnum
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '真爱永恒 - 永生玫瑰01'
    });
    this.setData({
        num:cnum,
        price:cprice*cnum
    });
  },
  gotobuy:function(){
    wx.redirectTo({
      url: '/pages/order/order'
    });
  },
  plus:function(e){
    cnum++;
    this.setData({
        num:cnum,
        price:cprice*cnum
    });
  },
  unplus:function(e){
    cnum--;
    this.setData({
        num:cnum,
        price:cprice*cnum
    });
  }
})
