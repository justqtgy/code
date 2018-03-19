var util = require('util');
var db = require('../models/mssql_helper');

function gps_sending() {

}

module.exports = gps_sending;

gps_sending.get_list = function(params, callback) {

    var sql ="select TOP 1 * from Response where  GPSID = '%s' AND charindex ('%s',reply)>0 ORDER BY AddTime DESC";
    sql = util.format(sql, params.GPSID, params.reply);
    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
}