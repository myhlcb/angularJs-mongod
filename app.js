var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var settings = require('./settings');
//引入flash模块
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//修改routes
var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'fav.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//使用flash
app.use(flash());
//使用session
app.use(
  session({
    //加密，对session加密处理
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
    store: new MongoStore({
      url: 'mongodb://localhost/lastblog',
    }),
    resave: false,
    saveUninitialized: true,
  }),
);
// app.use('/', index);
// app.use('/users', users);
//在本地存储一下user,success,error三个变量
//app.use(function (req,res,next) {
//  res.locals.user=req.session.user;
//  res.locals.success=req.flash('success').toString();
//  res.locals.error=req.flash('error').toString()
//next()
//})
//第三步，将应用实例传到路由文件中使用
routes(app);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//var err = new Error('Not Found');
//err.status = 404;
//next(err);
//});

// error handler
//app.use(function(err, req, res, next) {
//// set locals, only providing error in development
//res.locals.message = err.message;
//res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//// render the error page
//res.status(err.status || 500);
//res.render('error');
//});
//增加一个启动操作
app.listen(3000, function() {
  console.log('okok');
});
module.exports = app;
