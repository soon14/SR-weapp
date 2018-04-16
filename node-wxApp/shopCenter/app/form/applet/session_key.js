'use strict';
var Parameter = require('parameter');

class SessionKey {

    //构造检查对象
    constructor() {
        this.param = new Parameter();
        this.rule = {
            jsCode: {
                type: 'string',
                required: true
            }
        }
    }

    //检查数据
    checkData(data) {
        this.data = data;
        var res = this.param.validate(this.rule, this.data);
        if (res != undefined) {
            throw new Error(res[0].field + ' ' + res[0].code);
        }
        this.checkAfterValidate();
        return this.formate();
    }

    //校验器完成后执行定制的校验
    checkAfterValidate() {
        //throw new Error('校验错误');
        return true;
    }

    //序列化输出自己要的数据
    formate() {
        return this.data;
    }
}

module.exports = SessionKey;