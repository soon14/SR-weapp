'use strict';

const Service = require('egg').Service;

class EventRecord extends Service {
    constructor(ctx) {
        super(ctx);
        this.EventRecord = this.ctx.orm('master').EventRecord;
        this.EventRecordConsumeList = this.ctx.orm('master').EventRecordConsumeList;
    }

    //get ready event
    async findReadyRecord(where, offset, limit) {
        return await this.EventRecord.findAll({
            where: where,
            offset: offset,
            limit: limit,
            order: [['created', 'ASC']],
            raw: true
        });
    }

    //get consume list
    async findConsumeList(where, offset, limit) {
        return await this.EventRecordConsumeList.findAll({
            where: where,
            offset: offset,
            limit: limit,
            order: [['created', 'ASC']],
            raw: true
        });
    }
}
module.exports = EventRecord;