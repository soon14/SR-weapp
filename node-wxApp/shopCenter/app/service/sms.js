'use strict';
const Service = require('egg').Service;
const request = require('request');

class SmsService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    /**
     * 1.登录-手机验证码
        【产品名称】您的验证码：checkCode，请在180秒内填写
        2.忘记密码-手机验证码
        【产品名称】您的验证码：******，请在180秒内填写
        3.录取-手机短信通知
        【产品名称】恭喜！您提交的报名申请已通过，studentName已被schoolName录取，请及时前往查看并进行缴费，paymenEendTime前未缴费默认为自动放弃
     */

     /**
      * 发送验证码模版
      */
    async _checkCodeTemp(contentObj) {
        return {
            checkCode:contentObj.checkCode
        }
    }

     /**
      * 录取通知模版
      */
    async _enrollNotificationTemp(contentObj) {
        return {
            studentName:contentObj.studentName,
            schoolName:contentObj.schoolName,
            paymentEndTime:contentObj.paymentEndTime
        }
    }
    
    async _sendMsg(mobile, tempId,msgType,contentObj) {
        const config = this.ctx.app.config;
        request({
            url: config.smsPlat.smsSendUrl,
            method: "POST",
            body: JSON.stringify({
                platform: config.smsPlat.platform,
                mobile: mobile,
                sign: config.smsPlat.sign,
                type: msgType,
                temp_id: tempId,
                temp_params: JSON.stringify(contentObj)
            })
        }, function(err, res, body){
            console.log(body);
        });
    }
    
    /**
     * 
     * @param {*} mobile 
     * @param {*} contentObj 
     */
    async enrollNotification(mobile,contentObj) {
        let putContent = await this._enrollNotificationTemp(contentObj);
        return await this._sendMsg(mobile,this.ctx.app.config.smsPlat.enrollNotification,this.ctx.app.config.smsPlat.msgTypeSys,putContent);
    }

    /**
     * 
     * @param {*} mobile 
     * @param {*} contentObj 
     */
    async checkCode(mobile,contentObj) {
        let putContent = await this._checkCodeTemp(contentObj);
        return await this._sendMsg(mobile,this.ctx.app.config.smsPlat.checkCode,this.ctx.app.config.smsPlat.msgTypeMsg,putContent);
    }

}
module.exports = SmsService;
