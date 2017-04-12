var sql = require('mssql');
var config = require('../config/settings').dbconfig;

module.exports.execSQL = function(sqlText, cb) {
    /*sql.connect(config).then(function() {
        new mssql.Request().query(sqlText).then(function(result) {
            cb(null, result)
        }).catch(function(err) {
            console.log(err);
            cb(err, '')
        });

    }).catch(function(err) {
        console.log(err);
        cb(err, '')
    });*/
    var connection = new sql.Connection(config, function(err) {
        if (err) {
            console.log('error => ', err);
            return;
        }
        // Query 
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.query(sqlText, function(err, result) {
            cb(err, result);
        });
    });

    connection.on('error', function(err) {
        // ... error handler 
        console.log('error => ', err);
        cb(err)
    });
}

module.exports.execSP = function(spName, params, cb) {
    console.log(params);
    /*
    sql.connect(config, function(err){
    	if(err){
    		console.log(err);
    		cb(err, '')
    	}

    	var request = new sql.Request();
    	request.verbose = true;
    	for(var p in params){
    		request.input(params[p].name, params[p].value);
    	}

    	request.execute(spName, function(err, recordsets, returnValue){
    		cb(err, recordsets, returnValue)
    	})
    })
    */

    var connection = new sql.Connection(config, function(err) {
        // ... error checks 
        if (err) {
            console.log('error => ', err);
            cb(err, '');
        }
        // Stored Procedure 
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.verbose = true;
        for (var p in params) {
            request.input(params[p].name, params[p].value);
        }
        request.execute(spName, function(err, recordsets, returnValue) {
            cb(err, recordsets, returnValue)
        });
    });

    connection.on('error', function(err) {
        // ... error handler 
        console.log('error => ', err);
        cb(err);
    });
}