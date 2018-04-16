'use strict';
module.exports = options => {
    return async function netAdminParse(ctx, next) {
        let queryPath = ctx.helper.getQueryPath();
        //无需登录路由访问
        // if (!options.loginNoNeed.includes(queryPath)) {
        //     let loginKey = ctx.helper.getSelfHerder('login-key');
        //     if (!loginKey && options.loginCheckByGetParameter && options.loginCheckByGetParameter.includes(queryPath) && ctx.request.method === 'GET') {
        //         loginKey = ctx.request.query['login-key'];
        //     }
        //     if (!loginKey) {
        //         ctx.body = ctx.out.error(401, "must login first");
        //         return
        //     }
        //     let ip = ctx.helper.getSelfHerder('x-real-ip') ? ctx.helper.getSelfHerder('x-real-ip') : ctx.request.ip;
        //     let adminInfo = await ctx.service.netAdmin.getAdminFromCache(loginKey, ip);
        //     if (adminInfo.id === undefined) {
        //         ctx.body = ctx.out.error(401, "登录超时或已被登出");
        //         return
        //     }
        //     //ctx.setData('schoolId', adminInfo.schoolId);
        //     ctx.setData('merchantId', adminInfo.merchantId);
        //     ctx.setData('netAdminId', adminInfo.id);
        //     ctx.setData(adminInfo.nets[adminInfo.netsOffset].netType + 'Id', adminInfo.nets[adminInfo.netsOffset].netId);
        // }
        ctx.setData('schoolId', 1);
        ctx.setData('merchantId', 1);
        ctx.setData('netAdminId', 1);
        await next();
    };
};