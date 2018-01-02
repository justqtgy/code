var mysql = require("mysql");
var settings = require('../config/settings');

// module.exports.execSQL = function(sql, params, callback) {
//     var connection = mysql.createConnection(settings);
//     connection.connect(function(err) {
//         if (err) {
//             connection.end();
//             callback(err)
//         }

//         connection.query(sql, params, function(err, results) {
//             connection.end();
//             callback(err, results);
//         });
//     });
// }


module.exports.execSQL_Pool = function(sql, params, callback) {
    var pool = mysql.createPool(settings);
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.end();
            callback(err)
        }

        connection.query(sql, params, function(err, results) {
            connection.release();
            callback(err, results);
        });
    });
}


module.exports.execSQL = function(sql, params) {
    return new Promise(function(resolve, reject) {
        var pool = mysql.createPool(settings);
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.end();
                return reject(err);
            }

            connection.query(sql, params, function(err, results) {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
};