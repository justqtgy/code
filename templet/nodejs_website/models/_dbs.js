var _mssql = require('./mssql_helper');
var _mysql = require('./mysql_helper');

var _dbs = {
    mssql : function(config){
        return new _mssql(config);
    },
    mysql : function(config){
        _mysql.init(config);
        return _mysql;
    }
};

module.exports = _dbs;