var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        fareid: '', //模版ID
        title: '', //主题

        lists: [{}], //list
        ColumnData: {} //list data
    },
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            fareid: options.id || '',
            type: options.type
        });
        if (options.type == 'edit') {
            this.getdata();
        }
    },
    // 获取初始数据
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _fareid = that.data.fareid;
        let params = { shopid: _shopid, fareid: _fareid };
        /*
        shopMobile/faretmpl/get
        获取单个运费模板,
        参数shopid,fareid
         */
        utils.ajaxRequest(
            'shopMobile/faretmpl/showFaretmpl',
            params,
            function(res) {
                console.log('-----------------');
                if (res.data.status == 1) {
                    that.setData({
                        title: res.data.content.title,
                        fareid: res.data.content.id,
                        lists: res.data.content.list
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            });
    },
    // 保存
    formSubmit: function(e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value)
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let title = that.data.title;
        let lists = that.data.lists;

        let params = {
            shopid: _shopid,
            type: '2',
            title: encodeURIComponent(title),
            data: lists,
            id: that.data.fareid
        }

        utils.ajaxRequest(
            'shopMobile/faretmpl/addFaretmplByDistance',
            params,
            function(res) {
                if (res.data.status == 1) {
                    // 保存成功刷新数据
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
    },
    //输入title
    bindtitleInput: function(e) {
        this.setData({
            title: e.detail.value
        });
    },
    //输入
    bindKeymoneyInput: function(e) {
        // console.log(e)
        let that = this;
        let _fareid = that.data.fareid; //当前input的fareid
        let value = e.detail.value; //当前输入的内容
        let index = e.currentTarget.dataset.index; //当前input的index
        let lists = that.data.lists;
        lists[index].fareid = _fareid || '';
        lists[index].money = value;

        that.setData({
            lists: lists
        });
    },
    bindKeydistanceInput: function(e) {
        // console.log(e)
        let that = this;
        let _fareid = that.data.fareid; //当前input的fareid
        let value = e.detail.value; //当前输入的内容
        let index = e.currentTarget.dataset.index; //当前input的index
        let lists = that.data.lists;

        if (parseFloat(value) > 10) {
            value = '10';
            wx.showModal({
                title: '提示',
                content: '按配送范围计费仅支持10km以内',
                showCancel: false,
                success: function(res) {}
            });
        }

        lists[index].fareid = _fareid || '';
        lists[index].distance = value;
        that.setData({
            lists: lists
        });
    },
    // 添加
    addColumn: function() {
        let that = this;

        let addData = that.data.ColumnData;

        let lists = that.data.lists;
        lists = lists.concat(addData);

        that.setData({
            lists: lists
        })
        // console.log(lists)
    },
    // 删除
    delete: function(e) {
        var that = this;
        var index = e.target.dataset.index;
        // console.log(e)
        // console.log(index)
        wx.showModal({
            title: '提示',
            content: '确定进行删除？',
            success: function(res) {
                if (res.confirm) {
                    let _lists = that.data.lists;
                    console.log(_lists)
                    that.remove(_lists, index);
                    that.setData({
                        lists: _lists
                    });
                    console.log(_lists)

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    /*
    删除数组中的特定下标元素
    目标数组 arry  目标下标 index
     */
    remove: function(arry, index) {
        if (isNaN(index) || index > arry.length) { return false; }
        for (var i = 0, n = 0; i < arry.length; i++) {
            if (arry[i] != arry[index]) {
                arry[n++] = arry[i]
            }
        }
        arry.length -= 1
    }

})