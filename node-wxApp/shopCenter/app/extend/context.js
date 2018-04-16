'use strict';
//用于请求内传递参数
let ctxData = Symbol('Context#ctxData');
const out = new (require('./out.js'))();
module.exports = {
    get isIOS() {
        const iosReg = /iphone|ipad|ipod/i;
        return iosReg.test(this.get('user-agent'));
    },
    //获取传递数据
    getData(key) {
        if (!this[ctxData]) {
            return undefined;
        }
        return this[ctxData].get(key);
    },
    //设置传递参数
    setData(key, val) {
        if (!this[ctxData]) {
            this[ctxData] = new Map();
        }
        this[ctxData].set(key, val);
    },
    out
};
