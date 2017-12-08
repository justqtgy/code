var db = require('../models/mssql_helper');
var util = require('util');

function driver_vhc(model) {

};

module.exports = driver_vhc;

driver_vhc.get_count = function(driverid, callback) {
    var sql = "select count(*) as total from gserver_data.dbo.driver_vhc where ('%s'=0 or driverid='%s'))";
    sql = util.format(sql, driverid);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }
        callback(err, total);
    });
}

driver_vhc.get_list = function(driverid, pageIndex, pageSize, callback) {
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gserver_data.dbo.driver_vhc where ('%s'=0 or driverid='%s')) select * from t where rid between '%s' and '%s'";
    sql = util.format(sql, driverid, start_id, end_id);

    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

driver_vhc.get_single = function(id, callback) {
    var sql = "select * from gserver_data.dbo.driver_vhc where id = " + id;
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

driver_vhc.get_mylist = function(driverid, callback) {
    var sql = "select * from gserver_data.dbo.driver_vhc where driverid = '%s'";
    sql = util.format(sql, driverid);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

driver_vhc.update = function(id, sa_tel, remark, callback) {
    var sql = "update gserver_data.dbo.driver_vhc set sa_tel = '%s', remark = '%s' where id = '%s'";
    sql = util.format(sql, sa_tel, remark, id);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}