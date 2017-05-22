var db = require('./framework/db_gserver_data');
var util = require('util');

function gps_oil_data(model) {

}

module.exports = gps_oil_data;

gps_oil_data.get_count = function(params, callback) {
    var sql = " select count(*) as total from gserver_packet.dbo.gps_oil_data where addtime >='%s' and addtime<dateadd(day, 1, '%s')";
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

gps_oil_data.get_rt_list = function(params, callback) {
    // var pageIndex = parseInt(params.pageindex);
    // var pageSize = parseInt(params.pagesize);
    // var start_id = (pageIndex - 1) * pageSize + 1;
    // var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(partition by gpsID order by addtime desc) as rid  " +
        "   from gserver_packet.dbo.gps_oil_data  " +
        "    where addtime >=CONVERT(varchar(10), GETDATE(), 120) and  vehicleid in (%s)" +
        ")" +
        "select * from t where rid=1";
    sql = util.format(sql, params.carlist);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
}