var log4js = require('log4js');

var logUtil = function(req, res, next){
    // 注：配置里的日志目录要先创建，才能加载配置，不然会出异常
    try {
        log4js.configure('config/log4js.json', { reloadSecs: 300 });
        global.logHeper = log4js.getLogger('dateFileLog');
        next();
    } catch (err) {
        //console.log(err);
        next(err);
    }    
};

//封装错误日志
logUtil.logError = function (req, error) {
    if (req && error) {
        logHeper.error(formatError(req, error));
    }
};

//封装响应日志
logUtil.logRequest = function (req) {
    if (req) {
        logHeper.info(formatReqLog(req));
    }
};

//格式化错误日志
var formatError = function (req, err) {
    var logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(req);

    //错误名称
    logText += "error name: " + err.name + "\n";
    //错误信息
    logText += "error message: " + err.message + "\n";
    //错误详情
    logText += "error stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};

//格式化请求日志
var formatReqLog = function (req) {
    var logText = "\n";

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";
    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";
    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";
    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }

    return logText;
}

module.exports = logUtil;

 