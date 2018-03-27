var md5 = require('../../../../utils/md5.js');
var utils = require('../../../../utils/util.js');
var app = getApp();
var _shopid = wx.getStorageSync('shopid');

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
        moredetail: null, //商品详情
        /*
        商品分类，改为非必选；若选择显示已建立的分类
         */
        catetitles: null,
        cates: null,
        cateIndex: 0,

        /*
        商品类型
        实物商品，原店铺商品；
        活动（新增）活动商品需要额外增加开始时间、结束时间、活动地图；
        开始时间、结束时间需要选择日期及时间；
        活动地点需要在地图上定位选择活动位置
         */
        commodityType: [
            "实物商品",
            "线下活动（课程、沙龙等）",
        ],
        CommodityTypeIndex: 0,
        /*
        实物商品规格
         */
        goods: [{ size: '', price: '', num: '', status: '1', id: '' }],
        gooditem: { size: '', price: '', num: '', status: '1', id: '' },
        /*
            配送方式
            商家配送+到店自提 0
            仅到店自提 1
            仅商家配送 2
         */
        distributionMode: [
            "支持商家配送或到店自提", //0
            "仅支持到店自提", //1
            "仅支持商家配送" //2
        ],
        onlyselftake: 0, //默认 0
        /*
        运费设置
         */
        ftitles: null,
        fIndex: 0,
        /*
        商品限购： 
        不限购、1、2、3、4、5、10
         */
        restrictions: [
            "不限购",
            "1",
            "2",
            "3",
            "4",
            "5",
            "10",
        ],
        restrictionsIndex: 0,
        /*
        是否参见店铺优惠活动：
        参加/不参加；
        参加：可以使用优惠券；
        不参加：不得使用优惠券
         */
        preferential: [
            "参加",
            "不参加",
        ],
        preferentialIndex: 0,

        /*
        时间选择
         */
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

        addressName: null, //活动地点名称

        // 底部说明
        explainTitle: "说明：",
        explainText: [
            { text: "1.最多添加5张封面图片；" },
            { text: "2.最多添加5组商品规格。" },
        ],

        maxsize: 5, //最大上传数
        canUploadHead: true,
        headlist: [],
        headcount: 0,
        flist: null,

        canUploaddetail: true,
        detaillist: [],
        detailcount: 0,

        isedit: false,
        item: null,
        /*
        PictureSizeLimit 
        上传的图片大小限制 单位 KB
         */
        PictureSizeLimit: 360,

    },
    onLoad: function(e) {
        var that = this;
        var _shopid = wx.getStorageSync('shopid');
        var _id = e.id;

        if (_id > 0) {

            wx.setNavigationBarTitle({
                title: '编辑商品'
            });

            var that = this;

            that.setData({ isedit: true });
            var params = { proid: _id };

            utils.ajaxRequest(
                'shopMobile/product/showProDetail',
                params,
                function(res) {
                    var data = res.data.content.product;
                    var _cates = res.data.content.catelist;
                    var fares = res.data.content.farelist;
                    var goods = res.data.content.product.goods;

                    var cs = [];
                    for (var i = 0; i < _cates.length; i++) {
                        cs[cs.length] = _cates[i].title;
                    }

                    var fs = [];
                    for (var i = 0; i < fares.length; i++) {
                        fs[fs.length] = fares[i].title;
                    }


                    var heads = data.headpics.split(",");
                    // console.log('heads',heads);
                    var details = [];
                    if (data.pics.trim() != '') {
                        details = data.pics.split(",")
                    }
                    var _headlist = [];
                    var _detaillist = [];

                    for (var i = 0; i < heads.length; i++) {
                        _headlist[_headlist.length] = { src: app.cdnhost + heads[i], class: '', isuploading: false };
                    }

                    for (var i = 0; i < details.length; i++) {
                        _detaillist[_detaillist.length] = { src: app.cdnhost + details[i], class: '', isuploading: false };
                    }

                    var _cateIndex = 0;
                    for (var i = 0; i < _cates.length; i++) {
                        if (_cates[i].id == data.categoryid) {
                            _cateIndex = i;
                            break;
                        }
                    }

                    var _fIndex = 0;
                    for (var i = 0; i < fares.length; i++) {
                        if (fares[i].id == data.fareid) {
                            _fIndex = i;
                            break;
                        }
                    }
                    console.log(data)
                    that.setData({
                        item: data,
                        goods: goods,
                        headcount: heads.length,
                        detailcount: details.length,
                        headlist: _headlist,
                        detaillist: _detaillist,
                        cateIndex: _cateIndex,
                        fIndex: _fIndex,
                        catetitles: cs,
                        cates: _cates,
                        ftitles: fs,
                        flist: fares,
                        CommodityTypeIndex: parseInt(data.type) - 1,
                        startTime: data.starttime,
                        endTime: data.endtime,
                        latitudeNum: data.latitude,
                        longitudeNum: data.longitude,
                        addressName: data.address,
                        moredetail: data.moredetail,
                        preferentialIndex: parseInt(data.is_useticket) - 1,
                        restrictionsIndex: parseInt(data.buylimit), //限购数量
                        onlyselftake: parseInt(data.onlyselftake), //配送方式
                    });

                    app.productInfo = [];
                    app.productInfo = data.moredetail; //商品详情

                });


        } else {
            app.productInfo = [];
            var params = { shopid: _shopid };
            utils.ajaxRequest(
                'shopMobile/shopadmin/getCategorysForAdmin',
                params,
                function(res) {
                    var _cates = res.data.content;
                    _cates.unshift({
                        id: '0',
                        title: '请选择'
                    });
                    var cs = [];
                    for (var i = 0; i < res.data.content.length; i++) {
                        cs[cs.length] = res.data.content[i].title;
                    }
                    // cs.unshift('请选择');//开头插入默认文字
                    that.setData({
                        catetitles: cs,
                        cates: _cates
                    });

                });

            var params2 = { shopid: _shopid };
            utils.ajaxRequest(
                'shopMobile/faretmpl/showFaretmplByShopid',
                params2,
                function(res) {
                    console.log('运费模板列表');
                    console.log(res);
                    var cs = [];
                    for (var i = 0; i < res.data.content.length; i++) {
                        cs[cs.length] = res.data.content[i].title;
                    }
                    that.setData({
                        ftitles: cs,
                        flist: res.data.content
                    });

                });
        }


    },
    // 地图组件
    bindPosition: function() {
        let that = this;
        wx.getLocation({
            type: 'gcj02', //gcj02返回可以用于wx.openLocation的经纬度 
            success: function(res) {
                let latitude = res.latitude; //纬度，浮点数，范围为-90~90，负数表示南纬
                let longitude = res.longitude; //经度，浮点数，范围为-180~180，负数表示西经
                let name = res.name; //当前位置名
                let address = res.address; //当前地址的详细说明
                // 打开地图选择位置。
                wx.chooseLocation({
                    atitude: latitude,
                    longitude: longitude,
                    scale: 28,
                    success: function(res2) {
                        let name2 = res2.name; //位置名
                        let address2 = res2.address; //地址的详细说明
                        console.log('----选择地址-----')
                        console.log(name2)
                        console.log(address2)
                        console.log(res)
                        console.log(res2)
                        console.log('----选择地址end-----')
                        that.setData({
                            addressName: name2,
                            latitudeNum: res2.latitude,
                            longitudeNum: res2.longitude,
                        });
                    }
                })
            }
        })
    },
    onShow: function() {
        this.setData({
            moredetail: app.productInfo //商品详情
        });
    },
    // "商品分类"
    bindCateChange: function(e) {
        this.setData({
            cateIndex: e.detail.value
        })
    },
    // "商品类型"
    bindCommodityTypePickerChange: function(e) {
        this.setData({
            CommodityTypeIndex: e.detail.value
        })
    },
    // "配送方式"
    onlyselftakeChange: function(e) {
        this.setData({
            onlyselftake: e.detail.value
        })
    },
    // "运费设置"
    bindFChange: function(e) {
        this.setData({
            fIndex: e.detail.value
        })
    },
    // "商品限购"
    bindRestrictionsChange: function(e) {
        this.setData({
            restrictionsIndex: e.detail.value
        })
    },
    // "是否参见店铺优惠活动"
    bindPreferentialChange: function(e) {
        this.setData({
            preferentialIndex: e.detail.value
        })
    },
    // 日期选择 开始
    bindStartDateChange: function(e) {
        // console.log('开始日期为', e.detail.value)
        this.setData({
            startDate: e.detail.value
        })
    },
    // 日期选择 结束
    bindEndDateChange: function(e) {
        // console.log('结束日期为', e.detail.value)
        this.setData({
            endDate: e.detail.value
        })
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
    formSubmit: function(e) {

        var that = this;

        var _title = e.detail.value.title;
        var _price = e.detail.value.price;
        var _num = e.detail.value.num;
        var _huacai = e.detail.value.huacai;
        var _linian = e.detail.value.linian;
        var _onlyselftake = parseInt(that.data.onlyselftake); //配送方式 自提 1 非自提 0 仅商家配送 2
        var address = that.data.addressName;

        var _state = e.detail.target.dataset.state; //上架状态 0上架 1下架
        var headpics = [];
        var _fareid = that.data.flist[that.data.fIndex].id;

        if (that.data.headlist != null) {
            for (var i = 0; i < that.data.headlist.length; i++) {
                headpics[headpics.length] = that.data.headlist[i].src;
            }

            let splitlength = app.cdnhost.length;
            for (var i = 0; i < headpics.length; i++) {
                headpics[i] = headpics[i].substr(splitlength);
            }

            var _headpics = headpics.join(",");
        }

        var detailpics = [];
        if (that.data.detaillist != null) {
            for (var i = 0; i < that.data.detaillist.length; i++) {
                detailpics[detailpics.length] = that.data.detaillist[i].src;
            }
        }

        var _detailpics = detailpics.join(",");
        var _shopid = wx.getStorageSync('shopid');

        if (headpics == null || headpics.length == 0) {
            wx.showModal({
                title: '提示',
                content: '商品图片没有上传哦',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        if (_title == '') {
            wx.showModal({
                title: '提示',
                content: '商品名称不能为空',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        if (that.data.cates.length == 0) {
            wx.showModal({
                title: '提示',
                content: '商品分类未添加,请先添加商品分类',
                showCancel: false,
                success: function(res) {}
            });
            return;

        }

        var _type = that.data.CommodityTypeIndex * 1 + 1;

        if (_fareid == 0 && _onlyselftake != 1 && _type == 1) {
            wx.showModal({
                title: '提示',
                content: '请选择运费设置',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        var _cateid = that.data.cates[that.data.cateIndex].id;

        var params = {
            shopid: _shopid,
            title: encodeURIComponent(_title),
            cateid: _cateid,
            headpics: _headpics,
            fareid: _fareid, //运费模版 0表示请选择
            onlyselftake: _onlyselftake, //配送方式 自提 1 非自提 0
            state: _state,
            buylimit: that.data.restrictionsIndex, //是否限购
            is_useticket: parseInt(that.data.preferentialIndex) + 1, //是否可以使用优惠券(特价)
            type: _type, //商品类型1实物,2活动
            starttime: '', //活动开始时间
            endtime: '', //活动结束时间
            latitude: that.data.latitudeNum, //微信定位纬度
            longitude: that.data.longitudeNum, //微信定位经度
            address: encodeURIComponent(address), //微信定位地址
        };

        let starttime = that.data.startTime;
        let endtime = that.data.endTime;
        let _goods = that.data.goods; //商品的规格 数量 价钱

        for (var i = 0; i < _goods.length; i++) {

            if (_goods[i].price == '') {
                wx.showModal({
                    title: '提示',
                    content: '商品价格不能为空',
                    showCancel: false,
                    success: function(res) {}
                });
                return;
            }

            if (_goods[i].num == '') {
                wx.showModal({
                    title: '提示',
                    content: '商品库存不能为空',
                    showCancel: false,
                    success: function(res) {}
                });
                return;
            }

            if (_goods[i].size == '') {
                wx.showModal({
                    title: '提示',
                    content: '商品规格不能为空',
                    showCancel: false,
                    success: function(res) {}
                });
                return;
            }

        }

        // 规格 start
        that.setData({
            ajaxgoods: _goods
        })
        let ajaxgoods = that.data.ajaxgoods;

        for (var i = 0; i < ajaxgoods.length; i++) {
            ajaxgoods[i].size = encodeURIComponent(ajaxgoods[i].size);
        }
        params.goods = ajaxgoods; //商品的规格 数量 价钱
        // 规格 end


        that.encode();//详情进行转码
        
        let new_descs = that.data.new_descs; //转码后的详情

        params.descs = new_descs; //段落详情

        if (_type == 1) {

            params.starttime = ''; //实物商品没有时间
            params.endtime = ''; //实物商品没有时间

        } else {
            //活动
            params.fareid = 0; //活动类型没有运费模板
            params.starttime = starttime.replace(/年/, '-').replace(/月/, '-').replace(/日/, '') || '';
            params.endtime = endtime.replace(/年/, '-').replace(/月/, '-').replace(/日/, '') || '';
        }

        let ajaxRequestUrl = null; //接口

        if (that.data.isedit) {
            var _id = that.data.item.id;
            params.id = _id;
            params.goods[0].id = _goods[0]['id']; //活动修改原规格id
            // console.log(params);return;
            ajaxRequestUrl = 'shopMobile/product/updatePro';
        } else {
            ajaxRequestUrl = 'shopMobile/product/addNewPro';
        }

        // console.log(params);
        // return;
        utils.ajaxRequest(
            ajaxRequestUrl,
            params,
            function(res) {

                if (res.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });

                } else {
                    if (_state == 0) {
                        // wx.redirectTo({
                        //     url: '/pages/index/products/products'
                        // })
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        // wx.redirectTo({
                        //     url: '/pages/index/products/goodsDown/goodsDown'
                        // })
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            });
    },
    // 详情进行转码
    encode:function(){
        let that=this;
        let _descs = that.data.moredetail; //详情

        let new_descs = [];

        for (var i = 0; i < _descs.length; i++) {
            new_descs[i] = Object.assign({}, _descs[i]);
        }

        for (var i = 0; i < new_descs.length; i++) {
            if (new_descs[i].type == 1) {
                new_descs[i].content = encodeURIComponent(new_descs[i].content);
            }
        }

        that.setData({
            new_descs:new_descs
        })

    },
    chooseHeadImage: function() {
        var that = this;
        var maxsize = that.data.maxsize; //最大上传数

        if (that.data.headcount >= maxsize) {
            wx.showModal({
                title: '提示',
                content: '最多只能上传5张',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        that.chooseImage_upload(maxsize);

    },

    // HeadImage上传
    chooseHeadImageUploadFile: function(tempFilePaths, maxsize, size) {
        var that = this;
        var max = that.data.headcount + size;
        var oldsize = that.data.headcount;
        // console.log('oldsize',oldsize);
        var imglist = that.data.headlist;
        if (that.data.headcount + size > maxsize) {
            max = maxsize - that.data.headcount;
            that.setData({ canUploadHead: false });
        }

        for (var i = oldsize; i < max; i++) {
            imglist[i] = { src: '/images/pic_160.png', class: 'weui-uploader__file_status', isuploading: true, progress: '10' };
            that.data.headcount++;
        }
        that.setData({ headlist: imglist });

        for (var i = oldsize; i < max; i++) {
            this.costom_upload(that, tempFilePaths, i, oldsize);
        }
    },
    //选取图片 上传 默认缩略图 原图都有
    chooseImage_upload: function(maxsize) {

        var that = this;

        wx.chooseImage({
            count: maxsize,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {

                var tempFiles = res.tempFiles; // 图片的本地文件列表，每一项是一个 File 对象
                let headlist = that.data.headlist;
                let maxsize = that.data.maxsize;

                if ((parseInt(maxsize) - headlist.length) < tempFiles.length) {
                    let synum = parseInt(maxsize) - headlist.length;
                    wx.showModal({
                        title: '提示',
                        content: '只能再传' + synum + '张图片',
                        showCancel: false,
                        success: function(res) {}
                    });
                    return;
                }

                var tempFilePaths = res.tempFilePaths; //图片路径

                var imgsize = that.data.PictureSizeLimit * 1024; // 限制图片大小 B

                var tempFilePathsTrue = []; //没有超过限制的图片数组

                var tempFilePathsFalse = []; //超过限制的图片数组

                for (let i = 0; i < tempFiles.length; i++) {

                    if (tempFiles[i].size > imgsize) {

                        tempFilePathsFalse.push(tempFilePaths[i]); //超过限制的图片数组

                    } else {

                        tempFilePathsTrue.push(tempFilePaths[i]); //没有超过限制的图片数组

                    }

                }

                var tempFilePathsTrueSize = tempFilePathsTrue.length; //没有超过限制的图片数组数量
                var tempFilePathsFalsSsize = tempFilePathsFalse.length; //超过限制的图片数组数量

                //没有超过限制的图片数组数量大于0 进行上传
                if (tempFilePathsTrueSize > 0) {
                    that.chooseHeadImageUploadFile(tempFilePathsTrue, maxsize, tempFilePathsTrueSize);
                    // console.log('小图上传成功');
                    // console.log('小图数量',tempFilePathsTrueSize);
                }

                //超过限制的图片数组数量大于0 进行上传
                if (tempFilePathsFalsSsize > 0) {
                    wx.showModal({
                        title: '提示',
                        content: '您上传的图片过大，可能会需要较长时间，是否继续？',
                        success: (res) => {
                            if (res.confirm) {
                                // 确定 进行图片上传

                                that.chooseHeadImageUploadFile(tempFilePathsFalse, maxsize, tempFilePathsFalsSsize);
                                // console.log('大图上传成功');
                                // console.log('大图数量',tempFilePathsFalsSsize);
                            } else if (res.cancel) {
                                // 取消 提供给用户处理办法
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: '建议上传时不要选择原图！',
                                    success: (res) => {}
                                })
                                return;
                            }
                        }

                    });
                }

            }

        })
    },
    //上传方法 进度条
    costom_upload: function(that, tempFilePaths, i, oldsize) {


        var _timestamp = app.getTimeStamp();
        var _params = JSON.stringify({ 'index': i });
        var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        var imglist2 = that.data.headlist;

        // 图片上传
        var uploadTask = wx.uploadFile({
            url: app.host + 'shopMobile/product/uploadImage',
            filePath: tempFilePaths[i - oldsize],
            name: 'file',
            formData: {
                timestamp: _timestamp,
                params: _params,
                sign: _sign
            },
            success: (res) => {

                oldsize++;

                // console.log('调用上传方法成功！',oldsize);
                // console.log('参数',_params);
                // console.log(res);
                // 图片路径 datas

                var datas = res.data.split(",");
                imglist2[datas[1]] = { src: app.cdnhost + datas[0], class: '', isuploading: false, progress: '100' };
                that.setData({
                    headlist: imglist2
                });

            },
            fail: (res) => {
                console.log('上传失败:', res);
            }
        });



        // 上传进度监视 进度条
        uploadTask.onProgressUpdate((res) => {

            if (res.progress > 20) {
                //每个上传图片等进度条
                imglist2[i].progress = res.progress;
                that.setData({
                    headlist: imglist2
                });
            }


            // console.log('上传进度2', res.progress);
            // console.log('已经上传的数据长度', res.totalBytesSent);
        });
        // console.log('i',i);
        // console.log('tempFilePaths.length',that.data.headcount);
        // console.log('imglist2',imglist2);

    },
    //删除图片
    delheadpic: function(e) {
        var _src = e.target.dataset.src;
        var _list = this.data.headlist;
        for (var i = 0; i < _list.length; i++) {
            var src = _list[i].src;
            if (src == _src) {
                _list.splice(i, 1);
                break;
            }
        }
        this.setData({
            headlist: _list,
            headcount: _list.length
        });
    },
    chooseDetailsImage: function() {
        var that = this;
        var maxsize = 9;
        if (that.data.detailcount >= maxsize) {
            wx.showModal({
                title: '提示',
                content: '最多只能上传9张',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }
        // console.info('count=' + that.data.detailcount);
        wx.chooseImage({
            count: maxsize,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                var size = tempFilePaths.length;
                var imglist = imglist = that.data.detaillist;
                var max = that.data.detailcount + size;
                var oldsize = that.data.detailcount;
                if (that.data.detailcount + size > maxsize) {
                    max = maxsize - that.data.detailcount;
                    that.setData({ canUploadHead: false });
                }
                for (var i = oldsize; i < max; i++) {
                    imglist[i] = { src: '/images/pic_160.png', class: 'weui-uploader__file_status', isuploading: true };
                    that.data.detailcount++;
                }
                if (max > oldsize) that.setData({ detaillist: imglist });
                for (var i = oldsize; i < max; i++) {
                    var _timestamp = app.getTimeStamp();
                    var _params = JSON.stringify({ 'index': i });
                    var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                    wx.uploadFile({
                        url: app.host + 'shopMobile/product/uploadImage',
                        filePath: tempFilePaths[i - oldsize],
                        name: 'file',
                        formData: {
                            timestamp: _timestamp,
                            params: _params,
                            sign: _sign
                        },
                        success: function(res) {
                            // console.info(res.data);
                            var datas = res.data.split(",");
                            imglist[datas[1]] = { src: app.cdnhost + datas[0], class: '', isuploading: false };
                            that.setData({ detaillist: imglist });
                        }
                    });
                }

            }
        })
    },
    deldetailpic: function(e) {
        var _src = e.target.dataset.src;
        var _list = this.data.detaillist;
        for (var i = 0; i < _list.length; i++) {
            var src = _list[i].src;
            if (src == _src) {
                _list.splice(i, 1);
                break;
            }
        }
        this.setData({
            detaillist: _list,
            detailcount: _list.length
        });
    },
    //删除段落详情
    delDesc: function() {
        var params = { descid: '' };

        utils.ajaxRequest(
            'shopMobile/product/delDesc',
            params,
            function(res) {
                if (res.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function(res) {}
                    });
                }
            });
    },
    //输入商品规格
    bindprosizeinput: function(e) {
        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.dataset.name;
        let goods = this.data.goods;

        if (name == 'size') {
            goods[index].size = e.detail.value;
        } else if (name == 'price') {
            goods[index].price = e.detail.value;
        } else if (name == 'num') {
            goods[index].num = e.detail.value;
        }

        this.setData({
            goods: goods
        })

    },
    //添加商品规格
    addprosize: function() {
        let that = this;
        let goods = that.data.goods;
        let item = that.data.gooditem;
        goods.push(item);
        that.setData({
            goods: goods,
        })
    },
    // 删除 改变现有规格的状态
    delete: function(e) {
        let that = this;
        let delete_id = e.currentTarget.dataset.id;
        let delete_index = e.currentTarget.dataset.index;
        let goods = that.data.goods;

        wx.showModal({
            title: '提示',
            content: '确定进行删除？',
            success: function(res) {
                if (res.confirm) {
                    goods[delete_index].status = '2';
                    goods[delete_index].id = delete_id || '';
                    that.setData({
                        goods: goods
                    });

                    console.log(goods)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // 删除 如果空id 删除空数组
    delete1: function(e) {
        let that = this;
        let delete_id = e.currentTarget.dataset.id;
        let delete_index = e.currentTarget.dataset.index;
        let goods = that.data.goods;

        wx.showModal({
            title: '提示',
            content: '确定进行删除？',
            success: function(res) {
                if (res.confirm) {
                    goods = that.remove(goods, delete_index);

                    that.setData({
                        goods: goods
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
    }

})