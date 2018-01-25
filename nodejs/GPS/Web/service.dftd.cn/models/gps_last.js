/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */
var util = require('util');
var db = require('../models/mssql_helper');

function gps_last() {

}

module.exports = gps_last;


gps_last.get_count = function(params, callback) {
    var sql = " select count(*) as total from gps_lastinfo where vehicleid in (%s) ";
    sql = util.format(sql, params.vehicleList);
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
};

gps_last.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by UpdateTime desc) as rid  from gps_lastinfo where vehicleid in (%s)) " +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, params.vehicleList, start_id, end_id);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
};


gps_last.get_position = function(params, callback) {
    var sql = "select * from gps_lastinfo where VehicleID in ("+params.vids+")";
    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
};