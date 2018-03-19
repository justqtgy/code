var sql = require('mssql');
var config = require('../config/settings').dbconfig;

module.exports.execSQL = function(sqlText, cb) {
    console.log(sqlText);
    var connection = new sql.Connection(config, function(err) {
        if (err) {
            logger.error('error => ', err);
            return cb(err);
        }
        // Query 
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.query(sqlText, function(err, result) {
            cb(err, result);
        });
    });

    connection.on('error', function(err) {
        // ... error handler 
        logger.error('error => ', err);
        cb(err);
    });

    // sql.connect(config).then(function(connection) {
    //     new sql.Request(connection)
    //         .query(sqlText)
    //         .then(function(result) {
    //             cb(null, result);
    //         }).catch(function(err) {
    //             cb(err, '');
    //         });

    // }).catch(function(err) {
    //     cb(err, '');
    // });
};

module.exports.execSP = function(spName, params, cb) {
    var connection = new sql.Connection(config, function(err) {
        // ... error checks 
        if (err) {
            logger.error('error => ', err);
            return cb(err, '');
        }
        // Stored Procedure 
        var request = new sql.Request(connection); // or: var request = connection.request(); 
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

            cb(err, result);
        });
    });

    connection.on('error', function(err) {
        // ... error handler 
        logger.error('error => ', err);
        cb(err);
    });
}