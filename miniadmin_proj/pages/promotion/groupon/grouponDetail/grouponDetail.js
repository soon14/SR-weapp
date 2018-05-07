/**
 *  @author Shirui 2018/03/15
 *  37780012@qq.com
 *  拼团订单
 */
const util = require('../../../../utils/util.js');
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        orderid: null,

        list: null,

        status: 1,

        productId:'',

    },
    onLoad: function(options) {
        // console.log(options)
        this.setData({
            orderid: options.orderid
        })

    },
    onShow() {
        this.getdata();
    },
    // 获取初始数据
    getdata: function() {
        /**
         * 单个拼团订单信息：
         * 接口URL：/shopMobile/orderManage/getOneGroupInfo
         * 交互类型：POST
         * 传入参数：
            {
                orderid:12062,//订单id
            }
         */
        let that = this;
        let _orderid = that.data.orderid;
        let params = {
            orderid: _orderid,
        };

        util.ajaxRequest(
            'shopMobile/orderManage/getOneGroupInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    let _list = res.data.content;
                    let memberList = _list.member.list;
                    memberList.map(function(i){
                        if(i.note == '无') {
                            i.note = ''
                        }
                    })
                    let productId = res.data.content.group.product_id
                    that.setData({
                        list: _list,
                        status: res.data.content.group.status, //拼团状态
                        productId: productId
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
    sendGoods: function() {
        let orderid = this.data.orderid;
        wx.navigateTo({
            url: '/pages/index/orderManagement/sendgoods/sendgoods?id=' + orderid
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