var db = require('./mssql_helper');
var util = require('util');

function gps_alarm() {};

module.exports = gps_alarm

gps_alarm.get_count = function(args, callback) {
    var sql = " select count(*) as total from gps_alarm where addtime >='%s' and addtime<dateadd(day, 1, '%s')";
    sql = util.format(sql, args.begintime, args.endtime);
    db.execSQL(sql, function(err, result) {
        if (err) {
            console.log(err);
            throw err
        }

        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }

        callback(err, total);
    });
}

/**
 * args:{ begintime, endtime, pageindex, pagesize}
 */
gps_alarm.get_list = function(args, callback) {
    var pageIndex = parseInt(args.pageIndex);
    var pageSize = parseInt(args.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid  from gps_alarm  where addtime >='%s' and addtime<dateadd(day, 1, '%s'))  " +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, args.begintime, args.endtime, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err
        }

        callback(err, rows);
    });
}