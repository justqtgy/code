/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */
var util = require('util');
var db = require('../models/mssql_helper');

function gps_alarm() {

}

module.exports = gps_alarm;

gps_alarm.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from gps_alarm where addtime >='%s' and addtime<dateadd(day, 1, '%s') and vehicleid in (%s)";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList);
    console.log(sql)
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

gps_alarm.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid  from gps_alarm  where addtime >='%s' and addtime<dateadd(day, 1, '%s')   and vehicleid in (%s))  " +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
}