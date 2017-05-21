/**
 * 记录实时油量、加油、漏油数据
 */

var db = require('../models/mssql_helper');

function gps_oil() {

}
module.exports = gps_oil;

gps_oil.add_oilreal_data = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil_Data (GPSID, VehicleID, VehicleNo, OilStatus, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
            "VALUES('" + data.gpsID + "'," +
            "'" + data.vehicleID + "'," +
            "'" + data.vehicleNo + "'," +
            "'" + data.oilStatus + "'," +
            "'" + data.curOil + "'," +
            "'" + data.gpsStatus + "'," +
            "'" + data.lng + "'," +
            "'" + data.lat + "'," +
            "'" + data.gpsTime + "'," +
            "'" + data.addTime + "'" +
            ");SELECT @@IDENTITY as ID;";
        console.log(sqlText);
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        })
    });
};

gps_oil.add_oiladd_data = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil_Add (GPSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
            "VALUES('" + data.gpsID + "'," +
            "'" + data.vehicleID + "'," +
            "'" + data.vehicleNo + "'," +
            "'" + data.addOil + "'," +
            "'" + data.preOil + "'," +
            "'" + data.curOil + "'," +
            "'" + data.gpsStatus + "'," +
            "'" + data.lng + "'," +
            "'" + data.lat + "'," +
            "'" + data.gpsTime + "'," +
            "'" + data.addTime + "'" +
            ");SELECT @@IDENTITY as ID;";
        console.log(sqlText);
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


gps_oil.add_oilleak_data = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil_Leak (GPSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
            "VALUES('" + data.gpsID + "'," +
            "'" + data.vehicleID + "'," +
            "'" + data.vehicleNo + "'," +
            "'" + data.addOil + "'," +
            "'" + data.preOil + "'," +
            "'" + data.curOil + "'," +
            "'" + data.gpsStatus + "'," +
            "'" + data.lng + "'," +
            "'" + data.lat + "'," +
            "'" + data.gpsTime + "'," +
            "'" + data.addTime + "'" +
            ");SELECT @@IDENTITY as ID;";
        console.log(sqlText);
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        })
    });
}

module.exports = gps_oil;