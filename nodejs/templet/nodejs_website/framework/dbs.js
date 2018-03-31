var _mssql = require('./dbs_lib/mssql_helper');
var _mysql = require('./dbs_lib//mysql_helper');
var _pgsql = require('./dbs_lib/pgsql_helper');

var dbs = {
    mssql : function(config){
        return new _mssql(config || dbconfig.default);
    },
    mysql : function(config){
        return new _mysql(config || dbconfig.default);
    },
    pgsql : function(config){
        return new _pgsql(config || dbconfig.default);
    }
};

module.exports = dbs;

