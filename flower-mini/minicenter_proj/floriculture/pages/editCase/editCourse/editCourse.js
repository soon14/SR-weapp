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

        formarry: [{ content: '', type: '1', css: '', jiacu: false, txtStyleShow: false, colorStyleShow: false, txtcolor: '', color: '', txtalign: 'left' }],

        fora: { content: '', type: '', css: '' }, //教程内容 type 1文字，2图片，3分割线 ，css样式信息

        /*
        PictureSizeLimit 
        上传的图片大小限制 单位 KB
         */
        PictureSizeLimit: 360,

        lineStyle: 'solid',
        lineWidth: 'bold',
        linestyle: 'solidBold',


        txtStyleShow: false,
        colorStyleShow: false,

        txtcolor: null,

        yulanShow: false,
    },
    onLoad(options) {

        if (app.addFormInfo.course) {
            this.setData({
                formarry: app.addFormInfo.course
            })
        }

    },
    // 加粗
    jiacu(e) {
        let index = e.currentTarget.dataset.index,
            formarry = this.data.formarry;

        formarry[index].jiacu = !formarry[index].jiacu;
        formarry[index].txtStyleShow = false;
        formarry[index].colorStyleShow = false;

        this.setData({
            formarry: formarry
        })
        console.log(formarry)
    },
    changetxtStyle(e) {
        let index = e.currentTarget.dataset.index,
            formarry = this.data.formarry;

        formarry[index].txtStyleShow = !formarry[index].txtStyleShow;
        formarry[index].colorStyleShow = false;

        this.setData({
            formarry: formarry
        })
    },
    changetxtAlign(e) {

        let _txtalign = e.currentTarget.dataset.txtalign,
            index = e.currentTarget.dataset.index,
            formarry = this.data.formarry;

        formarry[index].txtalign = _txtalign;

        this.setData({
            formarry: formarry
        })
    },
    changecolorStyle(e) {
        let index = e.currentTarget.dataset.index,
            formarry = this.data.formarry;

        formarry[index].colorStyleShow = !formarry[index].colorStyleShow;
        formarry[index].txtStyleShow = false;

        this.setData({
            formarry: formarry
        })
    },
    changeTxtColor(e) {
        let txtcolor = e.currentTarget.dataset.txtcolor,
            index = e.currentTarget.dataset.index,
            formarry = this.data.formarry,
            color;

        switch (txtcolor) {
            case 'c1':
                color = 'color1'
                break;
            case 'c2':
                color = 'color2'
                break;
            case 'c3':
                color = 'color3'
                break;
            case 'c4':
                color = 'color4'
                break;
            case 'c5':
                color = 'color5'
                break;
            case 'c6':
                color = 'color6'
                break;
            case 'c7':
                color = 'color7'
                break;

        }

        formarry[index].txtcolor = txtcolor;
        formarry[index].color = color;

        this.setData({
            formarry: formarry
        })
    },
    formSubmit(e) {
        // console.log(e)

        let that = this,
            value = this.data.formarry; //表单信息

        for (var i = 0; i < value.length; i++) {
            if (value[i].type == 1) {
                value[i].css = {
                    txtalign: value[i].txtalign,
                    color: value[i].color,
                    fontweight: value[i].jiacu ? 'font_weight_bold' : 'font_weight_normal'
                };
                // 删除辅助交互属性
                // delete value[i].txtStyleShow;
                // delete value[i].txtcolor;
                // delete value[i].colorStyleShow;
                // delete value[i].color;
                // delete value[i].txtalign;
                // delete value[i].jiacu;
            } else if (value[i].type == 3) {
                // 删除辅助交互属性
                // delete value[i].lineWidth;
                // delete value[i].lineStyle;
            }
        }


        let course = { course: value };

        app.addFormInfo = Object.assign(app.addFormInfo, course);

        wx.navigateBack({
            delta: 1
        });
    },

    radioSolidChange(e) {
        let index = e.currentTarget.dataset.index;
        let formarry = this.data.formarry;
        let lineStyle = { lineStyle: e.detail.value };

        formarry[index] = Object.assign(formarry[index], lineStyle);

        this.changeLine(index, formarry);
    },
    radioBoldChange(e) {
        let index = e.currentTarget.dataset.index;
        let formarry = this.data.formarry;
        let lineWidth = { lineWidth: e.detail.value };

        formarry[index] = Object.assign(formarry[index], lineWidth);

        this.changeLine(index, formarry);
    },
    // 选择线条样式
    changeLine(index, formarry) {

        let that = this;

        let linestyle;

        if (formarry[index].lineStyle == 'solid' && formarry[index].lineWidth == 'bold') {
            linestyle = 'solidBold';
        } else if (formarry[index].lineStyle == 'dashed' && formarry[index].lineWidth == 'bold') {
            linestyle = 'dashedBold';
        } else if (formarry[index].lineStyle == 'solid' && formarry[index].lineWidth == 'normal') {
            linestyle = 'solidNormal';
        } else if (formarry[index].lineStyle == 'dashed' && formarry[index].lineWidth == 'normal') {
            linestyle = 'dashedNormal';
        }

        formarry[index].css = linestyle;

        that.setData({
            formarry: formarry
        })
    },
    // 输入
    bindtextareainput: function(e) {
        let index = e.target.dataset.index;
        let detail = e.detail.value;

        let formarry = this.data.formarry;
        formarry[index].content = detail;

        this.setData({
            formarry: formarry
        })

    },
    // 添加
    addObj: function(e) {
        let formarry = this.data.formarry;
        let type = e.target.dataset.type;
        let fora = this.data.fora;

        if (type == 3) {
            let linstyle = { content: '', type: '3', css: 'solidBold', lineStyle: 'solid', lineWidth: 'normal' };
            fora = linstyle;
        }

        if (type == 1) {
            let linstyle = { content: '', type: '1', css: '', jiacu: false, txtStyleShow: false, colorStyleShow: false, txtcolor: '', color: '', txtalign: 'left' };
            fora = linstyle;
        }

        fora.type = type;
        formarry.push(fora);

        this.setData({
            formarry: formarry,
        })

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
                    // console.log('index', index)
                    that.remove(_formarry, index);
                    that.setData({
                        formarry: _formarry
                    });
                    // console.log(that.data.formarry)

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

        if (index == 0) {
            //第一个阻止上移
            return;
        }

        let _formarry = that.data.formarry;
        let newarry = that.upRecord(_formarry, index);

        that.setData({
            formarry: newarry
        });

    },
    // down
    goDown: function(e) {
        let that = this;
        let index = e.target.dataset.index;
        let _formarry = that.data.formarry;

        if (index == _formarry.length - 1) {
            //最后一个阻止下移
            return;
        }

        let newarry = that.downRecord(_formarry, index);

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
                wx.showLoading({
                    title: '上传中',
                })
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
                        wx.hideLoading()
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
    // 预览
    yulan() {
        this.setData({
            yulanShow: !this.data.yulanShow
        })
    }

})