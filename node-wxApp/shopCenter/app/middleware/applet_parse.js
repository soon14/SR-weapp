'use strict';
module.exports = options => {
    return async function appletParse(ctx, next) {
        const {merchant, applet, user} = options;
        // let queryPath = ctx.helper.getQueryPath();
        // if (!merchant.includes(queryPath)) {
        //     const label = ctx.helper.getSelfHerder('brand-label');
        //     if (!label) {
        //         ctx.body = ctx.out.error(500, "获取信息失败");
        //         return
        //     }
        //     let merchantInfo = await ctx.service.merchant.getMerchantFromCache(label);
        //     if (merchantInfo.id === undefined) {
        //         ctx.body = ctx.out.error(500, "获取信息失败");
        //         return
        //     }
        //     ctx.setData('merchantId', merchantInfo.id);
        // }
        // if (!applet.includes(queryPath)) {
        //     const sessionKey = ctx.helper.getSelfHerder('session-key');
        //     const label = ctx.helper.getSelfHerder('brand-label');
        //     if (!sessionKey) {
        //         ctx.body = ctx.out.error(401, "user session missing");
        //         return
        //     }
        //     let thirdPlatUsersInfo = await ctx.service.thirdPlatUsers.GetPlatUserFromCache(label, sessionKey);
        //     if (thirdPlatUsersInfo.id === undefined) {
        //         ctx.body = ctx.out.error(401, "applet user missing");
        //         return
        //     }
        //     ctx.setData('uid', thirdPlatUsersInfo.id);
        //     ctx.setData('nickname', thirdPlatUsersInfo.nickname);
        // }
        // if (!user.includes(queryPath)) {
        //     const userToken = ctx.helper.getSelfHerder('user-token');
        //     const label = ctx.helper.getSelfHerder('brand-label');
        //     if (!userToken) {
        //         ctx.body = ctx.out.error(403, "plat1 user missing");
        //         return
        //     }
        //     let selfUsersInfo = await ctx.service.users._getSelfUserFromCache(label, userToken);
        //     if (selfUsersInfo.id === undefined) {
        //         ctx.body = ctx.out.error(403, "plat2 user missing");
        //         return
        //     }
        //     ctx.setData('self_uid', selfUsersInfo.id);
        // }
        //test
        // ctx.setData('uid',6);
        // ctx.setData('self_uid', 6);
        // ctx.setData('merchantId', 2);
        await next();
    };
};