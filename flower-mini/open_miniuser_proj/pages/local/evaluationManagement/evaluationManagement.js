/**
 *  @author Shirui 2018/01/23
 *  37780012@qq.com
 */
// 评价管理
const md5 = require('../../../utils/md5.js');
//获取应用实例
const app = getApp();
Page({
    data: {
        cdnhost: app.cdnhost,

        placeholder: "请填写您的评论...",

        txtcon: null, //评论内容

        maxcount: 3, //最大上传图片数

        imgs: [],
        imgcolume: {
            src: '',
            progress: 0
        },
    },
    onLoad: function() {

    },
    // 输入
    bindinputextareat: function(e) {
        let txtcon = e.detail.value;
        if (txtcon.length >= 500) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '评价字数限制在500字以内',
                success: function(res) {}
            })
            return;
        }
        this.setData({
            txtcon: txtcon
        })
    },
    chooseImage: function() {
        let that = this;
        let imgs = that.data.imgs;
        let maxcount = that.data.maxcount;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                console.log(res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;

                if (imgs.length + tempFilePaths.length > maxcount) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '最多可传3张图片',
                        success: function(res) {}
                    })
                    return;
                }

                for (var i = 0; i < tempFilePaths.length; i++) {
                    that.uploadFile(tempFilePaths[i]);
                }
            }
        })
    },
    // 上传
    uploadFile: function(tempFilePath) {
        let that = this;
        let imgs = that.data.imgs;
        let imgcolume = that.data.imgcolume;
        let index = imgs.length; //当前imgs数组下标

        imgs.push(imgcolume);

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({ shopid: app.shopid });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);
        // 图片上传
        wx.showLoading({
            title: '上传中',
        })
        let uploadTask = wx.uploadFile({
            url: app.host + '/buyerMobile/comments/UploadCommentImg',
            filePath: tempFilePath,
            name: 'file',
            formData: {
                timestamp: _timestamp,
                params: _params,
                sign: _sign
            },
            success: (res) => {
                console.log('调用上传方法成功！', res);
                wx.hideLoading()

                imgs[index].src = res.data;

                that.setData({
                    imgs: imgs,
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

        uploadTask.onProgressUpdate((res2) => {
            // console.log('上传进度', res2.progress)
            imgs[index].progress = res2.progress;

            that.setData({
                imgs: imgs,
            })

        })
        console.log('index:', index)
        console.log(imgs)
    },
    // 删除图片
    delimg: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let imgs = that.data.imgs;

        wx.showModal({
            title: '提示',
            content: '确定删除该图片？',
            success: function(res) {
                if (res.confirm) {
                    that.setData({
                        imgs: that.remove(imgs, index)
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    //删除数组 arry数组 dx对应下标 返回新数组
    remove: function(arry, dx) {
        if (isNaN(dx) || dx > arry.length) { return false; }
        for (let i = 0, n = 0; i < arry.length; i++) {
            if (arry[i] != arry[dx]) {
                arry[n++] = arry[i]
            }
        }
        arry.length -= 1;
        return arry;
    },
    // 保存
    save: function() {

        let that = this;
        let txtcon = that.data.txtcon;

        if (!txtcon) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请添加评论',
                success: function(res) {}
            })
            return;
        }

        let _openid = wx.getStorageSync('openid');
        let imgs = that.data.imgs;

        let _timestamp = app.getTimeStamp();
        let _params = JSON.stringify({
            shopid: app.shopid,
            openid: _openid,
            txtcon: encodeURIComponent(txtcon),
            imgs: imgs
        });
        let _sign = md5.hex_md5(_timestamp + _params + app.shopkey);

        wx.request({
            url: app.host + '/buyerMobile/comments/addComment',
            data: { shopid: app.shopid, timestamp: _timestamp, params: _params, sign: _sign },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
                // console.log(res)
                if (res.data.suc == 1) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.msg,
                        success: function(res) {
                            // wx.navigateBack({
                            //     delta: 1
                            // })
                            wx.switchTab({
                                url: '/pages/local/local'
                            })
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
            }
        });
    },
})