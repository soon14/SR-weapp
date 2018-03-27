/**
 *  @author Shirui 2018/03/21
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const md5 = require('../../../utils/md5.js');
const app = getApp();
Page({
    data: {
        host: app.host,
        maxsize: 5, //图片最大上传数
        canUploadHead: true, //是否能上传
        headlist: [], //图片list
        headcount: 0, //已上传的数量
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

        // 推广费用比例
        TGindex: 0,
        TGArray: ['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%'],
        promotionPrice: '10', //推广费用比例

        saveState: 1, //保存手机权限设置 1不能保存2能保存

        publishState: 1, //发布状态 1草稿2发布

        addFormInfo: {
            schemeIntro: null, //方案简介
            product: null, //商品详情内容 type 1文字，2图片
            course: null //教程内容 type 1文字，2图片，3分割线 ，css样式信息
        },
    },
    onLoad(options) {

        app.addFormInfo = this.data.addFormInfo;

    },
    onShow() {
        console.log(app.addFormInfo)
        this.setData({
            addFormInfo: app.addFormInfo
        })
    },
    formSubmit(e) {
        console.log(e)
        /**
         * 花艺方案创建：
         * 接口URL：/centerMobile/flowerScheme/add
         * 交互类型：POST
         * 传入参数：
          {
              "schemeName":"方案名称",
              "schemeImageUrl":"/images/20170413/20170413130016797.jpg,/images/20170417/20170417170148618.jpg",
              "schemeIntro":"方案简介",
              "saveState":1, //保存手机权限设置 1不能保存2能保存
              "publishState":1, //发布状态 1草稿2发布
              "schemePrice":0, //方案价格
              "msession":"bb65090d77f9dbe13761d1965efb9fc5",
              "promotionPrice":0, //推广费用比例不低于10%,
              "product":[{"content":"商品内容","type":1}],   //商品详情内容 type 1文字，2图片
              "course":[{"content":"教程内容","type":1,"css":"教程样式"}]    //教程内容 type 1文字，2图片，3分割线 ，css样式信息
          }
         */
        let that = this;
        let value = e.detail.value; //表单信息
        let formId = e.detail.formId;
        let publishState = e.detail.target.dataset.publishstate;

        let headlist = that.data.headlist;

        // 获取图片字符串
        let schemeImageUrl = '';
        for (var i = 0; i < headlist.length; i++) {
            schemeImageUrl = schemeImageUrl + headlist[i].src + ',';
        }
        schemeImageUrl = schemeImageUrl.slice(0, -1); //出去字符串最后一个

        let addFormInfo = app.addFormInfo;

        let product = app.addFormInfo.product; //商品详情内容
        let course = app.addFormInfo.course; //教程内容 type 1文字，2图片，3分割线 ，css样式信息

        // 商品详情内容 type 1文字 转码
        for (var i = 0; i < product.length; i++) {
            if (product[i].type == 1) {
                product[i].content = encodeURIComponent(product[i].content);
            }
        }

        // 教程内容 type 1文字 转码
        for (var i = 0; i < course.length; i++) {
            if(course[i].type=1){
                course[i].content = encodeURIComponent(course[i].content);
            }
        }

        let params = {
            formId: formId,
            msession: app.msession,
            schemeName: encodeURIComponent(value.schemeName),
            schemeImageUrl: schemeImageUrl,
            schemeIntro: encodeURIComponent(addFormInfo.schemeIntro),
            saveState: value.saveState, //保存手机权限设置 1不能保存2能保存
            publishState: publishState, //发布状态 1草稿2发布
            schemePrice: value.schemePrice, //方案价格
            promotionPrice: value.promotionPrice, //推广费用比例不低于10%,
            product: product, //商品详情内容 type 1文字，2图片
            course: course //教程内容 type 1文字，2图片，3分割线 ，css样式信息
        }
        console.log(params)
        // return;
        util.ajaxRequest(
            'centerMobile/flowerScheme/add',
            params,
            function(res) {
                if (res.data.status == 1) {
                    
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        success: function() {
                            app.addFormInfo = null;
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {}
                    })
                }
            });

    },
    chooseHeadImage() {
        let that = this;
        let maxsize = that.data.maxsize; //最大上传数

        if (that.data.headcount >= maxsize) {
            wx.showModal({
                title: '提示',
                content: '最多只能上传5张',
                showCancel: false,
                success: function(res) {}
            });
            return;
        }

        that.chooseImage_upload();

    },
    //选取图片 上传 默认缩略图 原图都有
    chooseImage_upload() {

        let that = this;
        let maxsize = that.data.maxsize; //最大上传数
        wx.chooseImage({
            count: maxsize,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                // console.log(res)
                let tempFiles = res.tempFiles; // 图片的本地文件列表，每一项是一个 File 对象
                let headlist = that.data.headlist;

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

                let tempFilePaths = res.tempFilePaths; //图片路径

                let imgsize = that.data.PictureSizeLimit * 1024; // 限制图片大小 B

                let tempFilePathsTrue = []; //没有超过限制的图片数组

                let tempFilePathsFalse = []; //超过限制的图片数组

                for (let i = 0; i < tempFiles.length; i++) {

                    if (tempFiles[i].size > imgsize) {

                        tempFilePathsFalse.push(tempFilePaths[i]); //超过限制的图片数组

                    } else {

                        tempFilePathsTrue.push(tempFilePaths[i]); //没有超过限制的图片数组

                    }

                }

                let tempFilePathsTrueSize = tempFilePathsTrue.length; //没有超过限制的图片数组数量
                let tempFilePathsFalsSsize = tempFilePathsFalse.length; //超过限制的图片数组数量

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
    // HeadImage上传
    chooseHeadImageUploadFile(tempFilePaths, maxsize, size) {
        let that = this;
        let max = that.data.headcount + size;
        let oldsize = that.data.headcount;
        // console.log('oldsize',oldsize);
        let headlist = that.data.headlist;
        if (oldsize + size > maxsize) {
            max = maxsize - that.data.headcount;
            that.setData({ canUploadHead: false });
        }

        for (var i = oldsize; i < max; i++) {
            headlist[i] = { src: '/images/xuanzhepic.png', isuploading: true, progress: '10' };
            that.data.headcount++;
        }
        that.setData({ headlist: headlist });

        for (var i = oldsize; i < max; i++) {
            this.costom_upload(that, tempFilePaths, i, oldsize);
        }
    },
    //上传方法 进度条
    costom_upload(that, tempFilePaths, i, oldsize) {

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ directory: 'flower', 'index': i });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        let imglist2 = that.data.headlist;

        // 图片上传
        let uploadTask = wx.uploadFile({
            url: app.host + '/centerMobile/common/upload',
            filePath: tempFilePaths[i - oldsize],
            name: 'file',
            formData: {
                timestamp: _timestamp,
                params: _params,
                sign: _sign
            },
            success: (res) => {
                let data = JSON.parse(res.data);

                oldsize++;
                // console.log('调用上传方法成功！',oldsize);
                // 图片路径 datas

                imglist2[i] = { src: data.content.path, isuploading: false, progress: '100' };
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
        });

    },
    // 推广比例
    bindPickerTGChange(e) {
        let TGindex = e.detail.value;
        let promotionPrice = this.data.TGArray[TGindex].slice(0, -1);
        this.setData({
            TGindex: e.detail.value,
            promotionPrice: promotionPrice
        })
    },
    bindSaveState(e) {
        this.setData({
            saveState: e.detail.value ? '2' : '1'
        })
    },
    //删除图片
    // delheadpic(e) {
    //     var _src = e.target.dataset.src;
    //     var _list = this.data.headlist;
    //     for (var i = 0; i < _list.length; i++) {
    //         var src = _list[i].src;
    //         if (src == _src) {
    //             _list.splice(i, 1);
    //             break;
    //         }
    //     }
    //     this.setData({
    //         headlist: _list,
    //         headcount: _list.length
    //     });
    // },
    // chooseDetailsImage() {
    //     var that = this;
    //     var maxsize = 9;
    //     if (that.data.detailcount >= maxsize) {
    //         wx.showModal({
    //             title: '提示',
    //             content: '最多只能上传9张',
    //             showCancel: false,
    //             success: function(res) {}
    //         });
    //         return;
    //     }
    //     // console.info('count=' + that.data.detailcount);
    //     wx.chooseImage({
    //         count: maxsize,
    //         sizeType: ['original', 'compressed'],
    //         sourceType: ['album', 'camera'],
    //         success: function(res) {
    //             var tempFilePaths = res.tempFilePaths;
    //             var size = tempFilePaths.length;
    //             var imglist = imglist = that.data.detaillist;
    //             var max = that.data.detailcount + size;
    //             var oldsize = that.data.detailcount;
    //             if (that.data.detailcount + size > maxsize) {
    //                 max = maxsize - that.data.detailcount;
    //                 that.setData({ canUploadHead: false });
    //             }
    //             for (var i = oldsize; i < max; i++) {
    //                 imglist[i] = { src: '/images/pic_160.png', class: 'weui-uploader__file_status', isuploading: true };
    //                 that.data.detailcount++;
    //             }
    //             if (max > oldsize) that.setData({ detaillist: imglist });
    //             for (var i = oldsize; i < max; i++) {
    //                 var _timestamp = app.getTimeStamp();
    //                 var _params = JSON.stringify({ 'index': i });
    //                 var _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
    //                 wx.uploadFile({
    //                     url: app.host + 'shopMobile/product/uploadImage',
    //                     filePath: tempFilePaths[i - oldsize],
    //                     name: 'file',
    //                     formData: {
    //                         timestamp: _timestamp,
    //                         params: _params,
    //                         sign: _sign
    //                     },
    //                     success: function(res) {
    //                         // console.info(res.data);
    //                         var datas = res.data.split(",");
    //                         imglist[datas[1]] = { src: app.cdnhost + datas[0], class: '', isuploading: false };
    //                         that.setData({ detaillist: imglist });
    //                     }
    //                 });
    //             }

    //         }
    //     })
    // },
    onPullDownRefresh() {

        wx.stopPullDownRefresh();
    }
})