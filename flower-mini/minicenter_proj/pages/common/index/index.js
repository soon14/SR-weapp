/**
 *  @author Shirui 2018/02/05
 *  37780012@qq.com
 */
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        name:'',
        faceurl:'',
        identityCardNo:'',
        msession:'',
        unionid:'',
        telphone:'',
        userName:'',
    },
    onLoad: function(options) {
        let that = this;

        that.viewUserInfo();

        let flag =setInterval(function () {
            console.log('name是：',that.data.name);
            if(that.data.name!=''){
                clearInterval(flag);
            }else{
                that.viewUserInfo();
            }
        },1000);
    },
    viewUserInfo:function () {
        let app = getApp();
        let userInfo = app.userInfo;
        let that = this;

        if(userInfo==null) return;
        that.setData({
            name:userInfo.name,
            faceurl:userInfo.faceurl,
            identityCardNo:userInfo.identityCardNo,
            msession:userInfo.msession,
            unionid:userInfo.unionid,
            telphone:userInfo.telphone,
            userName:userInfo.userName,
        });
    },

    paytest:function (e) {

    }
})