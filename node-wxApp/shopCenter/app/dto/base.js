'use strict';

class Base {

    constructor() { }

    _transferList(list, fields) {
        let result = [];

        for (let item of list.data) {
            result.push(this._transferOne(item, fields));
        }

        return {
            data: result,
            page: list.page
        }
    }

    _transferAll(allList, fields) {
        let result = [];

        for (let item of allList) {
            result.push(this._transferOne(item, fields));
        }

        return result;
    }

    _transferOne(obj, fields, childObj = '') {
        let trans = {};
        for (let field of fields) {
            if (field.indexOf('.') != -1) {
                let fieldArr = field.split('.');
                let childObj = fieldArr[0];
                let nextfields = fieldArr.slice(1);
                let res = this._transferOne(obj[childObj], nextfields, childObj);
                if (trans.hasOwnProperty(childObj)) {                    
                    trans[childObj][nextfields] = res;
                } else {
                    trans[childObj] = {};
                    trans[childObj][nextfields] = res;
                }        
            }

            if (childObj) {
                return obj[field];
            } else {
                trans[field] = obj[field];
            }
        }
        return trans;
    }
}

module.exports = Base;