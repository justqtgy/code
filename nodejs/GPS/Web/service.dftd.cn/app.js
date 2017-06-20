var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//存储cookies
var session = require('express-session');
//将session持久化到reids中
//var redisStore = require('connect-redis')(session); //npm install connect-redis express-session
//var options = require('./config/settings').redisSession;

var log4js = require('log4js');

var index = require('./routes/index');
var users = require('./routes/users');
var ctrl = require('./controller');


var app = express();


// 注：配置里的日志目录要先创建，才能加载配置，不然会出异常
try {
    log4js.configure('config/log4js.json', { reloadSecs: 300 });
    global.log = log4js.getLogger('dateFileLog');

} catch (err) {
    console.log(err);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: true, secret: 'dftd' /*, store: new redisStore(options)*/ }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Views', express.static(__dirname + '/Views'));

//总是检查是否登录
app.all('*', users.requireAuthentication);


app.use('/', index);
app.use('/users', users);
ctrl.init_route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);

    // if (!req.session.user) {
    //     if (req.url == "/login") {
    //         next(); //如果请求的地址是登录则通过，进行下一个请求
    //     } else {
    //         res.redirect('/login');
    //     }
    // } else if (req.session.user) {
    //     next();
    // }

    req.session._garbage = Date();
    req.session.touch();
    next();
});

// error handler
app.use(function(err, req, res, next) {
    //写入日志
    log.error('common error :', err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;