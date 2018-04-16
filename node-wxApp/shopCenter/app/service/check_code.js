'use strict'

const Service = require('egg').Service;

class CheckCodeService extends Service {

    constructor(ctx) {
        super(ctx);
        const {CheckCode} = this.ctx.orm('master');
        this.CheckCode = CheckCode;
    }

    async create(mobile) {
        try {
            let data = new Object;
            data.mobile = mobile;
            data.code = await this.ctx.helper.getRandomString(6, 'num');
            data.validate_date = this.ctx.helper.currentTimestamp()+180;
            data.created = this.ctx.helper.currentTimestamp();
            data.updated = this.ctx.helper.currentTimestamp(); 
            return await this.CheckCode.create(data);
        } catch (err) {
            this.ctx.logger.warn('CheckCodeCreate', err);
            throw new this.app.util.businessError('201103001');
        }
    }

    async update(mobile) {
        try {
            let check_code = await this.findByMobile(mobile);
            if (check_code === null) {
                throw new this.app.util.businessError('201103005');
            }
            let data = new Object;
            data.code = await this.ctx.helper.getRandomString(6, 'num');
            data.validate_date = this.ctx.helper.currentTimestamp()+180;
            data.updated = this.ctx.helper.currentTimestamp(); 
            await this.CheckCode.update(data, {
                where: { mobile:mobile }
            });
        } catch (err) {
            this.ctx.logger.warn('CheckCodeUpdate', err);
            throw new this.app.util.businessError('201103002');
        }
    }

    async findByMobile(mobile) {
        try {
            return await this.CheckCode.findOne({
                where:{
                    mobile:mobile
                },
                raw: true
            });
        } catch(err) {
            this.ctx.logger.warn('CheckCodeFindByMobile', err);
            throw new this.app.util.businessError('201103003');
        }
    }

}

module.exports = CheckCodeService;