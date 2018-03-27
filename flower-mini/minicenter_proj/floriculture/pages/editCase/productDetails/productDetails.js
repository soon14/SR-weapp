/**
 *  @author Shirui 2018/03/21
 *  37780012@qq.com
 */
const md5 = require('../../../../utils/md5.js');
const app = getApp();
Page({

    data: {
        host: app.cdnhost,
        uploadImgShow: null,

        formarry: [],

        fora: { id: '', type: '', content: null },

        /*
        PictureSizeLimit 
        上传的图片大小限制 单位 KB
         */
        PictureSizeLimit: 360,

    },
    onLoad: function() {

        if (app.addFormInfo.product) {
            this.setData({
                formarry: app.addFormInfo.product
            })
        }

    },
    formSubmit: function(e) {

        let product = { product: this.data.formarry };

        app.addFormInfo = Object.assign(app.addFormInfo, product);

        wx.navigateBack({
            delta: 1
        });

    },
    bindtextareainput: function(e) {
        let index = e.target.dataset.index;
        let detail = e.detail.value;
        let formarry = this.data.formarry;
        // console.log(formarry)
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
        for (let i = 0; i < formarry.length; i++) {
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
        let that = this;
        let index = e.target.dataset.index;
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
        let that = this;
        let index = e.target.dataset.index;
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
        let that = this;
        let index = e.target.dataset.index;
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
        for (let i = 0, n = 0; i < arry.length; i++) {
            if (arry[i] != arry[index]) {
                arry[n++] = arry[i]
            }
        }
        arry.length -= 1
    },
    chooseImage: function(e) {
        // console.log(e)
        let imgindex = e.target.dataset.index;
        let that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths[0];
                let _timestamp = app.getTimeStamp();
                let _params = JSON.stringify({ index: '0' });
                let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
                // 图片上传
                let uploadTask = wx.uploadFile({
                    url: app.host + 'shopMobile/product/newUploadImg',
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

            }
        })
    },

})