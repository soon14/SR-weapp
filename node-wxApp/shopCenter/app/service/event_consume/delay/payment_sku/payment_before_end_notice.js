'use strict';

const Service = require('egg').Service;

class PaymentBeforeEndNoticeService extends Service {
    constructor(ctx) {
        super(ctx);

        const {
            SchoolStudent,
            SchoolPaymentSku,
            SchoolPaymentSkuToStudent
        } = this.ctx.orm('master');

        this.SchoolPaymentSkuToStudent = SchoolPaymentSkuToStudent;
        this.SchoolPaymentSku = SchoolPaymentSku;
        this.SchoolStudent = SchoolStudent;

        this.fn = [];
        this.forceFn = ['sendMsg'];
        this.sourceParamIn = {};
        this.resultData = {};
    }

    async sendMsg() {
        //test 197
        let paymentSkuId = this.resultData.paymentSkuId;
        if (!paymentSkuId) {
            throw new this.app.util.businessError('paymentSkuId不存在');
        }

        let paymentSku = await this.SchoolPaymentSku.findById(paymentSkuId);

        let school = await this.ctx.service.school.findById(paymentSku.schoolId);

        if (!paymentSku) {
            throw new this.app.util.businessError('缴费项目不存在');
        }

        let toStuList = await this.SchoolPaymentSkuToStudent.findAll({
            where: {
                schoolPaymentSkuId: paymentSkuId
            }
        });

        if (!toStuList.length) {
            throw new this.app.util.businessError('未找到项目相关学生');
        }

        let stuIds = [];
        for (let stu of toStuList) {
            stuIds.push(stu.studentId);
        }

        let studentList = await this.SchoolStudent.findAll({
            where: {
                id: {
                    $in: stuIds
                }
            }
        });

        if (!studentList.length) {
            throw new this.app.util.businessError('未找到相关学生');
        }

        let studentMap = new Map();
        for (let stu of studentList) {
            studentMap.set(stu.id, stu.name);
        }

        let userList = await this.ctx.service.userToStudent.findUsersByStudentIds(stuIds);
        
        if (!userList.length) {
            throw new this.app.util.businessError('未找到相关用户');
        }

        let uids = [];
        let userMap = new Map();
        for (let user of userList) {
            uids.push(user.uid);
            userMap.set('stuid' + user.studentId + 'uid' + user.uid, user.uid);
        }

        let uidNames = [];        
        for (let [stuId, keyword2] of studentMap) {
            for (let uidItem of uids) {            
                let uid = userMap.get('stuid' + stuId + 'uid' + uidItem);
                if (!uid) continue;
    
                uidNames.push({
                    uid,
                    keyword2
                });
            }
        }

        const commonKeyWords = {
            keyword1: school.schoolName || '-',
            keyword3: paymentSku.name || '-',
            keyword4: this.ctx.helper.formatMoney(paymentSku.amount) || '0.00',
            keyword5: this.ctx.helper.dateFormat(new Date(paymentSku.endTime * 1000), 'yyyy年MM月dd日') || '-'
        }
        console.log(uidNames)
        this.ctx.service.sendTemplate.send('payment_notices', paymentSku.merchantId, uidNames, commonKeyWords);
    }
}

module.exports = PaymentBeforeEndNoticeService;