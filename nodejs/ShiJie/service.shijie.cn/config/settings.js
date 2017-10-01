module.exports.dbconfig = {
    user: 'sa',
    password: 'DSERVER@123',
    server: '120.24.68.95', // You can use 'localhost\\instance' to connect to named instance
    database: 'ShiJie',
    options: {
        encrypt: false // Use this if you're on Windows Azure
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

module.exports.redisSession = {
    "host": "127.0.0.1",
    "port": "6379",
    "ttl": 60 * 60 * 24 * 30, //session的有效期为30天(秒)
}

module.exports.pricing = {
    "tanhua":{
        "price":110,
        "first":20,
        "amount":2200,
        "number":20
    },
    "bangyan":{
        "price":90,
        "first":80,
        "amount":7200,
        "number":40
    },
    "zhuangyuan":{
        "price":75,
        "first":320,
        "amount":24000,
        "number":160
    }
}