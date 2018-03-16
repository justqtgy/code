var _mssql = require('./mssql_helper');
var _mysql = require('./mysql_helper');
var _pgsql = require('./pgsql_helper');

var _dbs = {
    mssql : function(config){
        return new _mssql(config);
    },
    mysql : function(config){
        // _mysql.init(config);
        // return _mysql;
        return new _mysql(config);
    },
    pgsql : function(config){
        return new _pgsql(config);
    }
    
};

module.exports = _dbs;

