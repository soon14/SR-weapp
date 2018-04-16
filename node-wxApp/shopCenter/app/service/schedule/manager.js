'use strict'

const Service = require('egg').Service;

class ManagerService extends Service {

    constructor(ctx) {
        super(ctx);
        this.EventRecord = this.ctx.orm('master').EventRecord;
        this.EventRecordConsumeList = this.ctx.orm('master').EventRecordConsumeList;
        this.count = 50;
    }

    //add an event for consume return eventId or 0
    //consume class basicPath is this.ctx.service.eventConsume (delay > 0 is this.ctx.service.eventConsume.delay),eventCategory can be empty string(''),if not will change basicPath to basicPath[eventCategory]
    //consume class must declare attributes(fn\forceFn Array,sourceParamIn\resultData Object)
    async add(merchantId, subId, eventName, eventCategory, sourceUrl, sourceParamIn, resultData, delay) {
        try {
            let event = { merchantId: merchantId, subId: subId, eventName: eventName, eventCategory: eventCategory, sourceUrl: sourceUrl, sourceParamIn: JSON.stringify(sourceParamIn), resultData: JSON.stringify(resultData) };
            let now = this.ctx.helper.currentTimestamp();
            event.grayType = this.ctx.app.config.grayType;
            event.delay = now + delay;
            event.created = now;
            event.modified = now;
            let record = await this.EventRecord.create(event);
            return record.id;
        } catch (err) {
            this.ctx.logger.warn('addEventError', err);
            //throw new this.app.util.businessError('201103001');
        }
        return 0;
    }

    //run event and add to consume list
    async run() {
        let now = this.ctx.helper.currentTimestamp();
        let page = 0;
        let where = {
            grayType: this.ctx.app.config.grayType,
            delay: {
                $lte: now,
                $gt: now - 10 * 60
            },
            status: 1
        };
        let start = new Date();
        let list = [];
        do {
            if (list.length > 0) {
                where.id = { $gt: list[list.length - 1].id }
            }
            list = await this.ctx.service.eventRecord.findReadyRecord(where, page * this.count, this.count);
            if (list.length < 1) return true;
            for (let k in list) {
                let event = list[k];
                let lock = await this.lockSource('ev_run', event.id, 60);
                //concurrent job happended, task exit
                if (!lock) return true;
                this.saveEventConsumeList(event, now);
            }
        } while (new Date() - start < 1900)
        return true;
    }

    //save consume data
    async saveEventConsumeList(event, now) {
        try {
            let servicePath = this.ctx.service.eventConsume;
            if (event.delay !== event.created) {
                servicePath = this.ctx.service.eventConsume.delay;
            }
            if (event.eventCategory !== '') {
                servicePath = servicePath[event.eventCategory];
            }
            let consume = { eventId: event.id, merchantId: event.merchantId, consumeName: event.eventName, grayType: event.grayType, created: now, modified: now };
            let service = servicePath[event.eventName];
            await this.ctx.orm('master').sequelize.transaction(async (t) => {
                for (let k in service.fn) {
                    consume.consumeMethod = service.fn[k];
                    await this.EventRecordConsumeList.create(consume, { transaction: t });
                }
                for (let k in service.forceFn) {
                    consume.consumeMethod = service.forceFn[k];
                    consume.forceType = 1;
                    await this.EventRecordConsumeList.create(consume, { transaction: t });
                }
                await this.EventRecord.update({ status: 3, modified: now }, { where: { id: event.id }, transaction: t });
            });
        } catch (err) {
            this.ctx.logger.warn('addEventConsumeListError' + event.id, err);
            await this.EventRecord.update({ status: 4, modified: now }, { where: { id: event.id } });
            return false;
        }
        return true;
    }

    //consume the job
    async consume() {
        let now = this.ctx.helper.currentTimestamp();
        let page = 0;
        let where = {
            grayType: this.ctx.app.config.grayType,
            created: {
                $lte: now,
                $gt: now - 15 * 60
            },
            $or: [
                { processStatus: 0 },
                { $and: [{ processStatus: 2 }, { forceType: 1 }, { tryTimes: { $lt: 3 } }] }
            ],
            processStatus: { $not: 1 }
        };
        let start = new Date();
        let list = [];
        let event = {};
        do {
            if (list.length > 0) {
                where.id = { $gt: list[list.length - 1].id }
            }
            list = await this.ctx.service.eventRecord.findConsumeList(where, page * this.count, this.count);
            if (list.length < 1) return true;
            for (let k in list) {
                let consume = list[k];
                if (typeof event[consume.eventId] === 'undefined') {
                    event[consume.eventId] = await this.EventRecord.findOne({ where: { id: consume.eventId }, raw: true })
                }
                let lock = await this.lockSource('con_run', consume.id, 4 * 60);
                //concurrent job happended, task exit
                if (!lock) return true;
                this.consumeEvent(event[consume.eventId], consume, now);
            }
        } while (new Date() - start < 1900)
        return true;
    }

    //consume data
    async consumeEvent(event, consume, now) {
        let sequelize = this.ctx.orm('master').sequelize;
        try {
            let servicePath = this.ctx.service.eventConsume;
            if (event.delay !== event.created) {
                servicePath = this.ctx.service.eventConsume.delay;
            }
            if (event.eventCategory !== '') {
                servicePath = servicePath[event.eventCategory];
            }
            let service = servicePath[event.eventName];
            service.sourceParamIn = JSON.parse(event.sourceParamIn);
            service.resultData = JSON.parse(event.resultData);
            service[consume.consumeMethod]();
            await this.EventRecordConsumeList.update({ processStatus: 1, tryTimes: sequelize.literal('try_times+1'), modified: now }, { where: { id: consume.id } });
        } catch (err) {
            this.ctx.logger.warn('eventConsumeError' + event.id + '_' + consume.id, err);
            await this.EventRecordConsumeList.update({ processStatus: 2, tryTimes: sequelize.literal('try_times+1'), modified: now }, { where: { id: consume.id } });
            return false;
        }
        return true;
    }

    //lock source prevent from concurrent job
    async lockSource(type, id, expire) {
        var lock = await this.app.redis.set(type + ':' + id, 1, 'ex', expire, 'nx');
        if (lock === "OK") {
            return true;
        }
        return false;
    }
}

module.exports = ManagerService;