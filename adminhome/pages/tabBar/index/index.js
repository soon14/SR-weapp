//index.js
const config = require('../../../config.js');
const util = require('../../../utils/util.js');
const app = getApp()
Page({
    data: {
        userInfo: {},
        downprogress: 0, //文件下载进度
        savedFilePath: null, //本地下载文件路径
        downprogressshow: false,
    },
    onLoad: function(options) {
        let that = this;
        that.getUserInfo();
        console.log(that.data.userInfo)
        wx.getSavedFileList({
            success: function(res) {
                console.log(res.fileList)
                if (res.fileList.length > 0) {
                    that.setData({
                        savedFilePath: res.fileList[0]
                    })
                }
            }
        })
    },
    // 获取用户信息
    getUserInfo: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
            })
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                    })
                }
            })
        }
    },
    getPhoneNumber: function(e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
    },
    //乐墨学堂
    bindlemoxuetang: function() {
        //打开乐墨学堂小程序
        wx.navigateToMiniProgram({
            appId: config.lmxtAppId,
            path: '', //打开的页面路径，如果为空则打开首页
            extraData: {
                // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
            },
            success(res) {
                console.log(res)
                // 打开成功
            },
            fail(res) {
                //接口调用失败的回调函数
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.errMsg,
                    success: function(res) {}
                })

            }
        })
    },
    //乐墨花时光
    bindlemohuashiguang: function() {
        //打开乐墨花时光小程序
        wx.navigateToMiniProgram({
            appId: config.miniadminAppId,
            path: '', //打开的页面路径，如果为空则打开首页
            extraData: {
                // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
            },
            success(res) {
                console.log(res)
                // 打开成功
            },
            fail(res) {
                //接口调用失败的回调函数
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.errMsg,
                    success: function(res) {}
                })

            }
        })
    },
    downloadFile: function() {
        let that = this;

        wx.showLoading({
            title: '下载中...'
        })
        that.setData({
            downprogressshow: true
        })

        const downloadTask = wx.downloadFile({
            url: app.host + 'download/course.pdf',
            success: function(res) {
                let filePath = res.tempFilePath; //临时下载路径
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    // 保存下载文档
                    wx.saveFile({
                        tempFilePath: filePath,
                        success: function(res) {
                            wx.hideLoading();
                            let savedFilePath = res.savedFilePath; //保存的本地文件路径
                            console.log(savedFilePath)
                            that.setData({
                                savedFilePath: savedFilePath,
                                downprogressshow: false
                            })

                            wx.showModal({
                                title: '提示',
                                content: '下载完成是否打开',
                                success: function(res) {
                                    if (res.confirm) {
                                        //打开下载文档
                                        wx.openDocument({
                                            filePath: savedFilePath,
                                            success: function(res) {
                                                console.log('打开文档成功')
                                            }
                                        })
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '下载失败，请稍后再试',
                        success: function(res) {}
                    })
                }

            }
        })

        downloadTask.onProgressUpdate((res) => {
            if (res.progress == 100) {
                // 手机震动15ms
                wx.vibrateShort();
            }
            that.setData({
                downprogress: res.progress,
            })
            // console.log('下载进度', res.progress)
            // console.log('已经下载的数据长度', res.totalBytesWritten)
            // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })
    },
    //打开文档
    openDocument: function() {
        let savedFilePath = this.data.savedFilePath;
        wx.openDocument({
            filePath: savedFilePath,
            success: function(res) {
                console.log('打开文档成功')
            }
        })
    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    }
})