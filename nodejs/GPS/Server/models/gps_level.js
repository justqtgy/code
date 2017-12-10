var db = require('../models/mssql_helper');
var util = require('util');

function gps_level() {

}

gps_level.add_gps_level = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Level (GPSID, VehicleID, VehicleNo, Level1, Level2, Position, Status, Lng, Lat, High, Speed, Direct, GPSTime, MsgID, Distance, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.level1 + "'," +
        "'" + data.level2 + "'," +
        "'" + data.position + "'," +
        "'" + data.status + "'," +
        "'" + data.lng + "'," +
        "'" + data.lat + "'," +
        "'" + data.higt + "'," +
        "'" + data.speed + "'," +
        "'" + data.direct + "'," +
        "'" + data.datetime + "'," +
        "'" + data.msgid + "'," +
        "'" + data.distance + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";

    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_level;