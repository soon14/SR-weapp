'use strict';
module.exports = options => {
    return function * appletErrorHandler(next) {
        const {merchant, applet, user} = options;
        let queryPath = this.helper.getQueryPath();
        if (merchant.includes(queryPath)) {
            //TODO 商家信息赋值
            this.state.merchant = {
                "id": 123
            };
            this.setData('merchantId', {"id": 123});
        }
        if (applet.includes(queryPath)) {
            //TODO 小程序用户赋值
        }
        if (user.includes(queryPath)) {
            //TODO 用户登录赋值
        }
        yield next;
    };
};