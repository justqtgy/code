var _mssql = require('./dbs_lib/mssql_helper');
var _mysql = require('./dbs_lib//mysql_helper');
var _maria = require('./dbs_lib/maria_helper');
var _pgsql = require('./dbs_lib/pgsql_helper');

var dbs = {
    mssql : function(config){
        return new _mssql(config);
    },
    mysql : function(config){
        return new _mysql(config);
    },
    maria : function(config){
        return new _maria(config);
    },
    pgsql : function(config){
        return new _pgsql(config);
    }
};

module.exports = dbs;

