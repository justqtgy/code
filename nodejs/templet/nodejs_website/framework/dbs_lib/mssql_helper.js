var mssql = require('mssql');
//var config = null;//require('./../config/settings').dbconfig;

// module.exports = mssql_helper;

// function mssql_helper(dbconfig){
//     this.config = dbconfig;
// }

/*


mssql_helper.execSQL = function(sqlText, cb) {
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

mssql_helper.execSP = function(spName, params, cb) {
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
            // console.log(result.recordsets.length) // count of recordsets returned by the procedure 
            // console.log(result.recordsets[0].length) // count of rows contained in first recordset 
            // console.log(result.recordset) // first recordset from result.recordsets 
            // console.log(result.returnValue) // procedure return value 
            // console.log(result.output) // key/value collection of output values 
            // console.log(result.rowsAffected) // array of numbers, each number represents the number of rows affected by executed statemens 

            cb(err, result);
        });
    });

    connection.on('error', function(err) {
        // ... error handler 
        logger.error('error => ', err);
        cb(err);
    });
};

*/
//mssql_helper.prototype.exec = async function(sql, params){
module.exports = class mssql_helper{
    constructor(dbconfig){
        this.config = dbconfig;
    }
    async exec(sql, params){
        logger.info('sql =>', sql, params);
        try{
            let pool = await mssql.connect(this.config);
            //let result = await pool.request().query(sql);
            let request = await pool.request();
            request.verbose = true;
            for (var p in params) {
                request.input(params[p].name, params[p].type, params[p].value);
            }
            let result = await request.query(sql);
            mssql.close();
            return result;
        }
        catch(error){
            throw error;
        }    
    }
}
