'use strict';

module.exports = {
    /**
     * 获取请求路径
     */
    getQueryPath() {
        return this.ctx.request.url.split('?')[0];
    },
    /**
     * 获取自定义头信息
     * @param {string} key 
     */
    getSelfHerder(key) {
        return (this.ctx.request.header[key] == undefined) ? false : this.ctx.request.header[key];
    },
    /**
     * 格式化模版输出
     * @param {string} key 
     * @param {...} params 
     */
    getCacheKey(key, ...params) {//格式化输出
        return eval('`' + key + '`');
    },

    /**
     * 获取当天凌晨时间戳
     */
    currentDayTime() {
        let day = new Date().toLocaleDateString();
        let date = Date.parse(new Date(day));
        return date / 1000; //转换成秒   
    },

    /**
     * 返回随机字符串
     * @param {*} len 
     * @param {*} type 
     */
    getRandomString(len, type) {
        let str, result = '';
        switch (type) {
            case "num":
                str = "01234567890123456789012345678901234567890123456789";
                break;
            default:
                str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                break;
        }
        let strLen = str.length;
        for (let i = 0; i < len; i++) {
            let pos = Math.round(Math.random() * (strLen - 1));
            result += str.substr(pos, 1);
        }
        return result;
    },

    /**
     * 创建订单数
     * @param {*} s 订单类型
     * @param {*} p 平台类型
     * @param {*} m 商户id
     */
    async createOrderNo(s, p, m) {
        s = s.toString();
        p = p.toString();
        m = m.toString();
        //const { ctx, service, app } = this
        let tn = this.dateFormat(new Date(), "yyyyMMddhhmmss");
        if (m.length < 5) {
            m = m + "00000";
        }
        let baseno = s + p + m.substr(0, 5) + tn;
        for (let i = 0; i < 3; i++) {
            let no = baseno + this.getRandomString(5, "num");
            let cacheFlag = await this.app.redis.set(no, 1, 'ex', 2, 'nx');
            if (cacheFlag == "OK") {
                return no;
            }
            throw new Error("OrderNo生成失败");
        }
    },
    /**
     * 格式化时间
     * @param {*} date 对象
     * @param {*} fmt 格式字符串
     */
    dateFormat(date, fmt) {
        const o = {
            'M+': date.getMonth() + 1, // 月份  
            'd+': date.getDate(), // 日  
            'h+': date.getHours(), // 小时  
            'm+': date.getMinutes(), // 分  
            's+': date.getSeconds(), // 秒  
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度  
            S: date.getMilliseconds(), // 毫秒  
        };
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
        }
        return fmt;
    },

    /**
     * 获取当前时间秒为单位的时间戳
     */
    currentTimestamp() {
        return parseInt(Date.parse(new Date()).toString().substr(0, 10));
    },

    /**
     * redis锁
     * @param {*} key 
     * @param {*} value 
     * @param {*} delay 
     */
    async redislock(key, value, delay) {
        let result = await this.ctx.app.redis.set(key, value, 'NX', 'EX', delay);
        return result == 'OK';
    },

    /**
     * 数组去掉重复数据
     * @param {*} arr 
     */
    async repetitionArr(arr) {
        let resultArr = [], hash = {};
        for (let i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                resultArr.push(elem);
                hash[elem] = true;
            }
        }

        return resultArr;
    },

    /**
     * 格式化金额(分转元)
     * 
     * @param {any} num 
     * @returns 
     */
    formatMoney(num) {
        if (typeof num !== "number" || isNaN(num)) return null;
        return (num / 100).toFixed(2);
    },

    isMobile(mobile) {
        if (mobile.length != 11) {
            return false;
        }
        let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!reg.test(mobile)) {
            return false;
        }
        return true;
    },

    /**
     * 求差集arr1-arr2  
     * @param {*} arr1 
     * @param {*} arr2 
     */
    async arrayMinus(arr1, arr2) {
        let result = [];
        arr1.forEach(function (x) {
            if (arr2.indexOf(x) === -1) {
                result.push(x);
            } else {
                return;
            }
        })
        return result;
    },
    /**
      * 对数组中的对象，按对象的key进行sortType排序
      * @param key 数组中的对象为object,按object中的key进行排序
      * @param sortType true为降序；false为升序
      */
    async keysort(key, sortType) {
        return function (a, b) {
            return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    },

    /**
     * 验证身份证
     * @param {*} idcard 
     */
    checkIdcard(idcard) {
        const ereg = /^\d{17}(\d|X|x)$/;

        if (ereg.test(idcard)) {
            return true;
        } else {
            return false;
        }    
    },

    async getCryptoPass(password, salt) {
        const crypto = require('crypto');
        let pass = password + ':' + salt;
        let md5 = crypto.createHash('md5');
        return  md5.update(pass).digest('hex');
    },

    /**
     * form文件流上传cdn
     * 
     * @param {any} stream 
     * @returns 
     */
    async upload(stream) {

        const path = require('path');

        let url = this.app.config.upload.gateWay;

        let platform = 1;
        let fileType = path.extname(stream.filename).toLowerCase();

        if (fileType.indexOf('.') != -1) {
            fileType = fileType.split('.')[1];
        }

        url += '?file_name=' + stream.filename + '&platform=' + platform + '&file_type=' + fileType;

        let res = await this.ctx.curl(url, {
            method: 'POST',
            stream: stream,
            gzip: true,
            dataType: 'json'
        });  

        return res.data;
    },

    async tomorrowTime() {
        let moment = require('moment');
        let time = moment();
        moment.locale('zh-cn');
        return parseInt(new Date(time.format('YYYY-MM-DD') + ' 00:00:00').getTime().toString().substr(0, 10))+86400;
    }
};