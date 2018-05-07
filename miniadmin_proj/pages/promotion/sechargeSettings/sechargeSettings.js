var md5 = require('../../../utils/md5.js');
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        num: 0,
        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1、付款金额是指客户实际付款的金额，而赠送金额则是额外增加的金额，两者相加就是客户最终所得金额；" },
            { text: "2、最多可添加6个快捷充值金额；" },
            { text: "3、限制金额是指活动期间只能充值金额，一般用于超值活动，" },
            { text: "如：充100送100，最高可充500元" },
        ],
        title: '', //主题
        promotion_id: '', //充值活动ID 没有为空
        max_money: '', //限制金额
        addColumnData: [{}], //list
        ColumnData: {}, //list data
    },
    onLoad: function(options) {
        this.getdata();
    },
    onShow: function() {

    },
    // 保存
    formSubmit: function(e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var that = this;

        let formData = e.detail.value;
        let formList = [{
            "id": formData.id0 || '',
            "money": formData.money0 || '',
            "gift_money": formData.gift_money0 || ''
        }, {
            "id": formData.id1 || '',
            "money": formData.money1 || '',
            "gift_money": formData.gift_money1 || ''
        }, {
            "id": formData.id2 || '',
            "money": formData.money2 || '',
            "gift_money": formData.gift_money2 || ''
        }, {
            "id": formData.id3 || '',
            "money": formData.money3 || '',
            "gift_money": formData.gift_money3 || ''
        }, {
            "id": formData.id4 || '',
            "money": formData.money4 || '',
            "gift_money": formData.gift_money4 || ''
        }, {
            "id": formData.id5 || '',
            "money": formData.money5 || '',
            "gift_money": formData.gift_money5 || ''
        }];

        var list = [];
        var arrylist = [];
        for (var i = 0; i < formList.length; i++) {
            if (formList[i].money) {
                arrylist = arrylist.concat(parseFloat(formList[i].money) + '');
                list = list.concat(formList[i]);
            }
        }

        // 检查是否有重复的充值金额
        if (!that.checkArry(arrylist)) {
            wx.showModal({
                title: '提示',
                content: '充值金额重复',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        var _shopid = wx.getStorageSync('shopid');
        var _msession = wx.getStorageSync('msession');
        var params = {
            msession: _msession,
            shopid: _shopid,
            title: encodeURIComponent(formData.title),
            promotion_id: formData.promotion_id,
            max_money: formData.xzje,
            list: list,
        };

        utils.ajaxRequest(
            'shopMobile/rechargeInfo/save',
            params,
            function(res) {
                if (res.data.status == 1) {
                    // 保存成功刷新数据
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {
                            wx.redirectTo({
                                url: '/pages/promotion/customerRecharge/customerRecharge'
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
    // 添加
    addColumn: function() {
        var that = this;
        let _num = that.data.addColumnData.length;

        if (_num < 6) {
            let addData = that.data.ColumnData;
            var addColumnData = that.data.addColumnData;
            addColumnData = addColumnData.concat(addData);
            that.setData({
                addColumnData: addColumnData
            })
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '最多可添加6个快捷充值金额',
                success: function(res) {}
            });
        }
    },
    // 删除
    delete: function(e) {
        var that = this;
        var recharge_info_id = e.target.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定进行删除？',
            success: function(res) {
                if (res.confirm) {

                    var _shopid = wx.getStorageSync('shopid');
                    var _msession = wx.getStorageSync('msession');
                    var params = {
                        msession: _msession,
                        shopid: _shopid,
                        recharge_info_id: recharge_info_id,
                    };

                    utils.ajaxRequest(
                        'shopMobile/rechargeInfo/delete',
                        params,
                        function(res) {
                            if (res.data.status == 1) {
                                that.getdata();
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function(res) {}
                                })
                            }
                        });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // 删除 如果空id 删除空数组
    delete1: function(e) {
        let that = this;
        let delete_index = e.currentTarget.dataset.index;
        let addColumnData = that.data.addColumnData;
        wx.showModal({
            title: '提示',
            content: '确定进行删除？',
            success: function(res) {
                if (res.confirm) {
                    addColumnData = that.remove(addColumnData, delete_index);
                    that.setData({
                        addColumnData: addColumnData
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    //删除数组 arry数组 dx对应下标 返回新数组
    remove: function(arry, dx) {
        if (isNaN(dx) || dx > arry.length) { return false; }
        for (var i = 0, n = 0; i < arry.length; i++) {
            if (arry[i] != arry[dx]) {
                arry[n++] = arry[i]
            }
        }
        arry.length -= 1;
        return arry;
    },
    // 获取初始数据
    getdata: function() {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var params = { shopid: _shopid };

        utils.ajaxRequest(
            'shopMobile/rechargeInfo/view',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        addColumnData: res.data.content.list,
                        title: res.data.content.title,
                        promotion_id: res.data.content.promotion_id,
                        max_money: res.data.content.max_money,
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
    // 判断是否有重复的
    checkArry: function(arry) {
        let newarry = arry.sort();
        // console.log(newarry);
        let satate = true;
        for (var i = 0; i < newarry.length; i++) {
            if (newarry[i] == newarry[i + 1]) {
                // console.log("数组重复内容：" + newarry[i]);
                satate = false;
            }
        }
        return satate;
    },
    bindinputmoney: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let value = e.detail.value;
        var addColumnData = that.data.addColumnData;
        addColumnData[index].money = value;

        that.setData({
            addColumnData: addColumnData
        })

    },
    bindinputgift_money: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let value = e.detail.value;
        var addColumnData = that.data.addColumnData;
        addColumnData[index].gift_money = value;

        that.setData({
            addColumnData: addColumnData
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getdata();
        wx.stopPullDownRefresh();
    },

})