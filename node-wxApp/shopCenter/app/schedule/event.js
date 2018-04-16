module.exports = {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  schedule: {
    interval: 2000, // 2s 间隔
    type: 'worker', // 指定所有的 worker 都需要执行
    //immediate: true,
  },
  // task 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 新的实例
  async task(ctx) {
    // start = Date.parse(new Date());
    // if(Date.parse(new Date()) - start > 1800) return true;
    // let mem = process.memoryUsage();
    // let format = function (bytes) {
    //     return (bytes / 1024 / 1024).toFixed(2) + 'MB';
    // };
    // console.log('Process: heapTotal ' + format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
    // console.log('----------------------------------------');
    ctx.orm = ctx.app.globalOrm;
    // return await ctx.service.schedule.manager.run()
  }
};
