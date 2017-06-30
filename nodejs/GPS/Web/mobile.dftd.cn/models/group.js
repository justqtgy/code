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
    var sql = "insert into gserver_data.dbo.[Group](ParentID, GroupName,Linker,Phone,Address,Remark,AddTime) values(%s, '%s','%s','%s','%s','%s',GETDATE())";
    sql = util.format(sql, params.parentID, params.groupName, params.linker, params.phone, params.address, params.remark);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

group.update = function(params, callback) {
    var sql = "update gserver_data.dbo.[Group] set GroupName='%s', Linker='%s', Phone='%s', Address='%s', Remark='%s' where id = '%s'";
    sql = util.format(sql, params.groupName, params.linker, params.phone, params.address, params.remark, params.id);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

group.delete = function(id, callback) {
    var sql = "delete from gserver_data.dbo.[Group] where ID = '%s'";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};