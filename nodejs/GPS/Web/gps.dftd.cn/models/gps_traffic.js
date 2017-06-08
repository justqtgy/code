var db = require('./framework/db_gserver_data');
var util = require('util');

function gps_traffic(model) {

}

module.exports = gps_traffic;

gps_traffic.get_list = function(params, callback) {
    var sql = "select top 10 *, (EndDistance-BeginDistance)*0.001 as Distance, (BeginOil+AddOil-EndOil) as OilUsed " +
        "from gserver_packet.dbo.gps_traffic  where vehicleid in (%s) order by id desc";
    sql = util.format(sql, params.carlist);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
};

gps_traffic.get_record = function(params, callback) {
    var sql = "select * from gserver_packet.dbo.gps_traffic  where id=%s";
    sql = util.format(sql, params.id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
};