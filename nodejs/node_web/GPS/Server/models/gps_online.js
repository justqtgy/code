var db = require('./mssql_helper');
var util = require('util');

function gps_online() {

}

module.exports = gps_online;

gps_online.get_info = function(args, callback) {
    var sql = "select top 1 * from gps_online where CreateDate ='%s' and GPSID = '%s'";
    sql = util.format(sql, args.createDate, args.gpsID);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
};

gps_online.add_record = function(args, callback) {
    var sql = "insert into gps_online values('%s', '%s', '%s', '%s', %s, '%s', GETDATE());SELECT @@IDENTITY as ID;";
    sql = util.format(sql, args.createDate, args.gpsID, args.vehicleID, args.vehicleNo, 1, args.detail);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err;
        }

        callback(err, result);
    });
};

gps_online.update_record = function(args, callback) {
    var sql = "update gps_online set UpdateTime = GETDATE(), Online = 1, Detail = Detail+'%s' where ID='%s'; select @@rowcount as ret ";
    sql = util.format(sql, args.detail, args.id);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err;
        }

        callback(err, result);
    });
};