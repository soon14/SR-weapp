'use strict';

const Service = require('egg').Service;

class WxComponentService extends Service {

    constructor(ctx) {
        super(ctx);
        this.cacheKey = {
            'WXCOMPONENT': 'component:${params[0]}'
        };

        const {WxComponent} = ctx.orm('master');
        this.WxComponent = WxComponent;
    }

    async getComponent() {
        const componentCacheKey = this.ctx.helper.getCacheKey(this.cacheKey['WXCOMPONENT'], 1);
        let component = await this.app.redis.get(componentCacheKey);
        
        if (!component) {
            component = await this._getById(1);
            if (component) {
                component = JSON.stringify(component);
                await this.app.redis.set(componentCacheKey, component, 'EX', 3600);
            } else {
                throw new Error('获取component配置出错');
            }
        }

        return JSON.parse(component);
    }

    /**
     * 事件处理
     * @param {*} decodeXml 
     */
    async eventHandler(decodeXml) {
        console.log(decodeXml.xml.InfoType);
        if (decodeXml.xml.InfoType != undefined) {
            await this._infoTypeHandler(decodeXml);
        } else if (decodeXml.xml.MsgType != undefined) {
            await this._msgTypeHandler(decodeXml);
        } else if (decodeXml.xml.Event != undefined) {
            await this._evenTypeHandler(decodeXml);
        } else {
            this.app.logger.error("事件类型解析有误",decodeXml);
        }
        
    }

    /**
     * 微信第三方平台推送处理
     * @param {*} decodeXml 
     */
    async _infoTypeHandler(decodeXml) {
        switch (decodeXml.xml.InfoType) {
            case 'component_verify_ticket':
                await this._updateTicket(decodeXml.xml.AppId,decodeXml.xml.ComponentVerifyTicket);
                break;
            case 'authorized':

                break;
            case 'updateauthorized':

                break;
            case 'unauthorized':

                break;
            default:
                break;
        }
    }

    /**
     * TODO 
     * 微信消息推送处理
     * @param {*} decodeXml 
     */
    async _msgTypeHandler(decodeXml) {

    }

    /**
     * TODO
     * 微信事件处理
     * @param {*} decodeXml 
     */
    async _evenTypeHandler(decodeXml) {

    }

    async _updateTicket(appid, ticket) {
        return await this.WxComponent.update(
            {
                componentVerifyTicket: ticket,
                modified: this.ctx.helper.currentTimestamp(),
            },
            {where:{
                componentAppid:appid
            }});
    };

    async _getById (id) {
        return await this.WxComponent.findOne({
            where: {
                id: id
            },
            limit: 1
        });
    };
}
module.exports = WxComponentService;
