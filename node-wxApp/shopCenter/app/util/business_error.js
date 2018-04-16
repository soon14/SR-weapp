'use strict';

const Code = require('./exception.js')

class BusinessError extends Error {
    constructor(code, message) {
        if (!message) {
            message = Code[code];
        }
        super(message);
        this.code = code
    }
}

module.exports = BusinessError;