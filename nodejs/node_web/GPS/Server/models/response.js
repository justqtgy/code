var db = require('../models/mssql_helper');
var util = require('util');

function response() {

}

response.add_response = function(data, callback) {
    var sqlText = "INSERT INTO Response (GPSID, VehicleID, VehicleNo, Reply, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.reply + "'," +
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

module.exports = response;
