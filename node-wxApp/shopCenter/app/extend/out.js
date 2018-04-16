'use strict';

class Out {
    success(data, page) {
        return {
            "errcode": "0",
            "errmsg": "ok",
            "data": data,
            "page": page
        }
    }
    error(errcode, errmsg){
        return {
            "errcode": errcode === undefined ? 500 : errcode,
            "errmsg": errmsg
        }
    }
}
module.exports = Out;