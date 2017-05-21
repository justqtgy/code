module.exports.hosts = {
    host: '127.0.0.1',
    port: 6666
};

module.exports.dbconfig = {
    user: 'sa',
    password: 'DSERVER@123',
    server: '120.24.68.95', // You can use 'localhost\\instance' to connect to named instance
    database: 'gserver_packet',
    options: {
        encrypt: false // Use this if you're on Windows Azure
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

module.exports.smsResult = {
    "1": "发送成功",
    "-1": "用户名或密码为空",
    "-2": "手机号不正确",
    "-3": "msg参数为空",
    "-4": "短信字数超长",
    "-5": "群发手机号码个数超限（群发一个包最多300个号码）",
    "-6": "黑名单号码",
    "-8": "短信内容含有屏蔽词",
    "-9": "短信账户不存在",
    "-10": "短信账户已经停用",
    "-11": "短信账户余额不足",
    "-12": "密码错误",
    "-16": "IP服务器鉴权错误",
    "-17": "单发手机号码个数超限（单发一次只能提交1个号码）",
    "-19": "短信内容无签名",
    "-21": "提交速度超限",
    "-99": "系统异常"
};