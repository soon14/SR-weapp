'use strict';

const Service = require('egg').Service;

class MerchantService extends Service {
    constructor(ctx) {
        super(ctx);
        const {sequelize,Merchant,MerchantType,MerchantPaymentSettings,MerchantAdmin} = ctx.orm('master');
        this.Merchant = Merchant;
        this.MerchantType = MerchantType;
        this.MerchantPaymentSettings = MerchantPaymentSettings;
        this.MerchantAdmin = MerchantAdmin;
        this.sequelize = sequelize;
        this.cache = this.app.redis;
    }

    async _getByLabel(label) {
        return await this.Merchant.findOne({
            where: {
                brandLabel: label
            },
            raw: true
        });
    }

    async getMerchantFromCache(label) {
        let shopCache = await this.app.redis.get("merchant:" + label);
        if (shopCache === null) {
            let merchant = await this._getByLabel(label);
            if (merchant !== null) {
                await this.app.redis.set("merchant:" + label, JSON.stringify(merchant), "EX", 24*3600);
                return merchant;
            }
            return {};
        }
        return JSON.parse(shopCache);
    }

    async findById(id) {
        try {
            return this.Merchant.findById(id);
        } catch (err) {
            this.ctx.logger.warn('MerchantFindById', err);
            throw new this.app.util.businessError(err.code || '106103005')
        }        
    }

    async findMerchant(id) {
        try {
            return this.Merchant.findOne({
                where: {
                    id: id
                },
                limit: 1,
                attributes: ['id', 'name', 'deleted', 'addr','merchantTypeId'],
                include: [
                    {
                        attributes: ['typeName'],
                        model: this.MerchantType,
                        as: 'MerchantType',
                        where: {
                            deleted: 1
                        },
                        required: false
                    },
                    {
                        attributes: ['mobile'],
                        model: this.MerchantAdmin,
                        as: 'MerchantAdmin',
                        required: false
                    },
                    {
                        attributes: ['account', 'signKey', 'bankOpenUser', 'bank', 'bankNo', 'rate'],
                        model: this.MerchantPaymentSettings,
                        as: 'MerchantPaymentSettings',
                        required: false
                    },
                ]
            });
        } catch (err) {
            this.ctx.logger.warn('MerchantFindById', err);
            throw new this.app.util.businessError(err.code || '106103005')
        }
    }

    async create(data) {
        try {
            await this.sequelize.transaction(async(t) => {
                data.status = 0;
                if(data.account) data.status = 1;
                let result = await this.Merchant.create({
                    merchantTypeId: data.merchantTypeId,
                    name: data.name,
                    brandLabel: 'pay' + data.created + this.ctx.helper.getRandomString(4),
                    addr: data.addr,
                    created: data.created,
                    modified: data.modified,
                    status: data.status,
                });
                data.merchantId = result.id;
                await this._createMerchantAdmin(data,{ transaction: t });
                await this._createMerchantPaymentSettings(data,{ transaction: t });
            });
        } catch (err) {
            this.ctx.logger.warn('MerchantCreate', err);
            throw new this.app.util.businessError(err.code || '106103001');
        }
    }

    async _createMerchantAdmin(params,t) {
        await this._checkMobile(params.mobile);
        let salt = this.ctx.helper.getRandomString(4);
        return this.MerchantAdmin.create({
            merchantId: params.merchantId,
            mobile: params.mobile,
            salt: salt,
            password: await this.ctx.helper.getCryptoPass(params.mobile, salt),
            status: params.status,
            created:params.created,
            modified:params.modified
        },t);
    }

    async _checkMobile(mobile) {
        let ret = await this.MerchantAdmin.findOne({where: {mobile}});
        if(ret === null){
            return true;
        }else {
            throw new this.app.util.businessError('106103009');
        }
    }


    async _createMerchantPaymentSettings(params,t)
    {
        return this.MerchantPaymentSettings.create({
            merchantId: params.merchantId,
            account: params.account,
            signKey: params.signKey,
            rate: params.rate,
            bankOpenUser: params.bankOpenUser,
            bank: params.bank,
            bankNo: params.bankNo,
            created:params.created,
            modified:params.modified,
            type:1,
        },t);
    }

    async update(id, data) {
        try {
            let Merchant = await this.findById(id);

            if (!Merchant) {
                throw new this.app.util.businessError('106103005')
            }

            let merchantData = {};
            if (data.name) merchantData.name = data.name;
            if (data.addr) merchantData.addr = data.addr;
            if (data.merchantTypeId) merchantData.merchantTypeId = data.merchantTypeId;
            if (data.account){
                merchantData.status = 1;
            }

            let merchantPaymentSettingsData = {};
            let merchantAdminData = {};
            if (data.account){
                merchantPaymentSettingsData.account = data.account;
                merchantAdminData.status = 1;
            }
            if (data.signKey) merchantPaymentSettingsData.signKey = data.signKey;
            if (data.bankOpenUser) merchantPaymentSettingsData.bankOpenUser = data.bankOpenUser;
            if (data.bank) merchantPaymentSettingsData.bank = data.bank;
            if (data.bankNo) merchantPaymentSettingsData.bankNo = data.bankNo;
            if (data.rate) merchantPaymentSettingsData.rate = data.rate;

            await this.sequelize.transaction(async(t) => {
                if(JSON.stringify(merchantData) !=="{}"){
                    merchantData.modified = this.ctx.helper.currentTimestamp();
                    let ret = await this.Merchant.update(merchantData, {
                        where: {
                            id
                        }
                    });
                }
                if(JSON.stringify(merchantAdminData) !=="{}"){
                    merchantAdminData.modified = this.ctx.helper.currentTimestamp();
                    let adminRet = await this.MerchantAdmin.update(merchantAdminData, {
                        where: {
                            merchantId: id
                        }
                    });
                }
                if(JSON.stringify(merchantPaymentSettingsData) !=="{}"){
                    let setting = await this.MerchantPaymentSettings.findOne({
                        where: {
                            merchantId: id,
                            type: 1
                        },
                        raw: true
                    });
                    if(setting === undefined){
                        merchantPaymentSettingsData.merchantId = id;
                        merchantPaymentSettingsData.type = 1;
                        merchantPaymentSettingsData.created = this.ctx.helper.currentTimestamp();
                        let set = await this.MerchantPaymentSettings.create(merchantPaymentSettingsData);
                    }else {
                        merchantPaymentSettingsData.modified = this.ctx.helper.currentTimestamp();
                        let set = await this.MerchantPaymentSettings.update(merchantPaymentSettingsData, {
                            where: {
                                id: setting.id
                            }
                        });
                    }
                }
            });
            return true;
        } catch (err) {
            this.ctx.logger.warn('MerchantUpdate', err);
            throw new this.app.util.businessError(err.code || '106103002')
        }
    }

    async findAll(query) {
        try {
            return await this.Merchant.findAll(query);
        } catch (err) {
            this.ctx.logger.warn('MerchantFindAll', err);
            throw new this.app.util.businessError(err.code || '106103004')
        }
    }


    async findAndCountAll(query, pageCount) {
        try {
            query.include = [
                {
                    attributes: ['typeName'],
                    model: this.MerchantType,
                    as: 'MerchantType',
                    where: { deleted: 1 },
                    required: false
                },
                {
                    attributes: ['mobile'],
                    model: this.MerchantAdmin,
                    as: 'MerchantAdmin',
                    required: false
                },
                {
                    attributes: ['account'],
                    model: this.MerchantPaymentSettings,
                    as: 'MerchantPaymentSettings',
                    where: { type: 1, deleted: 1 },
                    required: false
                },
            ];
            let list = await this.Merchant.findAndCountAll(query);
            let page = {
                ...pageCount,
                totalCount: list.count,
                totalPage: Math.ceil(list.count / query.limit)
            };
            return {
                data: list.rows,
                page: page
            };
        } catch (err) {
            this.ctx.logger.warn('MerchantFindAll', err);
            throw new this.app.util.businessError(err.code || '106103004')
        }
    }

    /**
     * 重置密码
     * @param merchantId
     * @param mobile
     * @returns {Promise.<void>}
     */
    async resetPwd(merchantId, mobile) {
        try {
            let admin = await this.MerchantAdmin.findOne({
                where: {
                    merchantId,
                    mobile
                }
            });
            if (admin === undefined) {
                throw new this.app.util.businessError('106103005')
            }
            const salt = this.ctx.helper.getRandomString(6);
            admin.salt = salt;
            admin.password = await this.ctx.helper.getCryptoPass(mobile, salt);
            admin.modified = this.ctx.helper.currentTimestamp();
            await admin.save();
        } catch (err) {
            this.ctx.logger.warn('MerchantPaymentSettings-resetPwd', err);
            throw new this.app.util.businessError(err.code || '106103006')
        }
    }

    /**
     * 状态设置
     * @param merchantId
     * @param mobile
     * @param status
     * @returns {Promise.<void>}
     */
    async statusSet(merchantId, status) {
        try {
            let admin = await this.Merchant.findOne({
                where: {
                    id:merchantId
                }
            });
            if (admin === undefined) {
                throw new this.app.util.businessError('106103008')
            }
            admin.status = status;
            let res = admin.save();
            if (res && status === 2) {
                await this.cache.del("merchantId:" + admin.id);
            }
        } catch (err) {
            this.ctx.logger.warn('Merchant-statusSet', err);
            throw new this.app.util.businessError('106103007')
        }
    }
}
module.exports = MerchantService;
