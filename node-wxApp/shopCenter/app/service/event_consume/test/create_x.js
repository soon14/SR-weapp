'use strict';

const Service = require('egg').Service;

class CreatXService extends Service {
    constructor(ctx) {
        super(ctx);
        this.fn = ['findProvince', 'findCity'];
        this.forceFn = ['findCounty'];
        this.sourceParamIn = {};
        this.resultData = {};
        this.Area = this.ctx.orm('master').Area;
    }

    async findProvince() {
        return await this.Area.findAll({
            where: {
                areaType: this.Area.AREA_TYPE_PROVINCE
            }
        });

        return await this._output(list);
    }    

    async findCity(pid) {
        return await this.Area.findAll({
            where: {
                areaType: this.Area.AREA_TYPE_CITY,
                pid
            }
        });
    }    

    async findCounty(pid) {
        return await this.Area.findAll({
            where: {                
                areaType: this.Area.AREA_TYPE_COUNTY,
                pid
            }
        });
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
module.exports = CreatXService;
