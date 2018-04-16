'use strict';

module.exports = require('./lib/framework.js');

require('payment').startCluster({
    baseDir: __dirname,
    // port: 7001, // default to 7001
});
