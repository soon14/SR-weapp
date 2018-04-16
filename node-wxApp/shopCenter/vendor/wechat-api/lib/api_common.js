'use strict';

// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
const httpx = require('httpx');
const liburl = require('url');
const WXBizMsgCrypt = require('./util_crypto.js');
const { postJSON } = require('./util');

class AccessToken {
  constructor(accessToken, expireTime) {
    this.accessToken = accessToken;
    this.expireTime = expireTime;
  }

  /*!
   * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比 * Examples:
   * ```
   * token.isValid();
   * ```
   */
  isValid() {
    return !!this.accessToken && Date.now() < this.expireTime;
  }
}

class API {
  /**
   * 根据 appid 和 appsecret 创建API的构造函数
   * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
   * 使用策略如下：
   * 1. 调用用户传入的获取 token 的异步方法，获得 token 之后使用
   * 2. 使用appid/appsecret获取 token 。并调用用户传入的保存 token 方法保存
   * Tips:
   * - 如果跨机器运行wechat模块，需要注意同步机器之间的系统时间。
   * Examples:
   * ```
   * var API = require('wechat-api');
   * var api = new API('appid', 'secret');
   * ```
   * 以上即可满足单进程使用。
   * 当多进程时，token 需要全局维护，以下为保存 token 的接口。
   * ```
   * var api = new API('appid', 'secret', async function () {
   *   // 传入一个获取全局 token 的方法
   *   var txt = await fs.readFile('access_token.txt', 'utf8');
   *   return JSON.parse(txt);
   * }, async function (token) {
   *   // 请将 token 存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
   *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
   *   await fs.writeFile('access_token.txt', JSON.stringify(token));
   * });
   * ```
   * @param {String} componentAppid 平台第三方授权appid
   * @param {String} componentAppsecret 平台a==第三方授权secret
   * @param {String} componentVerifyTicket 平台安全ticket
   * @param {String} checkToken 平台公众号消息校验Token
   * @param {String} componentVerifyTicket 安全ticket
   * @param {String} encodingAESKey 第三方消息加解密Key
   * EncodingAESKey
   * 
   * @param {AsyncFunction} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {AsyncFunction} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor(componentAppid, componentAppsecret, componentVerifyTicket, checkToken, encodingAESKey, getToken, saveToken) {
    this.componentAppid = componentAppid;
    this.componentAppsecret = componentAppsecret;
    this.componentVerifyTicket = componentVerifyTicket;
    this.checkToken = checkToken;
    this.encodingAESKey = encodingAESKey;

    this.wXBizMsgCrypt = new WXBizMsgCrypt(this.checkToken, this.encodingAESKey, this.componentAppid);
    this.getToken = getToken || async function(appid) {
      return await this.cache.get('authorizer_access_token:' + appid);
    };
    this.getComponentToken = getToken || async function () {
      return await this.cache.get('component_access_token');
    };
    this.saveToken = saveToken || async function(token, appid) {
      await this.cache.set('authorizer_access_token:' + appid, JSON.stringify(token), 'EX', 7200);
    };
    this.saveComponentToken = saveToken || async function (token) {
        await this.cache.set("component_access_token", JSON.stringify(token), "EX", 7200);
    };
    this.prefix = 'https://api.weixin.qq.com/cgi-bin/';
    this.mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
    this.fileServerPrefix = 'http://file.api.weixin.qq.com/cgi-bin/';
    this.payPrefix = 'https://api.weixin.qq.com/pay/';
    this.merchantPrefix = 'https://api.weixin.qq.com/merchant/';
    this.customservicePrefix = 'https://api.weixin.qq.com/customservice/';
    this.jscode2sessionPrefix = 'https://api.weixin.qq.com/sns/component/jscode2session?';
    this.apiCreatePreauthcode = this.prefix + 'component/api_create_preauthcode';
    this.apiQueryAuth = this.prefix + 'component/api_query_auth';
    this.apiGetAuthorizerInfo = this.prefix + 'component/api_get_authorizer_info';
    this.commitUrl = 'https://api.weixin.qq.com/wxa/commit';
    this.bindTesterUrl = 'https://api.weixin.qq.com/wxa/bind_tester';
    this.qrcode = 'https://api.weixin.qq.com/wxa/get_qrcode';
    this.modify = 'https://api.weixin.qq.com/wxa/modify_domain';
    this.category = 'https://api.weixin.qq.com/wxa/get_category';
    this.submit = 'https://api.weixin.qq.com/wxa/submit_audit';
    this.latestAuditstatus = 'https://api.weixin.qq.com/wxa/get_latest_auditstatus';
    this.releaseUrl = 'https://api.weixin.qq.com/wxa/release';
    this.getwxacode = 'https://api.weixin.qq.com/wxa/getwxacode';
    this.gettemplatelist = 'https://api.weixin.qq.com/wxa/gettemplatelist';
    this.defaults = {};
    // set default js ticket handle
    this.registerTicketHandle();
  }

    /**
     * 设置appid
     * @param {String} appid 在公众平台上申请得到的appid
     */
    setAppid(appid) {
      this.appid = appid;
    }

    setAuthorizerRefreshToken(authorizerRefreshToken) {
        this.authorizerRefreshToken = authorizerRefreshToken;
    }

    /**
     * 设置cache
     * @param cache
     */
    setCache(cache) {
      this.cache = cache;
    }

  /**
   * 用于设置urllib的默认options * Examples:
   * ```
   * api.setOpts({timeout: 15000});
   * ```
   * @param {Object} opts 默认选项
   */
  setOpts(opts) {
    this.defaults = opts;
  }

  /**
   * 设置urllib的hook
   */
  async request(url, opts, type, retry) {
    if (typeof retry === 'undefined') {
      retry = 3;
    }

    const options = {};
    Object.assign(options, this.defaults);
    opts || (opts = {});
    const keys = Object.keys(opts);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== 'headers') {
        options[key] = opts[key];
      } else {
        if (opts.headers) {
          options.headers = options.headers || {};
          Object.assign(options.headers, opts.headers);
        }
      }
    }
    console.log(url);
    const res = await httpx.request(url, options);
    if (res.statusCode < 200 || res.statusCode > 204) {
      const err = new Error(`url: ${url}, status code: ${res.statusCode}`);
      err.name = 'WeChatAPIError';
      throw err;
    }

    const buffer = await httpx.read(res);
    const contentType = res.headers['content-type'] || '';
    if (contentType.indexOf('application/json') !== -1 || contentType.indexOf('text/plain') !== -1) {
      let data;
      try {
        data = JSON.parse(buffer);
      } catch (ex) {
        const err = new Error('JSON.parse error. buffer is ' + buffer.toString());
        err.name = 'WeChatAPIError';
        throw err;
      }

      if (data && data.errcode) {
        const err = new Error(data.errmsg);
        err.name = 'WeChatAPIError';
        err.code = data.errcode;

        if ((err.code === 40001 || err.code === 42001 || err.code === 40014) && retry > 0) {
          if (type === 'component') {
            // 销毁已过期的ComponentToken
            await this.saveComponentToken(null);
            const token = await this.getComponentAccessToken();
            const urlobj = liburl.parse(url, true);
            if (urlobj.query && urlobj.query.component_access_token) {
              urlobj.query.component_access_token = token.accessToken;
              delete urlobj.search;
            }
            return this.request(liburl.format(urlobj), opts, type, retry - 1);
          }
          // 销毁已过期的token
          await this.saveToken(null, this.appid);
          const componentAccessToken = await this.ensureComponentAccessToken(true);
          const token = await this.getAccessToken(componentAccessToken.accessToken);
          const urlobj = liburl.parse(url, true);

          if (urlobj.query && urlobj.query.access_token) {
            urlobj.query.access_token = token.accessToken;
            delete urlobj.search;
          }

          return this.request(liburl.format(urlobj), opts, type, retry - 1);
        }

        throw err;
      }

      return data;
    }

    return buffer;
  }

  /*!
   * 根据创建API时传入的appid和appsecret获取access token
   * 进行后续所有API调用时，需要先获取access token
   * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token> * 应用开发者无需直接调用本API。 * Examples:
   * ```
   * var token = await api.getAccessToken();
   * ```
   * - `err`, 获取access token出现异常时的异常对象
   * - `result`, 成功时得到的响应结果 * Result:
   * ```
   * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
   * ```
   */
  async getAccessToken(component_access_token) {
    const url = 'https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=' + component_access_token;
    const data = await this.request(url, postJSON({
      component_appid: this.componentAppid,
      authorizer_appid: this.appid,
      authorizer_refresh_token: this.authorizerRefreshToken,
    }));

    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    const expireTime = Date.now() + (data.expires_in - 10) * 1000;
    const token = new AccessToken(data.authorizer_access_token, expireTime);
    await this.saveToken(token, this.appid);
    return token;
  }

  /*!
   * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
   * 无需依赖 getAccessToken 为前置调用。
   * 应用开发者无需直接调用此API。
   * Examples:
   * ```
   * await api.ensureAccessToken();
   * ```
   */
  async ensureAccessToken(fromCache) {
    // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
    if (fromCache === true) {
      let token = await this.getToken(this.appid);
      token = JSON.parse(token);
      let accessToken;
    if (token && (accessToken = new AccessToken(token.accessToken, token.expireTime)).isValid()) {
      return accessToken;
      }
    }
    const componentAccessToken = await this.ensureComponentAccessToken(true);
    return await this.getAccessToken(componentAccessToken.accessToken);
  }

   /*!
     * 根据创建API时传入的appid和appsecret获取access token
     * 进行后续所有API调用时，需要先获取access token
     * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token> * 应用开发者无需直接调用本API。 * Examples:
     * ```
     * var token = await api.getAccessToken();
     * ```
     * - `err`, 获取access token出现异常时的异常对象
     * - `result`, 成功时得到的响应结果 * Result:
     * ```
     * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
     * ```
     */
    async getComponentAccessToken() {
      const url = this.prefix + 'component/api_component_token';
    const data = await this.request(url, postJSON({
          component_appid: this.componentAppid,
          component_appsecret: this.componentAppsecret,
          component_verify_ticket: this.componentVerifyTicket
      }));

      // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
      const expireTime = Date.now() + (data.expires_in - 10) * 1000;
    const token = new AccessToken(data.component_access_token, expireTime);
      await this.saveComponentToken(token);
      return token;
  }

/*!
 * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
 * 无需依赖 getAccessToken 为前置调用。
 * 应用开发者无需直接调用此API。
 * Examples:
 * ```
 * await api.ensureAccessToken();
 * ```
 */
async ensureComponentAccessToken(fromCache) {
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  if (fromCache === true)
  {
      let token = await this.getComponentToken();
      token = JSON.parse(token);
      let accessToken;
      if (token && (accessToken = new AccessToken(token.accessToken, token.expireTime)).isValid()) {
          return accessToken;
      }
  }
  return this.getComponentAccessToken();
}

  /**
   * xml文件内容解密
   * @param {*} encryptData 加密字符串
   * @param {*} signature   签名
   * @param {*} timestamp 时间戳
   * @param {*} nonce 随机串
   * @param {*} encryptType 加密类型
   */
  parseRequestData(encryptData, signature, timestamp, nonce, encryptType) {
    if (encryptType==='aes') {
      const sign = this.wXBizMsgCrypt.getSignature(timestamp, nonce, encryptData);
      if (sign!=signature) {
        throw new Error("解密校验失败");
      }
      return this.wXBizMsgCrypt.decrypt(encryptData);
    }
    //不需要解密的直接返回
    return {
      message: encryptData,
      appId: this.componentAppid
    };
  }
}

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
  for (const key in obj) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: '+ key);
    }
    API.prototype[key] = obj[key];
  }
};

API.AccessToken = AccessToken;

module.exports = API;
