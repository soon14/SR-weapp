'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {

    async getCode() {
        try {
            let list = await this.ctx.service.user.getCode();
            return this.ctx.body = this.ctx.out.success(list);
        } catch (err) {
            return this.ctx.body = this.ctx.out.error(err.code, err.message);
        }
    }   
    
}

module.exports = UserController;