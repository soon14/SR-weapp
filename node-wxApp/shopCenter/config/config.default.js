'use strict';

module.exports = appInfo => {
  const config = exports = require('./env_config.js')(appInfo);
  
  /**
   * some description
   * @member Config#test
   * @property {String} key - some description
   */
  config.keys = appInfo.name + '_klsdjklfhdjkfh';
  config.security = {
    csrf: false,
    ctoken: false
  };
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  config.middleware = ['koaOrm', 'appletParse', 'netAdminParse', 'merchantAdminParse', 'bossParse'];
  //xml数据过滤配置 插件放到app.js里面
  config.xmlBody = {
    //limit: 128,
    encoding: 'utf8', // lib will detect it from `content-type` 
    xmlOptions: {
      explicitArray: false
    },
    onerror: (err, ctx) => {
      ctx.throw(err.status, err.message);
    }
  };
  //配置 multipart 中间件上传扩展名
  config.multipart = {
    fileExtensions: ['.xlsx', '.xls']
  };
  // 配置 appletParse 中间件的配置
  config.appletParse = {
    match: ['/applet'],
    merchant: [
      "/applet/users/login",
      "/applet/pay/notify",
      "/applet/users/test"
    ],
    applet: [
      "/applet/user-oauth/session-key",
      "/applet/user-oauth/login",
      "/applet/pay/notify",
      "/applet/pay/wx-pay",
      "/applet/users/test"
    ],
    user: [
      "/applet/user-oauth/session-key",
      "/applet/user-oauth/login",
      "/applet/user/send-mobile",
      "/applet/user/bind-mobile",
      "/applet/pay/notify",
      "/applet/pay/wx-pay",
      "/applet/users/test"
    ]
  };
  // 配置 netAdminParse 中间件的配置
  config.netAdminParse = {
    match: ['/net'],
    loginNoNeed: [
      "/net/login/do",
      "/net/password/send-code",
      "/net/password/check-mobile",
      "/net/password/reset-pass",
    ],
    loginCheckByGetParameter: [
      "/net/schooladmin/school-student/export",
      "/net/schooladmin/school-student/down-templet",
      "/net/schooladmin/school-payment-sku/export",
      "/net/schooladmin/school-order/exports-pay-info",
      "/net/schooladmin/school-order/exports-statement",
      "/net/schooladmin/school-order/exports-statement-detail",
      "/net/schooladmin/school-order/exports-payment-list-by-class"
    ]
  };
  // 配置 merchantAdminParse 中间件的配置
  config.merchantAdminParse = {
    match: ['/merchantadmin'],
    loginNoNeed: [
      "/merchantadmin/login/do",
      "/merchantadmin/applet_auth/callback",
      "/merchantadmin/password/send-code",
      "/merchantadmin/password/check-mobile",
      "/merchantadmin/password/reset-pass",
    ],
    loginCheckByGetParameter: [
      "/merchantadmin/school-order/exports-pay-info",
      "/merchantadmin/school-order/exports-statement",
      "/merchantadmin/school-order/exports-statement-detail",
      "/merchantadmin/applet_auth/down-image"
    ]
  };

  //配置 bossParse 中间件的配置
  config.bossParse = {
    match: ['/boss'],
    loginNoNeed: [
      "/boss/login/do",
    ],
    loginCheckByGetParameter: [
      "/boss/statement/exports-list",
    ]
  };

  //威付通
  config.swiftPay = {
    gateWay: "https://pay.swiftpass.cn/pay/gateway",
    payService: "pay.weixin.jspay",
    queryService: "unified.trade.query",
    version: "2.0",
    charset: "UTF-8",
    signType: "MD5",
    notifyUrl: "https://" + config.appHostName + "/applet/pay/notify",
  };

  //银付宝
  config.speedposPay = {
    gateWay: 'https://api.speedpos.cn/unifiedorder',
    gateWayQuery: 'https://api.speedpos.cn/orderquery',
    gateWayRefund: 'https://api.speedpos.cn/refundorder',
    gateWayRefundQuery: 'https://api.speedpos.cn/refundquery',
    notifyUrl:"https://" + config.appHostName + "/applet/pay/notify",
   };

  // 小程序平台相关
  config.component = {
    APPLET_CALLBACK_HOST: 'https://' + config.appHostName,
  };

  config.applet = {
    gateWay: 'https://' + config.appHostName,
    requestdomain: 'https://' + config.appHostName,
    wsrequestdomain: 'wss://' + config.appHostName,
    uploaddomain: 'https://' + config.appHostName,
    downloaddomain: 'https://' + config.appHostName,
  };

  return config;
};
