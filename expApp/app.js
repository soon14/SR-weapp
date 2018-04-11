// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 加载路由控制
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// 创建项目实例
const app = express();

// view engine setup 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 定义icon图标
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// 定义日志和输出级别
app.use(logger('dev'));

// 定义数据解析器
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 定义cookie解析器
app.use(cookieParser());

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler 404错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 500错误处理和错误堆栈跟踪
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 输出模型app
module.exports = app;
