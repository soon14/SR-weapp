'use strict';
const Service = require('egg').Service;
const ComponentAPI = require('../../vendor/wechat-api');
const uuid = require('uuid');

class AppletService extends Service {
    constructor(ctx) {
        super(ctx);
        const {WxAuthInfo, ThirdPartyUser, WxComponent} = ctx.orm('master');
        this.WxAuthInfo = WxAuthInfo;
        this.ThirdPartyUser = ThirdPartyUser;
        this.WxComponent = WxComponent;
    }

    async getAppletSessionKey(js_code, force) {

        const key = uuid.v4();

        let brandLabel = this.ctx.request.header['brand-label'];
        let merchantId = this.ctx.getData('merchantId');

        let wxAuthInfo = await this._getWxAuthInfoByMerchantId(merchantId);
        if (wxAuthInfo === null) {
            throw new Error("商家小程序配置有误");
        }
        let wxComponent = await this._getById(1);
        if (wxComponent === null) {
            throw new Error("没有找到第三方平台配置");
        }
        let api = new ComponentAPI(wxComponent.componentAppid, wxComponent.componentAppsecret, wxComponent.componentVerifyTicket, wxComponent.checkToken, wxComponent.checkKey);
        api.setCache(this.app.redis);
        api.setOpts({timeout: 15000});
        const data = await api.getSessionKey(wxAuthInfo.authorizerAppid, js_code, force);
        if (data.errcode !== undefined) {
            throw new Error(data.errmsg);
        } else {
            let user = await this._getThirdPlatUserByOpenid(data.openid, merchantId);
            if (user === null) {
                const thirdPlatUser = {};
                thirdPlatUser.openId = data.openid;
                thirdPlatUser.merchantId = merchantId;
                thirdPlatUser.created = this.ctx.helper.currentTimestamp();
                let res = await this._addThirdPartyUser(thirdPlatUser);
                if (res === null) {
                    throw new Error("新增第三方平台用户失败");
                }
            } else {
                let thirdPlatUser = user;
                thirdPlatUser.lastlogintime = this.ctx.helper.currentTimestamp();
                thirdPlatUser.modified = this.ctx.helper.currentTimestamp();
                thirdPlatUser.loginCount = thirdPlatUser.loginCount + 1;
                let data = await this._updateThirdPartyUser(thirdPlatUser, thirdPlatUser.id);
                if (data === null) {
                    throw new Error("修改第三方平台用户失败");
                }
            }
            await this.app.redis.set("sessionKey:" + brandLabel + ":" + key, JSON.stringify(data), "EX", 7 * 86400);
            return {
                sessionKey: key
            };
        }
    }

    async _updateThirdPartyUser(updateObj, id) {
        return await this.ThirdPartyUser.update(updateObj,{
            where:{
                id:id
            }
        });
    };

    async _addThirdPartyUser(thirdPartyUser) {
        return await this.ThirdPartyUser.create(thirdPartyUser);
    };

    async _getThirdPlatUserByOpenid (openid, merchant_id) {
        return await this.ThirdPartyUser.findOne({
            where:{
                merchantId:merchant_id,
                openId : openid
            },
            raw: true
        });
    };

    async _getWxAuthInfoByMerchantId (merchant_id) {
        return await this.WxAuthInfo.findOne({
            where: {
                merchant_id: merchant_id
            },
            raw: true
        });
    };

    async _getById (id) {
        return await this.WxComponent.findOne({
            where: {
                id: id
            },
            limit: 1,
            raw: true
        });
    };
}
module.exports = AppletService;
