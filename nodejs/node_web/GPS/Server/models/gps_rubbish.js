/**
 * 垃圾桶
 */

var db = require('../models/mssql_helper');

function gps_rubbish() {

}

gps_rubbish.add_rubbish = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Rubbish (GPSID, Content, Energy,GPSStatus, Lng, Lat, GPSTime, AddTime, C1, C2,Weight) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.content + "'," +
        "'" + data.energy + "'," +
        "'" + data.gpsStatus + "'," +
        "'" + data.lng + "'," +
        "'" + data.lat + "'," +
        "'" + data.gpsTime + "'," +
        "'" + data.addTime + "'," +
        "'" + data.C1 + "'," +
        "'" + data.C2 + "'," +
        "'" + data.weight + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText)
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_rubbish;