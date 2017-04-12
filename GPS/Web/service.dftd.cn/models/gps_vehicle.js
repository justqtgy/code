var db = require('./mssql_helper');
var util = require('util');

function gps_vehicle() {};

module.exports = gps_vehicle

gps_vehicle.get_single = function(carNumber, callback) {
    var sql = "select top 1 * from View_CarList where CarNumber='%s'";
    sql = util.format(sql, carNumber);

    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            throw err
        }
        callback(err, rows);
    });
}

gps_vehicle.get_grouplist = function(userid, user_type, callback) {
    var sql = " select groupid, groupname, vehicleid, carnumber,level from View_Group_CarList ";
    if (user_type <= 0) {
        sql += " where groupid in (select groupid from usergroup where userid = " + userid + ")";
    }
    sql += " order by GroupID , [Level]";

    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err
        }
        callback(err, rows);
    });
}