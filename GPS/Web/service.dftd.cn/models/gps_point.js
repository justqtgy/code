/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */
var util = require('util');
var db = require('../models/mssql_helper');

function gps_point() {

}

module.exports = gps_point;


gps_point.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from gps_point where addtime >='%s' and addtime<dateadd(day, 1, '%s')";
    sql = util.format(sql, params.begintime, params.endtime);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return cb(err);
        }

        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }

        callback(err, total);
    });
};

gps_point.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid  from gps_point  where addtime >='%s' and addtime<dateadd(day, 1, '%s'))  " +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, params.begintime, params.endtime, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return cb(err);
        }

        callback(err, rows);
    });
}