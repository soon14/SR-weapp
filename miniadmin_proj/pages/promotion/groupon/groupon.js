/**
 *  @author Shirui 2018/03/12
 *  37780012@qq.com
 *  拼团设置
 */
const util = require('../../../utils/util.js');
const app = getApp();

const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
const timelist = [];
const hourslist = [];
const nowyear = new Date().getFullYear(); //当前年份
for (let i = nowyear; i <= nowyear + 2; i++) {
    years.push(i); //年
}
for (let i = 1; i <= 12; i++) {
    months.push(i); //月
}
for (let i = 1; i <= 31; i++) {
    days.push(i); //日
}
for (let i = 0; i <= 23; i++) {
    hours.push(i); //时
}
for (let i = 0; i <= 59; i++) {
    minutes.push(i); //分
}

for (var i = 0; i < years.length; i++) {
    for (var j = 0; j < months.length; j++) {
        timelist.push(years[i] + '年' + months[j] + '月');
    }

}
for (var i = 0; i < hours.length; i++) {
    hourslist.push(hours[i] + ':00');
}

Page({
    data: {
        cdnhost: app.cdnhost,
        /*
        团长优惠 
        无优惠
         */
        leaderGiscounts: [
            "无奖励",
            "奖励",
        ],
        leaderGiscountsIndex: 0,
        /*
        选择规格 
         */
        chooseGoods: [],
        chooseGoodsIndex: 0,
        /*
        每人限购
         */
        limited: [
            "不限购",
            "1",
            "2",
            "3",
            "4",
            "5",
            "10"
        ],
        limitedIndex: 0,

        disabled: true,

        time_picker_show: false,
        bindChangemove: false, //是否选择时间
        start_time: '', //开始时间
        end_time: '', //结束时间
        timetype: null,
        years: years,
        year: date.getFullYear(),
        months: months,
        days: days,

        timelist: timelist,
        hourslist: hourslist,

        hours: hours,
        minutes: minutes,
        nowtime: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + (date.getDate()) + '日 ' + (date.getHours()) + ':00',
        value: [date.getMonth(), date.getDate() - 1, date.getHours()],

    },
    onLoad: function (options) {
        let that = this;
        // console.log(options);
        let groupon_id = options.groupon_id || ''; //拼团活动id

        // 清除chooseGoodsData缓存
        that.removeStorage();

        try {
            let res = wx.getSystemInfoSync();
            let formHeight = res.windowHeight - 50;
            that.setData({
                formHeight: formHeight
            })
        } catch (e) {
            // Do something when catch error
        }

        if (groupon_id.length > 0) {
            that.setData({
                groupon_id: groupon_id,
                disabled: true
            })
            that.getdata(groupon_id);
        } else {
            that.setData({
                disabled: false
            })
        }

    },
    onShow: function () {
        let that = this;
        wx.getStorage({
            key: 'chooseGoodsData',
            success: function (res) {
                let chooseGoodsData = res.data;
                let chooseGoods = [];

                for (var i = 0; i < chooseGoodsData.goods.length; i++) {
                    chooseGoods.push(chooseGoodsData.goods[i].size);
                }

                that.setData({
                    chooseGoodsData: chooseGoodsData,
                    chooseGoods: chooseGoods
                })
            }
        })
    },
    // 时间选择器显示
    time_picker_show: function (e) {
        let timetype = e.target.dataset.timetype;
        let nowtime = this.data.nowtime;
        this.setData({
            time_picker_show: !this.data.time_picker_show,
            timetype: timetype,
        });

    },
    // 时间选择器隐藏
    time_picker_hide: function () {
        this.setData({
            time_picker_show: false
        });
    },
    // 闰年
    isLeapYear(y) {
        let isLeapYear = false;
        if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) {
            isLeapYear = true;
        }
        return isLeapYear;
    },
    //天数设置
    getDaysList(maxday) {
        let max = 31;

        if (maxday > 0) {
            max = maxday;
        }

        let days = [];
        for (let i = 1; i <= max; i++) {
            days.push(i); //时
        }

        this.setData({
            days: days
        })
    },
    // 日期时间改变
    bindChange: function (e) {
        const val = e.detail.value
        let that = this;
        let yearmonth = that.data.timelist[val[0]];
        let year = yearmonth.split('年')[0];
        let month = yearmonth.split('年')[1].split('月')[0];

        if (month == 2) {

            if (that.isLeapYear(year)) {
                that.getDaysList(29);
            } else {
                that.getDaysList(28);
            }

        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            that.getDaysList(30);
        } else {
            that.getDaysList(31);
        }

        that.setData({
            bindChangemove: true,
            yearmonth: that.data.timelist[val[0]],
            day: that.data.days[val[1]],
            hour: that.data.hourslist[val[2]],
        })
        let time = that.data.yearmonth + that.data.day + '日 ' + that.data.hour;

        let timetype = that.data.timetype;
        console.log(time)

        if (timetype == 'start_time') {
            that.setData({
                start_time: time
            });
            console.log(that.data.start_time)
        }
        if (timetype == 'end_time') {
            that.setData({
                end_time: time
            });
            console.log(that.data.end_time)
        }
    },
    //确定返回时间
    returnTime: function () {
        this.setData({
            time_picker_show: !this.data.time_picker_show,
        });
        let timetype = this.data.timetype;
        let nowtime = this.data.nowtime;

        if (this.data.bindChangemove) {
            if (timetype == 'start_time') {
                this.setData({
                    canvas_show: 'none',
                    start_time: this.data.start_time
                });
            } else if (timetype == 'end_time') {
                this.setData({
                    canvas_show: 'none',
                    end_time: this.data.end_time
                });
            }
        } else {
            if (timetype == 'start_time') {
                this.setData({
                    canvas_show: 'none',
                    start_time: nowtime
                });
            } else if (timetype == 'end_time') {
                this.setData({
                    canvas_show: 'none',
                    end_time: nowtime
                });
            }
        }

    },
    // 团长优惠
    leaderGiscountsChange: function (e) {
        this.setData({
            leaderGiscountsIndex: e.detail.value
        })
    },
    // 选规格
    chooseGoodsChange: function (e) {
        this.setData({
            chooseGoodsIndex: e.detail.value
        })
    },
    // 每人限购
    limitedChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            limitedIndex: e.detail.value
        })
    },
    // 保存
    bindFormSubmit: function (e) {
        /**
         * 拼团活动设置：
         * 接口URL：/shopMobile/groupSet/addGroupSet
         * 交互类型：POST
         * 传入参数：{
                title:"示例商品",//要转码
                shopid:204,
                goods_id:2953,//规格商品id
                product_id:2953,//产品id
                max_num:3,//成团人数
                limit:1,//每人限购数量
                price:5.00,//拼团价
                leader_price:2.00//团长优惠
                start_time:123123123323,//开始时间,时间戳
                end_time:12123232123,//结束时间,时间戳
                status:1,//保存后的状态,1生效,2失效
            }
         */
        let that = this;
        let state = e.detail.target.dataset.state;
        let params = e.detail.value;
        let _title = params.title || '';
        let _max_num = params.max_num || '';
        let _price = params.price || '';
        let _leader_price = params.leader_price || 0;
        let _start_time = that.data.start_time.replace(/年/, '/').replace(/月/, '/').replace(/日/, '') || '';
        let _end_time = that.data.end_time.replace(/年/, '/').replace(/月/, '/').replace(/日/, '') || '';
        let stime = Date.parse(new Date(_start_time)); //开始时间
        let etime = Date.parse(new Date(_end_time)); //结束时间
        stime = stime / 1000;
        etime = etime / 1000;

        if (stime > etime) {
            wx.showModal({
                title: '提示',
                content: '结束时间不得早于开始时间',
                showCancel: false
            });
            return;
        } else if(stime == etime){
            wx.showModal({
                title: '提示',
                content: '结束时间应该在当前时间30分钟之后',
                showCancel: false
            });
            return;
        }
        if (_start_time.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请选择开始时间',
                showCancel: false,
                success: function (res) {}
            });
            return;
        } else if (_end_time.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请选择结束时间',
                showCancel: false,
                success: function (res) {}
            });
            return;
        } else if (_title.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请输入主题名称',
                showCancel: false,
                success: function (res) {}
            });
            return;
        } else if (!that.data.chooseGoodsData) {
            wx.showModal({
                title: '提示',
                content: '请选择商品',
                showCancel: false,
                success: function (res) {}
            });
            return;
        } else if (that.data.chooseGoodsData && that.data.leaderGiscountsIndex == 1 && _leader_price.length == '') {
            wx.showModal({
                title: '提示',
                content: '请输入团长优惠',
                showCancel: false,
                success: function (res) {}
            });
            return;
        } else if (parseInt(_max_num) < 2) {
            wx.showModal({
                title: '提示',
                content: '成团人数不得少于2人',
                showCancel: false,
                success: function (res) {
                }
            });
            return;
        } else if (_price.length < 1) {
            wx.showModal({
                title: '提示',
                content: '拼团价',
                showCancel: false,
                success: function (res) {}
            });
            return;
        }
        console.log('3333333',_max_num)
        
        let _shopid = wx.getStorageSync('shopid');

        params.formid = e.detail.formId;
        params.title = encodeURIComponent(_title);
        params.shopid = _shopid;
        params.product_id = that.data.chooseGoodsData.id;
        params.start_time = stime;
        params.end_time = etime;
        params.status = state; //保存后的状态,1生效,2失效

        util.ajaxRequest(
            'shopMobile/groupSet/addGroupSet',
            params,
            function (res) {
                if (res.data.status == 1) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {
                            // 清除chooseGoodsData缓存
                            that.removeStorage();

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
                        success: function (res) {}
                    });
                }
            });

    },
    // 失效
    closeGroup(e) {

        let that = this;

        let params = {
            id: that.data.groupon_id
        };

        util.ajaxRequest(
            'shopMobile/groupSet/closeGroup',
            params,
            function (res) {
                if (res.data.status == 1) {

                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {
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
                        success: function (res) {}
                    });
                }
            });
    },
    // 选择商品
    chooseGrouponGoods: function () {
        wx.navigateTo({
            url: '/pages/promotion/groupon/chooseGrouponGoods/chooseGrouponGoods'
        })
    },
    // 获取初始数据
    getdata: function (id) {
        /**
         * 当前店铺拼团活动展示
         * 接口URL：/shopMobile/groupSet/showLastOne
         * 交互类型：POST
         * 传入参数：
         * {
                shopid:204,
                id:1
            }
         */
        let that = this;
        let _shopid = wx.getStorageSync('shopid');

        let params = {
            shopid: _shopid,
            id: id
        };

        util.ajaxRequest(
            'shopMobile/groupSet/showLastOne',
            params,
            function (res) {
                if (res.data.status == 1) {

                    let list = res.data.content;
                    let leader_price = list.leader_price;
                    let leaderGiscountsIndex = that.data.leaderGiscountsIndex;

                    if (parseFloat(leader_price) > 0) {
                        leaderGiscountsIndex = 1;
                    }

                    that.setData({
                        list: list,
                        leaderGiscountsIndex: leaderGiscountsIndex
                    });

                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {}
                    });
                }
            });
    },
    goback: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    removeStorage: function () {
        // 清除chooseGoodsData缓存
        wx.removeStorage({
            key: 'chooseGoodsData',
            success: function (res) {
                // console.log(res.data)
            }
        })
    }

})