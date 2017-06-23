/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */

var db = require('../models/mssql_helper');
var util = require('util');

function gps_quality() {

}

gps_quality.add_data = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Quality (GPSID, VehicleID, VehicleNo, C1, C2, [Empty],  [Full], [Init], [Volume], [Quality], AddTime) " +
        "VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');SELECT @@IDENTITY as ID;";
    sqlText = util.format(sqlText, data.gpsID, data.vehicleID, data.vehicleNo, data.c1, data.c2, data.empty, data.full, data.init, data.volume, data.quality, data.addTime);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_quality;