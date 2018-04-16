'use strict';
module.exports = options => {
    return async function bossParse(ctx, next) {
        let queryPath = ctx.helper.getQueryPath();
        //无需登录路由访问
        if (!options.loginNoNeed.includes(queryPath)) {
            let loginKey = ctx.helper.getSelfHerder('login-key');
            if (!loginKey && options.loginCheckByGetParameter && options.loginCheckByGetParameter.includes(queryPath) && ctx.request.method === 'GET') {
                loginKey = ctx.request.query['login-key'];
            }
            if (!loginKey) {
                ctx.body = ctx.out.error(401, "must login first");
                return
            }
            let ip = ctx.helper.getSelfHerder('x-real-ip') ? ctx.helper.getSelfHerder('x-real-ip') : ctx.request.ip;
            let adminInfo = await ctx.service.bossAdmin.getAdminFromCache(loginKey, ip);
            if (adminInfo.id === undefined) {
                ctx.body = ctx.out.error(401, "登录超时或已被登出");
                return
            }
            ctx.setData('bossId', adminInfo.id);
        }
        await next();
    };
};