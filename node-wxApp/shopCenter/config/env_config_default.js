'use strict';

module.exports = appInfo => {
  const envConfig = exports = {};
  envConfig.grayType = 0;

  envConfig.cluster = {
    listen: {
      port: 7005,
    }
  };
  
  //redis配置
  envConfig.redis = {
    client: {
      port: 6379, // Redis port
      host: '10.100.200.22', // Redis host
      password: null,
      db: 3
    }
  };
  envConfig.appHostName = 'dev.pay.snsshop.net';
  return envConfig;
}
