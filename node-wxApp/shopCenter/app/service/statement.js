
'use strict';
const Service = require('egg').Service;


class StatementService extends Service {
    constructor(ctx) {
        super(ctx);
        const { sequelize, Statement, SchoolOrderDetail, Merchant } = this.ctx.orm('master');
        this.Statement = Statement;
        this.sequelize = sequelize;
        this.SchoolOrderDetail = SchoolOrderDetail;
        this.Merchant = Merchant;

    }

    /**
     * 近十天数据
     */
    async countPayByRecent() {
        let condition = {
            payStatus: this.SchoolOrderDetail.PAY_STATUS_PAY,
        };
        //今日缴费信息
        let moment = require('moment');
        let time = moment();
        moment.locale('zh-cn');
        let endTime = parseInt((new Date(time.format('YYYY-MM-DD') + ' 23:59:59').getTime()).toString().substr(0, 10));
        let startTime = parseInt(new Date(time.format('YYYY-MM-DD') + ' 00:00:00').getTime().toString().substr(0, 10));

        //今日数据
        condition.payTime = {
            $between: [startTime, endTime]
        }

        let today = [{
            payAmount: 0,
            time: startTime,
        }]
        today[0].payAmount = await this.ctx.service.schoolOrderDetail.getAlreadyPayInfo(condition);
        //前9天数据
        let data = {}, result = [];
        for (let i = 9; i > 0; i--) {
            data = await this._getOneDayDate(i);
            result.push(data);
        }
        return result.concat(today);

    }

    async _getOneDayDate(day) {
        let moment = require('moment');
        let time = moment();
        moment.locale('zh-cn');
        let yesterday = time.subtract(day, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
        let startTime = parseInt(new Date(yesterday + ' 00:00:00').getTime().toString().substr(0, 10));
        let where = {
            startTime: startTime
        };
        let query = `SELECT CONVERT(SUM(pay_amount),SIGNED) as payAmount,start_time as time`;
        let from = ` FROM statement  where start_time=:startTime`;
        query = query + from;
        let data = await this.sequelize.query(query, { replacements: where, type: this.sequelize.QueryTypes.SELECT });
        let result = {
            payAmount: 0,
            time: startTime
        };
        if (data && data.length > 0 && data[0].payAmount) {
            result.payAmount = parseInt(data[0].payAmount);
        }
        return result;
    }

    /**
    * 近期数据统计
    */
    async countByRecent() {
        let result = {
            todayPayAmount: 0,
            yesterdayPayAmount: 0,
            oneMonthPayAmount: 0
        };
        let condition = {
            payStatus: this.SchoolOrderDetail.PAY_STATUS_PAY,
        };
        //今日缴费信息
        let moment = require('moment');
        let time = moment();
        moment.locale('zh-cn');
        let endTime = parseInt((new Date(time.format('YYYY-MM-DD') + ' 23:59:59').getTime()).toString().substr(0, 10));
        let startTime = parseInt(new Date(time.format('YYYY-MM-DD') + ' 00:00:00').getTime().toString().substr(0, 10));
        condition.payTime = {
            $between: [startTime, endTime]
        }
        result.todayPayAmount = await this.ctx.service.schoolOrderDetail.getAlreadyPayInfo(condition);

        //昨日收费
        let yesterday = time.subtract(1, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
        let yesterdayStartTime = parseInt(new Date(yesterday + ' 00:00:00').getTime().toString().substr(0, 10));
        let yesterdayendTime = parseInt(new Date(yesterday + ' 23:59:59').getTime().toString().substr(0, 10));
        let where = {
            startTime: {
                $between: [yesterdayStartTime, yesterdayendTime]
            },
            endTime: {
                $between: [yesterdayStartTime, yesterdayendTime]
            }
        }
        result.yesterdayPayAmount = await this._getSumpayAmount(where);

        //近一个月
        let lastDay = time.format("YYYY-MM-DD") + ' 23:59:59';
        let firstDay = time.subtract(30, 'days').format('YYYY-MM-DD') + ' 0:0:0';
        let monthEndTime = parseInt((new Date(lastDay).getTime()).toString().substr(0, 10));
        let monthStartTime = parseInt(new Date(firstDay).getTime().toString().substr(0, 10));
        let whereMonth = {
            startTime: {
                $between: [monthStartTime, monthEndTime]
            },
            endTime: {
                $between: [monthStartTime, monthEndTime]
            }
        }
        result.oneMonthPayAmount = await this._getSumpayAmount(whereMonth);
        return result;
    }

    /**
     * 获取已支付的金额总和
     */
    async _getSumpayAmount(condition) {
        let payAmount = 0;
        const statement = await this.Statement.sum('payAmount', {
            where: condition
        });

        if (statement) {
            payAmount = statement;
        }

        return payAmount;
    }

    /**
     * 数据统计
     */
    async countAll(merchantName, startTime, endTime, merchantType) {
        let condition = {};
        let query = `SELECT SUM(pay_amount) as totalPayAmount,SUM(pay_num) as totalPayNum,SUM(factorage) as totalFactorage`;
        let from = ` FROM statement where 1`;
        query = query + from;
        if (merchantName) {
            query = query + ' and merchant_name like "%' + merchantName + '%"';
        }

        if (startTime && endTime) {
            let times = ' BETWEEN ' + startTime + ' and ' + endTime;
            query = query + ' and start_time' + times + ' and end_time' + times;
        }

        if (merchantType) {
            condition.merchantType = merchantType;
            query = query + ' and merchant_type=:merchantType';
        }

        let data = await this.sequelize.query(query, { replacements: condition, type: this.sequelize.QueryTypes.SELECT });

        let result = {
            totalPayAmount: 0,
            totalPayNum: 0,
            totalFactorage: 0
        };
        if (data && data.length > 0 && data[0].totalPayAmount) {
            result.totalPayAmount = parseInt(data[0].totalPayAmount);
            result.totalPayNum = parseInt(data[0].totalPayNum);
            result.totalFactorage = data[0].totalFactorage;
        }
        return result;
    }

    /**
     * 学生已缴费项目列表
     */
    async getStatementList(merchantName, startTime, endTime, merchantType, limit, offset, currentPage) {
        let statementList = await this._getStatement(merchantName, startTime, endTime, merchantType, limit, offset);
        let page = {
            currentPage: currentPage,
            currentCount: limit,
            totalCount: statementList.count,
            totalPage: Math.ceil(statementList.count / limit)
        };
        return { data: statementList.list, page: page };
    }

    /**
     * 列表导出
     */
    async exportsStatementList(params) {
        let data = await this._getStatement(params.merchantName, parseInt(params.startTime), parseInt(params.endTime), parseInt(params.merchantType));
        let moment = require('moment');
        let time = moment();
        moment.locale('zh-cn');
        let nowTime = time.format('YYYY-MM-DD HH:mm');
        let arr = [
            ['导出时间:' + nowTime],
            ['行业类型', '商户类型', '商户名称', '缴费笔数', '缴费金额', '费率金额']
        ];
        let result = [];
        if (data && data.list.length > 0) {
            for (let key in data.list) {
                result[key] = [
                    '缴费',
                    data.list[key].merchantTypeName,
                    data.list[key].merchantName,
                    data.list[key].payNum,
                    data.list[key].payAmount / 100,
                    data.list[key].factorage / 100,
                ]
            }
        }
        return arr.concat(result);
    }

    async _getStatement(merchantName, startTime, endTime, merchantType, limit, offset) {
        let condition = {};
        let query = `SELECT a.id,a.merchant_id as merchantId ,a.merchant_type as merchantType,b.type_name as merchantTypeName,a.merchant_name as merchantName,CONVERT(SUM(a.pay_num),SIGNED) as payNum,CONVERT(SUM(a.pay_amount),SIGNED) as payAmount,SUM(a.factorage) as factorage`;
        let queryCount = `SELECT COUNT(DISTINCT a.merchant_id) AS count`;
        let from = ` FROM statement as a LEFT JOIN merchant_type AS b ON a.merchant_type = b.id WHERE 1`;
        query = query + from;
        queryCount = queryCount + from;
        if (merchantName) {
            queryCount = queryCount + ' and a.merchant_name like "%' + merchantName + '%"';
            query = query + ' and a.merchant_name like "%' + merchantName + '%"';
        }

        if (startTime && endTime) {
            let times = ' BETWEEN ' + startTime + ' and ' + endTime;
            queryCount = queryCount + ' and a.start_time ' + times + ' and a.end_time ' + times;
            query = query + ' and a.start_time ' + times + ' and a.end_time ' + times;
        }

        if (merchantType) {
            condition.merchantType = merchantType;
            queryCount = queryCount + ' and a.merchant_type=:merchantType';
            query = query + ' and a.merchant_type=:merchantType';
        }
        let group = ` GROUP BY a.merchant_id`;
        query = query + group;
        queryCount = queryCount + group;
        let count = 0;

        if (limit) {
            query = query + ' limit ' + offset + ',' + limit;
            const countInfo = await this.sequelize.query(queryCount, { replacements: condition, type: this.sequelize.QueryTypes.SELECT });
            if (countInfo.length > 0) {
                count = countInfo[0].count;
            }
        }
        let list = await this.sequelize.query(query, { replacements: condition, type: this.sequelize.QueryTypes.SELECT });
        let price = 0;
        return { list: list, count: count };
    }

    /**
     * 近十天数据
     */
    async countByMerchant() {
        let condition = {};
        let moment = require('moment');
        let time = moment();
        moment.locale('zh-cn');
        let todayStartTime = parseInt(new Date(time.format('YYYY-MM-DD') + ' 00:00:00').getTime().toString().substr(0, 10));
        let todayEndTime = parseInt((new Date(time.format('YYYY-MM-DD') + ' 23:59:59').getTime()).toString().substr(0, 10));
        let tenStartTime = todayStartTime - 86400 * 24 * 10;
        let recent = [{
            today: await this.Merchant.count({ where: { created: { $between: [todayStartTime, todayEndTime] } } }),
            mouth: await this.Merchant.count({ where: { created: { $between: [todayStartTime - 30 * 24 * 3600, todayEndTime] } } }),
            total: await this.Merchant.count()
        }];

        let tenData = [];
        for (let i = 1; i <= 10; i++) {
            condition.created = {
                $between: [tenStartTime, todayEndTime]
            };
            const merchantNum = await this.Merchant.count({ where: condition });
            let one = { merchantNum: merchantNum, time: todayStartTime };
            tenData.push(one);
            todayEndTime = todayEndTime - 86400;
            todayStartTime = todayStartTime - 86400;
        }
        let data = {};
        data.tenData = tenData.sort(function (a, b) {
            return a.time - b.time;
        });
        data.recent = recent;
        return data;
    }
}
module.exports = StatementService;
