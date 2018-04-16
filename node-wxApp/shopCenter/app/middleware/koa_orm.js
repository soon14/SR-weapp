'use strict';

module.exports = options => {
    return require('koa-orm')(options).middleware;
};