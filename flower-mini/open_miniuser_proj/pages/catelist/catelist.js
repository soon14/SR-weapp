var md5 = require('../../utils/md5.js');
var app = getApp();
Page({
    data: {
        list: null,
        id: 0,
        name: '',
        count: 0
    },
    onLoad: function(e) {
        var _mycateid = (e.id == 'undefined' || e.id == '' || e.id == null) ? e.scene : e.id;
        // console.log('-----参数');
        // console.log(_mycateid);

        let name = e.name;
        wx.setNavigationBarTitle({
            title: name
        });
        this.setData({
            id: _mycateid,
            name: e.name
        });

        wx.showLoading({
            title: '加载中...',
        });
        let that = this;
        let _shopid = app.shopid;
        let _cateid = _mycateid;
        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ shopid: _shopid, cateid: _cateid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        wx.request({
            url: app.host + '/buyerMobile/product/getProductsByCateid',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            complete: function(res) {
                // console.log(res)
                wx.hideLoading();
                if (res.data.status == 1) {
                    try {
                        let _title = res.data.content.title;
                        wx.setNavigationBarTitle({
                            title: _title
                        })
                    } catch (e) {
                        console.log(e)
                    }

                    let _list = res.data.content.lists;
                    for (let i = 0; i < _list.length; i++) {
                        let pro = _list[i];
                        let mainpic = pro.headpics.split(",");
                        mainpic = app.cdnhost + mainpic[0];
                        pro.mainpic = mainpic;
                        _list[i] = pro;
                    }
                    that.setData({
                        list: _list,
                        count: _list.length
                    });
                }

            }
        });

    },
    onShareAppMessage: function() {
        let that = this;
        let _name = that.data.name;
        let _id = that.data.id;
        return {
            title: _name,
            path: 'pages/catelist/catelist?id=' + _id + '&name=' + _name
        }
    }
})