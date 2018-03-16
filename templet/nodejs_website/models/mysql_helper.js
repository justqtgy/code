var mysql = require("mysql");
//var settings = require('../config/settings');
module.exports = mysql_helper;

function mysql_helper(config){
    this.config = config;
}

// mysql_helper.init = function(dbconfig){
//     config._dbconfig = dbconfig;
// };

/*
module.exports.execSQL = function(sql, params, callback) {
    logHeper.info('sql =>', sql, params);
    var connection = mysql.createConnection(settings);
    connection.connect(function(err) {
        if (err) {
            connection.end();
            callback(err);
        }

        connection.query(sql, params, function(err, results) {
            connection.end();
            callback(err, results);
        });
    });
};
*/
/**
 * 使用线程池
 * @param {*} sql 
 * @param {*} params 
 * @param {*} callback 
 */
/*
module.exports.execSQL_Pool = function(sql, params, callback) {
    logHeper.info('sql =>', sql, params);
    var pool = mysql.createPool(settings);
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.end();
            callback(err);
        }

        connection.query(sql, params, function(err, results) {
            connection.release();
            callback(err, results);
        });
    });
};
*/
/**
 * 异步执行,使用线程池
 * @param {*} sql 
 */
mysql_helper.exec = function(sql, params) {
    logHeper.info('sql =>', sql);
    return new Promise(function(resolve, reject) {
        var pool = mysql.createPool(config._dbconfig);
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
};

mysql_helper.exec = async function(sql, params) {
    logHeper.info('sql =>', sql);
    try{
        var pool = await mysql.createPool(dbconfig); 
        var conn = await pool.getConnection();    
        var result = await pool.query(sql, params)
        conn.release();
        return result;        
    }
    catch(error){
        throw error;
    }
};
