/**
 * 数据测试
 */

var db = require('../models/mssql_helper');

function gps_test() {

}

gps_test.add_test = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Test (GPSID, Info, AddTime, VehicleID, VehicleNo) " +
        "VALUES('" + data.gpsID + "',"+
        "'" + data.info + "'," +
        "'" + data.addTime + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText)
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_test;
