// 优惠券
var md5 = require('../../../utils/md5.js');
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
        title: '', //主题
        promotion_id: '', //充值活动ID 没有为空
        sourceType: 0, //来源类型 0优惠券设置页 1预览
        disabled: false, // 默认不禁用 来源类型1禁用
        /*
        每人限领 
        不限购、1、2、3、4、5、10
         */
        limitCollar: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "10",
        ],
        limitCollarIndex: 0,
        max_limit: 1,

        yhmzValue: '',

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

        //使用说明
        remark: '不可与其他优惠一起使用，不可提现，最终解释权归本店所有',

        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1.优惠券不可抵扣运费；" },
            { text: "2.除特价商品外都可使用优惠券，请慎重设置；" },
            { text: "3.优惠券一旦保存不支持修改。" },
        ],
    },
    onLoad: function(options) {
        // console.log(options);

        let _disabled = false;
        if (options.type == 1) {
            _disabled = true;
            this.getdata(options.promotion_id);
        }
        this.setData({
            sourceType: options.type,
            promotion_id: options.promotion_id,
            disabled: _disabled,
        });
    },
    onShow: function() {
        let _shopid = wx.getStorageSync('shopid');
        let _msession = app.msession || wx.getStorageSync('msession');
        // console.log(_msession);
        this.setData({
            shopid: _shopid,
            msession: _msession,
        });
    },
    // 时间选择器显示
    time_picker_show: function(e) {
        let timetype = e.target.dataset.timetype;
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

        if (timetype == 'start_time') {
            that.setData({
                start_time: time
            });
        } else if (timetype == 'end_time') {
            that.setData({
                end_time: time
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
    // title
    bindTitleInput: function(e) {
        this.setData({
            title: e.detail.value
        });
    },
    // value
    bindValueInput: function(e) {
        this.setData({
            yhmzValue: e.detail.value
        });
    },
    // min_consumption
    bindMinConsumptionInput: function(e) {
        this.setData({
            min_consumption: e.detail.value
        });
    },
    // remark
    bindRemarkBlur: function(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    // "每人限领"
    bindLimitCollarChange: function(e) {
        this.setData({
            limitCollarIndex: e.detail.value,
            max_limit: this.data.limitCollar[e.detail.value],
        })
    },
    // 保存
    bindFormSubmit: function(e) {
        let that = this;
        let _title = encodeURIComponent(that.data.title) || '';
        let _start_time = that.data.start_time.replace(/年/, '-').replace(/月/, '-').replace(/日/, '') || '';
        let _end_time = that.data.end_time.replace(/年/, '-').replace(/月/, '-').replace(/日/, '') || '';
        let _max_limit = that.data.max_limit || '';
        let _min_consumption = that.data.min_consumption || '0';
        let _value = that.data.yhmzValue || '';
        let _remark = encodeURIComponent(that.data.remark);

        let stime = Date.parse(new Date(_start_time)); //开始时间
        let etime = Date.parse(new Date(_end_time)); //结束时间
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


        if (_start_time.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请选择开始时间',
                showCancel: false,
                success: function(res) {}
            });
            return;
        } else if (_end_time.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请选择结束时间',
                showCancel: false,
                success: function(res) {}
            });
            return;
        } else if (_title.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请输入主题名称',
                showCancel: false,
                success: function(res) {}
            });
            return;
        } else if (_value.length < 1) {
            wx.showModal({
                title: '提示',
                content: '请输入优惠金额',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        let _shopid = wx.getStorageSync('shopid');
        let _msession = wx.getStorageSync('msession');

        let params = {
            msession: _msession,
            shopid: _shopid,
            title: _title,
            start_time: _start_time,
            end_time: _end_time,
            max_limit: _max_limit,
            min_consumption: _min_consumption || '0',
            value: _value,
            remark: _remark,
        }
        // console.log(params);return;
        utils.ajaxRequest(
            'shopMobile/coupon/create',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        promotion_id: res.data.content.promotion_id
                    });
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
    // 获取单个优惠券信息
    getdata: function(promotion_id) {

        let that = this;
        let _shopid = wx.getStorageSync('shopid');
        let _msession = wx.getStorageSync('msession');
        let params = {
            msession: _msession,
            shopid: _shopid,
            promotion_id: promotion_id,
        };

        utils.ajaxRequest(
            'shopMobile/coupon/getCouponInfo',
            params,
            function(res) {
                if (res.data.status == 1) {
                    that.setData({
                        title: res.data.content.title,
                        promotion_id: res.data.content.id,
                        yhmzValue: res.data.content.value,
                        max_limit: res.data.content.max_limit,
                        start_time: res.data.content.start_time,
                        end_time: res.data.content.end_time,
                        remark: res.data.content.remark,
                        max_money: res.data.content.max_money,
                        min_consumption: res.data.content.min_consumption,
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
    // 使优惠券失效
    disableCoupon: function() {
        let that = this;

        wx.showModal({
            title: '提示',
            content: '确定使优惠券失效？',
            success: function(res) {
                if (res.confirm) {

                    let _shopid = wx.getStorageSync('shopid');
                    let _msession = wx.getStorageSync('msession');
                    let promotion_id = that.data.promotion_id;

                    let params = {
                        msession: _msession,
                        shopid: _shopid,
                        promotion_id: promotion_id,
                    };
                    utils.ajaxRequest(
                        'shopMobile/coupon/disableCoupon',
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

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });

    },
    // 生成优惠券海报
    createImage: function(e) {
        let that = this;
        // let createImageUrl = 'https://ilearnmore.net/shopMobile/coupon/createImage';
        let createImageUrl = app.host + 'shopMobile/orderCrontab/createImage';
        let _shopid = wx.getStorageSync('shopid');
        let _msession = wx.getStorageSync('msession');
        let promotion_id = that.data.promotion_id;
        createImageUrl = createImageUrl + '/shopid/' + _shopid + '/promotion_id/' + promotion_id;
        console.log(createImageUrl);
        wx.previewImage({
            current: createImageUrl, // 当前显示图片的http链接   
            urls: createImageUrl.split(',') // 需要预览的图片http链接列表   
        })
    },

})