/**
 * 部标协议
 */

var db = require('../models/mssql_helper');

function JT808() {

}

JT808.add_JT808 = function(data, callback) {
    var sqlText = "INSERT INTO JT808 (GPSID,Lng,Lat,Speed,GPSTime,CurOil,AddTime,GPSStatus ) " +
        "VALUES('" + data.GPSID + "',"+
        "'" + data.Lng + "'," +
        "'" + data.Lat + "'," +
        "'" + data.Speed + "'," +
        "'" + data.GPSTime + "'," +
        "'" + data.CurOil + "'," +
        "'" + data.AddTime + "'," +
        "'" + data.GPSStatus + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = JT808;
