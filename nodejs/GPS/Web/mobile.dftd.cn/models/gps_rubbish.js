
var util = require('util');
var db = require('../models/mssql_helper');

function gps_rubbish() {

}

module.exports = gps_rubbish;


gps_rubbish.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from GPS_Rubbish where addtime >='%s' and addtime<dateadd(day, 1, '%s') and GPSID in (%s)";
    sql = util.format(sql,params.begintime, params.endtime,params.GPSIDList);
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
gps_rubbish.get_GPSIDList = function(params, callback) {
    var sql = " select GPSID as GPSIDList from GPS_Rubbish group by GPSID ";
    sql = util.format(sql);
    db.execSQL(sql, function(err,rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows)
    });
};

gps_rubbish.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql="select t.* from (select *, row_number() over(order by ID desc) as rid  from GPS_Rubbish where addtime >='%s' and addtime<dateadd(day, 1, '%s') and GPSID in (%s)) t WHERE rid between %s and %s";
    sql = util.format(sql,params.begintime, params.endtime,params.GPSIDList,start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
        console.log(rows)
    });
}
