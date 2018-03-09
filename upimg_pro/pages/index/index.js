/**
 *  @author Shirui 2018/09/09
 *  37780012@qq.com
 */
//index.js
const config = require('../../config.js');
const util = require('../../utils/util.js');
Page({

    data: {
        host: config.host,
        uploadImgShow: null,

        formarry: [],

        fora: { id: '', type: '', content: null },

        /*
        PictureSizeLimit 
        上传的图片大小限制 单位 KB
         */
        PictureSizeLimit: 360,

    },
    onLoad: function(e) {
        var that = this;
        // if (app.productInfo) {
        //     that.setData({
        //         formarry: app.productInfo
        //     })
        // }
    },
    formSubmit: function(e) {

        let formarry = this.data.formarry;
        // app.productInfo = formarry;

        // wx.navigateBack({
        //     delta: 1
        // });

    },
    bindtextareainput: function(e) {
        let index = e.target.dataset.index;
        let detail = e.detail.value;
        let formarry = this.data.formarry;
        console.log(formarry)
        formarry[index].content = detail;
    },
    // 添加文字
    addText: function() {
        let formarry = this.data.formarry;
        let fora = this.data.fora;
        fora.type = '1';
        formarry.push(fora);
        this.setData({
            formarry: formarry,
        })
        // console.log(formarry);
    },
    // 添加图片
    addImage: function() {
        let formarry = this.data.formarry;
        let fora = this.data.fora;
        fora.type = '2';
        formarry.push(fora);
        this.setData({
            formarry: formarry,
        })

        let type2 = [];
        for (var i = 0; i < formarry.length; i++) {
            if (formarry[i].type = "2") {
                type2.push(formarry[i]);
            }
        }

        if (type2.length > 9) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '最多可添加9个',
                success: function(res) {}
            });
        }

    },
    // 删除
    delete: function(e) {
        var that = this;
        var index = e.target.dataset.index;
        wx.showModal({
            title: '提示',
            content: '确定进行删除？',
            success: function(res) {
                if (res.confirm) {
                    let _formarry = that.data.formarry;
                    // console.log(_formarry)
                    that.remove(_formarry, index);
                    that.setData({
                        formarry: _formarry
                    });
                    // console.log(_formarry)

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // up
    goUp: function(e) {
        var that = this;
        var index = e.target.dataset.index;
        let _formarry = that.data.formarry;
        let newarry = that.upRecord(_formarry, index);
        // console.log(newarry);
        that.setData({
            formarry: newarry
        });
        // console.log(_formarry)

    },
    // down
    goDown: function(e) {
        var that = this;
        var index = e.target.dataset.index;
        let _formarry = that.data.formarry;
        let newarry = that.downRecord(_formarry, index);
        // console.log(newarry);
        that.setData({
            formarry: newarry
        });

    },
    // 交换数组元素
    swapItems: function(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },

    // 上移
    upRecord: function(arr, $index) {
        if ($index == 0) {
            return;
        }
        return this.swapItems(arr, $index, $index - 1);
    },

    // 下移
    downRecord: function(arr, $index) {
        if ($index == arr.length - 1) {
            return;
        }
        return this.swapItems(arr, $index, $index + 1);
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
    },
    chooseImage: function(e) {
        // console.log(e)
        let imgindex = e.target.dataset.index;
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                var _timestamp = util.getTimeStamp();
                var _params = JSON.stringify({ index: '0' });
                var _sign = util.md5.hex_md5(_timestamp + _params + config.shopkey);
                // 图片上传
                var uploadTask = wx.uploadFile({
                    url: that.data.host + 'shopMobile/product/newUploadImg',
                    filePath: tempFilePaths,
                    name: 'file',
                    formData: {
                        timestamp: _timestamp,
                        params: _params,
                        sign: _sign
                    },
                    success: (res) => {
                        console.log('调用上传方法成功！', res);

                        let formarry = that.data.formarry;
                        formarry[imgindex].content = res.data;

                        that.setData({
                            formarry: formarry,
                            uploadImgShow: res.data,
                        })
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success',
                            duration: 1000
                        })
                    },
                    fail: (res) => {
                        console.log('上传失败:', res);
                    }
                });
                // 上传进度监视 进度条
                // uploadTask.onProgressUpdate((res) => {
                //     let formarry=that.data.formarry;
                //     formarry[imgindex].progress=res.progress;
                //     that.setData({
                //         formarry: formarry
                //     });
                // })
            }
        })
    },

})