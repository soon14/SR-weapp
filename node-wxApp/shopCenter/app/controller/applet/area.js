'use strict';
const Controller = require('egg').Controller;

class AreaController extends Controller {

    async findProvince() {
        try {
            let list = await this.ctx.service.area.findProvince();
            return this.ctx.body = this.ctx.out.success(list);
        } catch (err) {
            return this.ctx.body = this.ctx.out.error(err.code, err.message);
        }
    }   
    
    async findCity() {
        try {
            let list = await this.ctx.service.area.findCity(this.ctx.query.pid);
            return this.ctx.body = this.ctx.out.success(list);
        } catch (err) {
            return this.ctx.body = this.ctx.out.error(err.code, err.message);
        }
    }

    async findCounty() {
        try {
            let list = await this.ctx.service.area.findCounty(this.ctx.query.pid);
            return this.ctx.body = this.ctx.out.success(list);
        } catch (err) {
            return this.ctx.body = this.ctx.out.error(err.code, err.message);
        }
    }
}

module.exports = AreaController;