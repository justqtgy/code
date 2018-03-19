

var db = require('../models/mssql_helper');
var util = require('util');

function gps_param() {

}

gps_param.add_gps_param = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Param (GPSID, VehicleID, VehicleNo, Info, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.info + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText);
    db.execSQL(sqlText,function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_param;
