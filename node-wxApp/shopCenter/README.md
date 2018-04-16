# payment



## QuickStart

```bash
$ npm install
```

publish your framework to npm, then change app's dependencies:

```js
// {app_root}/index.js
require('payment').startCluster({
  baseDir: __dirname,
  // port: 7001, // default to 7001
});

```
## 框架改动
### 1.微信回调xml数据解析
微信返回的是xml数据因此加了中间件处理。这个中间件必须在框架默认的bodyParser前面所以修改了app.js
```js
app.config.coreMiddleware.unshift('xmlBody');
```
相关配置还是放在config/config.default.js
```js
  //xml数据过滤配置 插件放到app.js里面
  config.xmlBody = {
    //limit: 128,
    encoding: 'utf8', // lib will detect it from `content-type` 
    xmlOptions: {
        explicitArray: false
    },
    onerror: (err, ctx) => {
        ctx.throw(err.status, err.message);
    }
  }
```

### 2.model使用helper函数
egg框架model不能使用helper对象（系统默认的helper是挂载在ctx下面的）所以加了个util注册到app对象下（model里面注入了egg的app对象）
app.js
```js
    const utilDirectory = path.join(app.config.baseDir, 'app/util');
    app.loader.loadToApp(utilDirectory, 'util');
```
相应文件放在app/util/下面
注意下引用的时候是app.util.helper.xxx() 如果util继续加文件如aaa.js 引用就是app.util.aaa.xxx()

### 3.form表单的使用
egg默认没有form，为了方便我们自己定义了form并挂载到ctx（每个请求是独立的）对象上
app.js
```js
    const paramsDirectory = path.join(app.config.baseDir, 'app/form');
    app.loader.loadToContext(paramsDirectory, 'form'); 
```
相应文件放在app/form/
引用同上，注意命名规则，文件夹的下划线转换成调用是驼峰。
校验规则查看https://github.com/node-modules/parameter

### 4.model的关系定义
model因为不是原生的使用模式，不能直接在model里面定义。所以加了专门的定义文件来处理
app.js
```js
    const releationFile = path.join(app.config.baseDir, 'app/model_relation/model_relation.js');
    app.loader.loadFile(releationFile);
```
相应文件放在app/form/
引用同上，注意命名规则，文件夹的下划线转换成调用是驼峰。

### 5.model的生成
生成model使用sequelize-auto 
指令
sequelize-auto sequelize-auto -o "mymodel" -d payment -h 10.100.200.15 -u payment@% -p 3306 -x payment_ -e mysql

安装下 生成完后

拷贝现有app/model下的area.js 重命名为你要生成的model名（例如login_log.js）

将mymodel下login_log.js里的模型字段 拷贝替换app/model/login_log.js中的字段

最后修改define 以及tablename

注意model命名为驼峰 model文件名为下划线


### 6.业务异常类
内置的Error类，使用new 实例化时只能初始message错误消息，因此重新定义了BusinessError类，此类继承了Error类，通过实例化可传入code码（字符串类型）和message，另外此类文件中引入了文件business_error.js（文中初始化了code和message的对应关系的集合）
相应文件放在app/util/下面
```js
    new this.app.util.businessError('101101002');
    //或者
    new this.app.util.businessError('101101002', '自定义说明');
```

### 7.对外接口统一数据格式输出类
为了规范接口输出的数据格式而声明的类
```js
//无错误信息时
// {
//   "errcode": "0",
//   "errmsg": "ok",
//   "data": data,
//   "page": page
// }
this.ctx.out.success(result.data)
this.ctx.out.success(result.data, result.page) //有分页数据时

//有错误信息时
// {
//   "errcode": "10002",
//   "errmsg": "form校验出错"
// }
this.ctx.out.error(errcode, errmessage);
```
### 8.内存泄漏检测
```js
npm install memwatch-next
npm install heapdump
```
```js
const memwatch = require('memwatch-next');
const heapdump = require('heapdump');
memwatch.on('leak', function(info) {
    console.error(info);
    var file = 'D:/nodejs/payment-api-nodejs/logs/myapp' + process.pid + Date.now() + '.heapsnapshot';
    heapdump.writeSnapshot(file, function(err){
        if (err) console.error(err);
        else console.error('Wrote snapshot: ' + file);
    });
});

//查看使用内存
let mem = process.memoryUsage();
let format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
};
console.log('Process: heapTotal ' + format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
console.log('----------------------------------------');
```