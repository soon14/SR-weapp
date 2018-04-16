module.exports = {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  schedule: {
    interval: 2000, // 2s 间隔
    type: 'worker', // 指定所有的 worker 都需要执行
    immediate: true,
  },
  // task 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 新的实例
  async task(ctx) {
    // const res = await ctx.curl('http://127.0.0.1:7005/schedule/event/handle', {
    //   method: 'post',
    //   contentType: 'json',
    //   data: { id: 111, class: 'netAdminAasds', fn: 'sendCode' },
    //   timeout: 900
    // });
    //ctx.orm = require('koa-orm')(ctx.app.config.koaOrm).database;
    ctx.orm = ctx.app.globalOrm;
    // return await ctx.service.schedule.manager.consume();
  },
};
