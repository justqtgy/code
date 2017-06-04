var db = require('./framework/db_gserver_data');
var util = require('util');

function gps_last(model) {

}

module.exports = gps_last;

gps_last.get_list = function(params, callback) {
    var sql = "select * from gserver_packet.dbo.gps_lastinfo  where vehicleid in (%s)";
    sql = util.format(sql, params.carlist);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
};