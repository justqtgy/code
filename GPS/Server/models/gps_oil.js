var db = require('../models/mssql_helper');

gps_oil.add_record = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil (GPRSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, AddTime, Status) " +
            "VALUES(" + data.gprsid + "," +
            "'" + data.vehicleid + "'," +
            "'" + data.vehicleno + "'," +
            "'" + data.gprsid + "'," +
            "'" + data.addtime + "'," +
            "'" + data.typeid + "'" +
            ");SELECT @@IDENTITY as ID;";
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