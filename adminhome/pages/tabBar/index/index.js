/**
 *  @author Shirui 2018/02/01
 *  37780012@qq.com
 */
//index.js
const config = require('../../../config.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        userInfo: null,
        telphone: '',
        userName: '',
        faceurl: '',
        downprogress: 0, //文件下载进度
        savedFilePath: null, //本地下载文件路径
        downprogressshow: false, //显示进度条

        pdfUrl: app.host + 'download/course.pdf', //文档下载
    },
    onLoad: function(options) {

        let that = this;

        that.getSavedFileList();
        that.getUserInfo();

    },
    onShow: function() {},
    //获取本地下载的文档
    getSavedFileList: function() {
        let that = this;

        wx.getSavedFileList({
            success: function(res) {
                // console.log(res.fileList)
                if (res.fileList.length > 0) {
                    that.setData({
                        savedFilePath: res.fileList[0].filePath
                    })
                }
            }
        })
    },
    // 获取用户信息
    getUserInfo: function() {
        let that = this;
        console.log('getUserInfo:', app.globalData.userInfo);

        if (app.globalData.userInfo) {

            that.setData({
                // userInfo: app.globalData.userInfo,
                telphone: app.globalData.userInfo.telphone,
                userName: app.globalData.userInfo.name,
                faceurl: app.globalData.userInfo.faceurl
            })

        }
        //  else {
        //     wx.showModal({
        //         title: '提示',
        //         content: '这是一个模态弹窗',
        //         success: function(res) {
        //             wx.reLaunch({
        //                 url: '/pages/tabBar/index/index'
        //             })
        //         }
        //     })

        // }

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
    // 邀请好友
    invitation() {
        wx.navigateTo({
            url: '/pages/component/invitation/invitation'
        })
    },
    // 余额
    goMyBalance() {
        wx.navigateTo({
            url: '/pages/component/myBalance/myBalance'
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
            url: that.data.pdfUrl,
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
                            // console.log(savedFilePath)
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
    //获取手机号
    getPhoneNumber: function(e) {
        let that = this;
        console.log(app.globalData.userInfo.telphone)
        if (app.globalData.userInfo.telphone) {
            that.getUserInfo();
            return;
        }

        let _openid = wx.getStorageSync('openid');
        let session_key = wx.getStorageSync('session_key');

        let params = {
            openid: _openid,
            sessionkey: session_key,
            iv: e.detail.iv,
            encrypteddata: e.detail.encryptedData,
        };

        util.ajaxRequest(
            'buyerMobile/wxuser/decodeData',
            params,
            function(res) {

                // if (res.data.suc == 1) {

                //     if (!res.data.info.purePhoneNumber) {
                //         console.log('暂无绑定手机号');

                //         app.bindphone();

                //         return
                //     }

                //     app.globalData.telphone = res.data.info.purePhoneNumber;

                //     wx.showModal({
                //         title: '提示',
                //         showCancel: false,
                //         content: '注册/登陆成功',
                //         success: function(res) {
                //             wx.reLaunch({
                //                 url: '/pages/tabBar/index/index'
                //             })
                //         }
                //     })

                // } else {
                //     console.log(res.data.msg);
                // }


            });

    },
    onPullDownRefresh: function() {

        this.getUserInfo();
        this.getSavedFileList();

        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {

    }
})