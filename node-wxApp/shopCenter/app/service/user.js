'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    constructor(ctx) {
        super(ctx);
        const {
            User
        } = this.ctx.orm('master');
        this.User = User;
    }

    async getCode() {
        return {name:1};
    }    

  
  

  
    /**
     * 输出数组格式(后台用)
     * 
     * @param {any} list 
     * @returns 
     * @memberof AreaService
     */
    async output(list) {
        let output = {};
        for (let item of list) {
            output[item.id] = item;
        }
        return output;
    }
}
module.exports = UserService;
