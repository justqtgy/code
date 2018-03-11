var _mssql = require('mssql');
var _mysql = require('mysql');

module.exports.mssql = mssql;
module.exports.mysql = mysql;

// function _dbs(dbtype, dbconfig) {
//         this.dbtype = dbtype || 'mssql';
//         this.dbconfig = dbconfig;
//         return _dbs;
//     }

// _dbs.exec = async function(sql, params, opt){
//         if(this.dbtype=='mssql'){
//             return await mssql_exec(this.dbconfig, sql, params, opt);
//         }else{

//         }
// }

function mssql(dbconfig){
    mssql.dbconfig = dbconfig;
    return mssql;
}

mssql.exec = async function(sql, params, opt){
    logHeper.info('sql =>', mssql.dbconfig,   sql);
    try{            
        let pool = await _mssql.connect(mssql.dbconfig);
        //let result = await pool.request().query(sql);
        let request = await pool.request();
        request.verbose = true;
        for (var p in params) {
            request.input(params[p].name, params[p].type, params[p].value);
        }

        let result = null;
        if(opt && opt.type =='sp'){
            result = await request.execute(sql);
            /*
            console.log(result.recordsets.length) // count of recordsets returned by the procedure 
            console.log(result.recordsets[0].length) // count of rows contained in first recordset 
            console.log(result.recordset) // first recordset from result.recordsets 
            console.log(result.returnValue) // procedure return value 
            console.log(result.output) // key/value collection of output values 
            console.log(result.rowsAffected) // array of numbers, each number represents the number of rows affected by executed statemens 
            */
        }            
        else{
            result = await request.query(sql);
        }                
        return result;
    }
    catch(error){
        throw error;
    }
}

function mysql(dbconfig){
    mysql.dbconfig = dbconfig;
    return mysql;
}

mysql.exec = function(sql, params){
    logHeper.info('sql =>', mysql.dbconfig, sql);
    return new Promise(function(resolve, reject) {
        var pool = _mysql.createPool(mysql.dbconfig);
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
