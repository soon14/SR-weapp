'use strict';
module.exports = app => {

    //=========小程序========================
    //省市区
    app.get('/applet/area/find-province', app.controller.applet.area.findProvince);
    app.get('/applet/area/find-city', app.controller.applet.area.findCity);
    app.get('/applet/area/find-county', app.controller.applet.area.findCounty);

    //用户信息相关
    app.get('/applet/user/get-code', app.controller.applet.user.getCode);
};

