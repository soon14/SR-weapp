'use strict';

const Service = require('egg').Service;

class AreaService extends Service {
    constructor(ctx) {
        super(ctx);
        const {
            Area
        } = this.ctx.orm('master');
        this.Area = Area;
    }

    async findProvince() {
        return await this.Area.findAll({
            where: {
                areaType: this.Area.AREA_TYPE_PROVINCE
            },
            raw: true
        });

        return await this._output(list);
    }    

    async findCity(pid) {
        return await this.Area.findAll({
            where: {
                areaType: this.Area.AREA_TYPE_CITY,
                pid
            },
            raw: true
        });
    }    

    async findCounty(pid) {
        return await this.Area.findAll({
            where: {                
                areaType: this.Area.AREA_TYPE_COUNTY,
                pid
            },
            raw: true
        });
    }    

    async getAreaStrById(province, city, county) {
        let area = [];
        let list = await this.Area.findAll({
            where: {
                id: {
                    $in: [province, city, county]
                }
            },
            order: [['area_type']],
            raw: true
        })

        for (let item of list) {
            area.push(item.name);
        }

        return area;
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
module.exports = AreaService;
