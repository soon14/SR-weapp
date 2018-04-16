'use strict';
const Service = require('egg').Service;
const uuid = require('uuid');
const request = require('request');

class ExportExcelService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async getAlreadyPayData(data) {
        // data[0] = ['id', 'date', 'time', 'uid', 'mobile', 'name', 'roleName', 'vid', 'vendorName', 'systemType']
        // data[1] = [9,'2016-06-20','16:22:31',1504,'13000000006','呵呵','店长',56,'美容护肤',2,'订单管理','获取订单详情','127.0.0.1']
        // data[2] = [8,'2016-06-20','16:22:31',1504,'13000000006','呵呵','店长',56,'美容护肤',2,'订单管理','获取订单列表','192.168.145.162']
    }
}
module.exports = ExportExcelService;
