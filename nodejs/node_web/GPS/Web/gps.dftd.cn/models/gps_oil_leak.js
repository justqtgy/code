var db = require('./framework/db_gserver_data');
var util = require('util');

function gps_oil_leak(model) {

}

module.exports = gps_oil_leak;

gps_oil_leak.get_count = function(params, callback) {
    var sql = " select count(*) as total from gserver_packet.dbo.gps_oil_leak where addtime >='%s' and addtime<dateadd(day, 1, '%s')";
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

gps_oil_leak.get_list = function(params, callback) {
    // var pageIndex = parseInt(params.pageindex);
    // var pageSize = parseInt(params.pagesize);
    // var start_id = (pageIndex - 1) * pageSize + 1;
    // var end_id = pageIndex * pageSize;

    var sql = ";with t as (select row_number() over(order by addtime desc) as rid, *, convert(varchar(10), AddTime, 120) as CreateDate " +
        "   from gserver_packet.dbo.gps_oil_leak  " +
        "    where addtime >='%s' and addtime<dateadd(day, 1, '%s') and  vehicleid in (%s)" +
        ")" +
        "select CreateDate, VehicleID, VehicleNo, sum(AddOil) as OilNumber from t group by CreateDate, VehicleID, VehicleNo order by CreateDate desc ";
    sql = util.format(sql, params.begintime, params.endtime, params.carlist);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
}