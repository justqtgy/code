var db = require('../models/mssql_helper');
var util = require('util');

function group(model) {

}

module.exports = group;

group.get_list = function(params, callback) {
    var sql = "select * from gserver_data.dbo.[Group] ";
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
};

group.get_single = function(id, callback) {
    var sql = "select * from gserver_data.dbo.[Group] where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

group.add = function(params, callback) {
    var sql = "insert into gserver_data.dbo.[Group](GroupName,Linker,Phone,Address,IsEnabled,Remark,AddTime) values('%s','%s','%s','%s','%s','%s','%s')";
    sql = util.format(sql, params.GroupName, params.Linker, params.Phone, params.Address, params.IsEnabled, params.Remark, params.AddTime);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

group.update = function(params, callback) {
    var sql = "update gserver_data.dbo.[Group] set GroupName='%s', Linker='%s', Phone='%s', Address='%s', IsEnabled='%s', Remark='%s', AddTime='%s' where id = '%s'";
    sql = util.format(sql, params.GroupName, params.Linker, params.Phone, params.Address, params.IsEnabled, params.Remark, params.AddTime, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

group.delete = function(params, callback) {
    var sql = "delete from gserver_data.dbo.[Group] where ID = '%s'";
    sql = util.format(sql, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}