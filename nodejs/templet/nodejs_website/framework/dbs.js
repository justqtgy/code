var _mssql = require('./dbs_lib/mssql_helper');
var _mysql = require('./dbs_lib//mysql_helper');
var _pgsql = require('./dbs_lib/pgsql_helper');

var dbs = {
    mssql : function(config){
        return new _mssql(config || dbconfigs.default);
    },
    mysql : function(config){
        return new _mysql(config || dbconfigs.default);
    },
    pgsql : function(config){
        return new _pgsql(config || dbconfigs.default);
    }
};

module.exports = dbs;

