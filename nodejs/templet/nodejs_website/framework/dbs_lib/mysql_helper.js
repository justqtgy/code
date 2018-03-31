var mysql = require("mysql");

module.exports = class mysql_helper{
    constructor(dbconfig){
        this.config = dbconfig;
    }
    /**
     * 异步执行,使用线程池
     * @param {*} sql 
     */
    exec(sql, params){
        logHeper.info('sql =>', sql, params);
        var config = this.config;
        return new Promise(function(resolve, reject) { 
            var pool = mysql.createPool(config);           
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('error => ', err);
                    connection.end();
                    return reject(err);
                }

                connection.query(sql, params, function(err, results) {
                    connection.release();
                    if (err) {
                        console.log('error => ', err);
                        return reject(err);
                    }
                    console.log('result => ', results);
                    resolve(results);
                });
            });
        });
    }
}