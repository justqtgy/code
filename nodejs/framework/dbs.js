var _mssql = require('./dbs_lib/mssql_helper');
var _mysql = require('./dbs_lib//mysql_helper');
// var _pgsql = require('./dbs_lib/pgsql_helper');

var dbs = {
    mssql : function(config){
        return new _mssql(config);
    },
    mysql : function(config){
        // _mysql.init(config);
        // return _mysql;
        return new _mysql(config);
    },
    // pgsql : function(config){
    //     return new _pgsql(config);
    // }
    
};

module.exports = dbs;

