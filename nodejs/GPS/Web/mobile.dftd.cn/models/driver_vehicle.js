var db = require('../models/mssql_helper');
var util = require('util');

function driver_vehicle() {

}

module.exports = driver_vehicle;

driver_vehicle.get_list = function(driverid, callback) {

    var sql = "select * from dbo.driver_vehicle where  driverid='%s'";
    sql = util.format(sql, driverid);

    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

driver_vehicle.get_single = function(id, callback) {
    var sql = "select * from dbo.driver_vehicle where id = " + id;
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

driver_vehicle.get_mylist = function(driverid, callback) {
    var sql = "select * from dbo.driver_vehicle where driverid = '%s'";
    sql = util.format(sql, driverid);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

driver_vehicle.update = function(args, callback) {
    var sql = "update dbo.driver_vehicle set servicephone = '%s', remark = '%s' where id = '%s'";
    sql = util.format(sql, args.phone, args.remark, args.id);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};