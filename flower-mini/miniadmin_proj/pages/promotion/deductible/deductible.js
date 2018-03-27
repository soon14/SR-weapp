// 社交立减金
var utils = require('../../../utils/util.js');
var app = getApp();

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

        list: null, //优惠券列表

        title: '', //主题
        promotionid: null, //充值活动ID 没有为空
        sourceType: 0, //来源类型 0优惠券设置页 1预览
        disabled: false, // 默认不禁用 来源类型1禁用
        /*
        "分享数量" 
        5、8、10
         */
        numItems: [
            { num: "5", checked: true },
            { num: "8", checked: false },
            { num: "10", checked: false },
        ],
        value_checked: '5',

        time_picker_show: false,
        bindChangemove: false, //是否选择时间
        startTime: null, //开始时间
        endTime: null, //结束时间
        timetype: null,
        years: years,
        year: date.getFullYear(),
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,

        timelist: timelist,
        hourslist: hourslist,
        nowtime: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + (date.getDate()) + '日 ' + (date.getHours()) + ':00',
        value: [date.getMonth(), date.getDate() - 1, date.getHours()],

        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1.社交立减金是客户购买成功时，由系统自动推送给客户的营销功能；" },
            { text: "2.若立减金结束时间长于所选优惠券结束时间，则以优惠券结束时间为准；" },
            { text: "3.每位客户可领取的立减金数量，以优惠券设置的单人可领取数量为准。" },
        ],
    },
    onLoad: function(options) {
        // console.log(options);
        let _disabled = false;
        if (options.type == 1) {
            _disabled = true;
        }
        this.setData({
            sourceType: options.type,
            promotionid: null,
            disabled: _disabled
        });
    },
    onShow: function() {
        this.getdata();
    },
    // "分享数量"
    radioChange: function(e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value);
        this.setData({
            value_checked: e.detail.value
        });
    },
    // 优惠券
    radioCouponChange: function(e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value);
    },
    // 时间选择器显示
    time_picker_show: function(e) {
        let timetype = e.target.dataset.timetype;
        // console.log(timetype)
        let nowtime = this.data.nowtime;

        this.setData({
            time_picker_show: !this.data.time_picker_show,
            timetype: timetype,
        });

    },
    // 时间选择器隐藏
    time_picker_hide: function() {
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
    bindChange: function(e) {
        const val = e.detail.value
        let that=this;
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

        if (timetype == 'startTime') {
            that.setData({
                startTime: time
            });
        } else if (timetype == 'endTime') {
            that.setData({
                endTime: time
            });
        }
    },
    //确定返回时间
    returnTime: function() {
        this.setData({
            time_picker_show: !this.data.time_picker_show,
        });
        let timetype = this.data.timetype;
        let nowtime = this.data.nowtime;

        if (this.data.bindChangemove) {
            if (timetype == 'startTime') {
                this.setData({
                    canvas_show: 'none',
                    startTime: this.data.startTime
                });
            } else if (timetype == 'endTime') {
                this.setData({
                    canvas_show: 'none',
                    endTime: this.data.endTime
                });
            }
        } else {
            if (timetype == 'startTime') {
                this.setData({
                    canvas_show: 'none',
                    startTime: nowtime
                });
            } else if (timetype == 'endTime') {
                this.setData({
                    canvas_show: 'none',
                    endTime: nowtime
                });
            }
        }

    },
    // 保存
    bindFormSubmit: function(e) {
        let that = this;
        let value = e.detail.value;


        value.start_time = value.start_time.replace(/年/, '-').replace(/月/, '-').replace(/日/, '') || '';
        value.end_time = value.end_time.replace(/年/, '-').replace(/月/, '-').replace(/日/, '') || '';
        value.title = encodeURIComponent(value.title);

        let stime = Date.parse(new Date(value.start_time)); //开始时间
        let etime = Date.parse(new Date(value.end_time)); //结束时间
        stime = stime / 1000;
        etime = etime / 1000;

        if (stime > etime) {
            wx.showModal({
                title: '提示',
                content: '开始时间不能大于结束时间',
                showCancel: false
            });
            return;
        }

        let _promotionid = that.data.promotionid;
        let _shopid = wx.getStorageSync('shopid');
        let _msession = wx.getStorageSync('msession');
        let _timestamp = app.getTimeStamp();

        let params1 = {
            msession: _msession,
            shopid: _shopid,
        }

        Object.assign(params1, value); //合并对象

        let url = "shopMobile/shareCoupon/create"; //创建
        if (_promotionid) {
            params1.promotionid = _promotionid;
            url = 'shopMobile/shareCoupon/update'; //修改保存
        }

        if (params1.start_time == 'NaN') {
            wx.showModal({
                title: '提示',
                content: '请选择开始时间',
                showCancel: false,
                success: function(res) {}
            });
            return;
        } else if (params1.end_time == 'NaN') {
            wx.showModal({
                title: '提示',
                content: '请选择结束时间',
                showCancel: false,
                success: function(res) {}
            });
            return;
        } else if (params1.title.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请输入主题名称',
                showCancel: false,
                success: function(res) {}
            });
            return;
        } else if (params1.coupon_promotion_id == '') {
            wx.showModal({
                title: '提示',
                content: '请选择优惠券',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        let params = params1;

        utils.ajaxRequest(
            url,
            params,
            function(res) {
                if (res.data.status == 1) {

                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {
                            wx.navigateBack({
                                delta: 1
                            });
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
    // 获取可用优惠券列表
    getdata: function() {
        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _msession = wx.getStorageSync('msession');
        let params = {
            msession: _msession,
            shopid: _shopid,
        };
        utils.ajaxRequest(
            'shopMobile/shareCoupon/getShareCoupon',
            params,
            function(res) {

                if (res.data.status == 1) {

                    try {

                        that.setData({
                            value_checked: res.data.content.nowcoupon.share_num, //关联的优惠券设置的分享数量
                            nowsharecouponid: res.data.content.nowcoupon.coupon_promotion_id, //当前关联的优惠券id
                            promotionid: res.data.content.id,
                        });

                    } catch (err) {
                        console.log(err)
                    }

                    that.setData({
                        list: res.data.content.couponlist,
                        title: res.data.content.data.title,
                        startTime: res.data.content.data.st,
                        endTime: res.data.content.data.et,
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
    }

})