var sql = require('mssql');
var config = require('./../config/settings').dbconfig;

module.exports.execSQL = function(sqlText, cb) {
    console.log(sqlText);
    var pool = new sql.ConnectionPool(config, function(err) {
        if (err) {
            log.error('error => ', err);
            return cb(err);
        }
        // Query 
        var request = new sql.Request(pool); // or: var request = connection.request(); 
        request.query(sqlText, function(err, result) {
            pool.close();
            console.log('===============>', result);
            //output是对象{}
            //recordset数组，每行记录
            //rowsAffected数组执行语句所影响的行数，可以通过判断lenght来判断是否成功
            cb(err, result.recordset);
        });
    });

    pool.on('error', function(err) {
        // ... error handler 
        log.error('error => ', err);
        cb(err);
    });
};

module.exports.execSP = function(spName, params, cb) {
    var pool = new sql.ConnectionPool(config, function(err) {
        // ... error checks 
        if (err) {
            log.error('error => ', err);
            return cb(err, '');
        }
        // Stored Procedure 
        var request = new sql.Request(pool); // or: var request = connection.request(); 
        request.verbose = true;
        for (var p in params) {
            request.input(params[p].name, params[p].type, params[p].value);
        }
        request.execute(spName, function(err, result) {
            /*
            console.log(result.recordsets.length) // count of recordsets returned by the procedure 
            console.log(result.recordsets[0].length) // count of rows contained in first recordset 
            console.log(result.recordset) // first recordset from result.recordsets 
            console.log(result.returnValue) // procedure return value 
            console.log(result.output) // key/value collection of output values 
            console.log(result.rowsAffected) // array of numbers, each number represents the number of rows affected by executed statemens 
            */
            pool.close();
            cb(err, result);
        });
    });

    pool.on('error', function(err) {
        // ... error handler 
        log.error('error => ', err);
        cb(err);
    });
}