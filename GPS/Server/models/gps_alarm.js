/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */

var db = require('../models/mssql_helper');

function gps_alarm() {

}
/**
 * 写告警记录到表gps_alarm
 * data:
 */
// gps_alarm.add_alarm = function(data) {
//     return new Promise(function(resolve, reject) {
//         var sqlText = "INSERT INTO GPS_Alarm (GPSID, VehicleID, VehicleNo, Mobile,  AddTime, TypeID) " +
//             "VALUES('" + data.gpsID + "'," +
//             "'" + data.vehicleID + "'," +
//             "'" + data.vehicleNo + "'," +
//             "'" + data.mobile + "'," +
//             "'" + data.addTime + "'," +
//             "'" + data.typeID + "'" +
//             ");SELECT @@IDENTITY as ID;";
//         console.log(sqlText)
//         db.execSQL(sqlText, function(err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

gps_alarm.add_alarm = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Alarm (GPSID, VehicleID, VehicleNo, Mobile,  AddTime, TypeID) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.mobile + "'," +
        "'" + data.addTime + "'," +
        "'" + data.typeID + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText)
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            throw err
        }

        callback(err, result);
    });
};

module.exports = gps_alarm;