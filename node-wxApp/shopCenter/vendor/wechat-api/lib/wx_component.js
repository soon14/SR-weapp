'use strict';

const { postJSON } = require('./util');

/**
 * js_code获取SessionKey
 * @param appid
 * @param js_code
 * @param fromCache
 * @returns {Promise}
 */
exports.getSessionKey = async function(appid, js_code, fromCache) {
    const componentAccessToken = await this.ensureComponentAccessToken(fromCache);
    const url = this.jscode2sessionPrefix + 'appid=' + appid + '&js_code=' + js_code + '&grant_type=authorization_code&component_appid=' + this.componentAppid + '&component_access_token=' + componentAccessToken.accessToken;
    return this.request(url, {}, 'component');
};

exports.createPreAuthCode = async function(fromCache) {
    const componentAccessToken = await this.ensureComponentAccessToken(fromCache);
    const url = this.apiCreatePreauthcode + '?component_access_token=' + componentAccessToken.accessToken;
    return this.request(url, postJSON({ component_appid: this.componentAppid }), 'component');
};

exports.queryAuth = async function(authorization_code, fromCache) {
    const componentAccessToken = await this.ensureComponentAccessToken(fromCache);
    const url = this.apiQueryAuth + '?component_access_token=' + componentAccessToken.accessToken;
    return this.request(url, postJSON({ component_appid: this.componentAppid, authorization_code }), 'component');
};

exports.getAuthorizerInfo = async function(authorizer_appid, fromCache) {
    const componentAccessToken = await this.ensureComponentAccessToken(fromCache);
    const url = this.apiGetAuthorizerInfo + '?component_access_token=' + componentAccessToken.accessToken;
    return this.request(url, postJSON({ component_appid: this.componentAppid, authorizer_appid }), 'component');
};

exports.commit = async function(fromCache, template_id, ext_json, user_version, user_desc) {
    const accessToken = await this.ensureAccessToken(fromCache);
    const url = this.commitUrl + '?access_token=' + accessToken.accessToken;
    console.log(ext_json);
    return this.request(url, postJSON({ template_id, ext_json, user_version, user_desc }));
};

exports.bindTester = async function(fromCache, wechatid) {
    const accessToken = await this.ensureAccessToken(fromCache);
    const url = this.bindTesterUrl + '?access_token=' + accessToken.accessToken;
    return this.request(url, postJSON({ wechatid: wechatid }));
};

exports.getWxaQrcode = async function(fromCache) {
    const accessToken = await this.ensureAccessToken(fromCache);
    const url = this.qrcode + '?access_token=' + accessToken.accessToken;
    return this.request(url);
};

exports.modifyDomain = async function(requestdomain, wsrequestdomain, uploaddomain, downloaddomain, fromCache) {
    const accessToken = await this.ensureAccessToken(fromCache);
    const url = this.modify + '?access_token=' + accessToken.accessToken;
    return this.request(url, postJSON({ action: 'add', requestdomain: [ requestdomain ], wsrequestdomain: [ wsrequestdomain ], uploaddomain: [ uploaddomain ], downloaddomain: [ downloaddomain ] }));
};

exports.getCategory = async function() {
    const accessToken = await this.ensureAccessToken(true);
    const url = this.category + '?access_token=' + accessToken.accessToken;
    return this.request(url);
};

exports.submitAudit = async function(itemList) {
    const accessToken = await this.ensureAccessToken(true);
    const url = this.submit + '?access_token=' + accessToken.accessToken;
    return this.request(url, postJSON({ item_list: itemList }));
};

exports.getLatestAuditstatus = async function() {
    const accessToken = await this.ensureAccessToken(true);
    const url = this.latestAuditstatus + '?access_token=' + accessToken.accessToken;
    return this.request(url);
};

exports.release = async function() {
    const accessToken = await this.ensureAccessToken(true);
    const url = this.releaseUrl + '?access_token=' + accessToken.accessToken;
    return this.request(url, postJSON({}));
};

exports.getwxaAppletcode = async function() {
    const accessToken = await this.ensureAccessToken(true);
    const url = this.getwxacode + '?access_token=' + accessToken.accessToken;
    return this.request(url, postJSON({ path: 'pages/home/index' }));
};

exports.getTemplateList = async function() {
    const accessToken = await this.ensureAccessToken(false);
    const url = this.gettemplatelist + '?access_token=' + accessToken.accessToken;
    return this.request(url, postJSON({}));
};

exports.sendMinTemplate = async function (openid, templateId, formId, data) {
    const accessToken = await this.ensureAccessToken(true);
    const apiUrl = this.prefix + 'message/wxopen/template/send?access_token=' + accessToken.accessToken;
    const template = {
        touser: openid,
        template_id: templateId,
        form_id: formId,
        data: data
    };
    return this.request(apiUrl, postJSON(template));
};