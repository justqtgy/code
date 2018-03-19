/**
 * 记录实时油量、加油、漏油数据
 */

var db = require('../models/mssql_helper');
var util = require('util');

function gps_point() {

}
module.exports = gps_point;


gps_point.get_startpoint_record = function(data, callback) {
    var sqlText = "SELECT TOP 1 * FROM GPS_Point WHERE GPSID= '%s' and IsEnd = 0 ORDER BY ID DESC";
    sqlText = util.format(sqlText, data.gpsID);
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }
        callback(err, result);
    });
};

gps_point.get_point_list = function(data, callback) {
    var sqlText = "SELECT top 10 * FROM GPS_Point WHERE GPSID= '%s' ORDER BY ID DESC";
    sqlText = util.format(sqlText, data.gpsID);
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }
        callback(err, result);
    });
};

gps_point.add_startpoint_data = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Point (GPSID, VehicleID, VehicleNo, CurOil1, GPSStatus1, Lng1, Lat1, GPSTime1, AddTime1, IsEnd) " +
        "VALUES('%s', '%s', '%s', %s, %s, '%s', '%s','%s', '%s', 0);SELECT @@IDENTITY as ID;";
    sqlText = util.format(sqlText, data.gpsID, data.vehicleID, data.vehicleNo, data.curOil, data.gpsStatus, data.lng, data.lat, data.gpsTime, data.addTime);
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }
        callback(err, result);
    });
};

gps_point.add_endpoint_data = function(data, callback) {
    var sqlText = "UPDATE GPS_Point SET CurOil2 = %s, GPSStatus2 = %s, Lng2 = %s , Lat2 = %s, GPSTime2='%s', AddTime2 = '%s', IsEnd = 1, Distance = %s, OilUsed = %s WHERE ID = %s;SELECT @@ROWCOUNT AS ret;";
    sqlText = util.format(sqlText, data.curOil, data.gpsStatus, data.lng, data.lat, data.gpsTime, data.addTime, data.distance, data.oilUsed, data.id);
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        console.log(result)
        if (err) {
            return callback(err, '');
        }
        callback(err, result);
    });
};

module.exports = gps_point;