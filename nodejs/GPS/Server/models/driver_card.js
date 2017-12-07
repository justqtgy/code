/**
 * 司机卡协议
 */

var db = require('../models/mssql_helper');
var util = require('util');

function driver_card() {

}

driver_card.add_driverCard = function(data, callback) {
    var sqlText = "IF (SELECT Top 1 Status from Driver_card where GPSID='%s' AND DriverName='%s' order by AddTime desc) <> '%s' OR  (SELECT Top 1 Status from Driver_card where GPSID='%s' AND DriverName='%s' order by AddTime desc) is null insert into Driver_card  (GPSID,VehicleID,VehicleNo,DriverName,Status,Keep,GPSTime,AddTime ) values ('%s','%s','%s','%s','%s','%s','%s','%s')"+
        ";SELECT @@IDENTITY as ID;";
    sql = util.format(sqlText, data.gpsID,data.driverName,data.status,data.gpsID,data.driverName,data.gpsID,data.vehicleID,data.vehicleNo,data.driverName,data.status,data.keep,data.gpsTime,data.addTime);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = driver_card;
