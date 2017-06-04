var db = require('../models/mssql_helper');
var util = require('util');

function vehicle(model) {

}

module.exports = vehicle;

vehicle.get_single = function(carNumber, callback) {
    var sql = "select top 1 * from gserver_synth.dbo.View_CarList where CarNumber='%s'";
    sql = util.format(sql, carNumber);

    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

vehicle.get_grouplist = function(userid, user_type, callback) {
    console.log('uid, user_type')
    var sql = " select groupid, groupname, vehicleid, carnumber,level from gserver_synth.dbo.View_Group_CarList ";
    if (user_type <= 0) {
        sql += " where groupid in (select groupid from gserver_synth.dbo.usergroup where userid = " + userid + ")";
    }
    sql += " order by GroupID , [Level]";

    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}