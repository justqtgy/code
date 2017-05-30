var db = require('./framework/db_gserver_data');
var util = require('util');

function gps_last(model) {

}

module.exports = gps_last;

gps_last.get_count = function(params, callback) {
    var sql = " select count(*) as total from gserver_packet.dbo.GPS_LastInfo where addtime >='%s' and addtime<dateadd(day, 1, '%s')";
    sql = util.format(sql, params.begintime, params.endtime);
    db.execSQL(sql, function(err, result) {
        if (err) {
            console.log(err);
            throw err;
        }

        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }

        callback(err, total);
    });
}

gps_last.get_list = function(params, callback) {
    // var pageIndex = parseInt(params.pageindex);
    // var pageSize = parseInt(params.pagesize);
    // var start_id = (pageIndex - 1) * pageSize + 1;
    // var end_id = pageIndex * pageSize;

    var sql = "select top 10 *, datediff(minute, AddTime1, AddTime2) as TimeUsed, convert(varchar(10), AddTime1, 120) as CreateDate " +
        "   from gserver_packet.dbo.gps_last  " +
        "    where vehicleid in (%s)" +
        " order by id desc";
    sql = util.format(sql, params.carlist);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
}