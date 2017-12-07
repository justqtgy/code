/**
 * 油量数据测试
 */

var db = require('../models/mssql_helper');
var util = require('util');

function gps_remote() {

}

gps_remote.add_remote = function(data, callback) {
    var sqlText = "IF EXISTS ( SELECT * FROM GPS_Remote WHERE GPSID = '%s') " +
        "UPDATE GPS_Remote SET remoteAddress = '%s',remotePort='%s',AddTime= '%s' WHERE GPSID = '%s'"+
        "ELSE INSERT INTO GPS_Remote ( GPSID,remoteAddress,remotePort,AddTime) VALUES ('%s','%s','%s','%s')"+
        ";SELECT @@IDENTITY as ID;";
    sql = util.format(sqlText, data.gpsID,data.remoteAddress,data.remotePort,data.addTime,data.gpsID,data.gpsID,data.remoteAddress,data.remotePort,data.addTime);
    console.log(sql);
    db.execSQL(sql,function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_remote;
