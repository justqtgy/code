var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//存储cookies
var session = require('express-session');
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
app.use(session({ resave: true, saveUninitialized: false, secret: 'gsmy-sj5.0' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Views', express.static(__dirname + '/Views'));

//总是检查是否登录
//app.all('*', users.requireAuthentication);

app.use('/', index);
app.use('/users', users);
ctrl.init_route(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;