var db = require('./mssql_helper');
var util = require('util');

function gps_last() {

}

module.exports = gps_last;

gps_last.get_info = function(args, callback) {
    var sql = "select top 1 * from GPS_LastInfo where GPSID = '%s'";
    sql = util.format(sql, args.gpsID);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
};

gps_last.add_record = function(args, callback) {
    var sql = "insert into GPS_LastInfo values('%s', '%s', '%s', '%s', '%s',0, 0, 0, GETDATE());SELECT @@IDENTITY as ID;";
    sql = util.format(sql, args.gpsID, args.vehicleID, args.vehicleNo, args.lng, args.lat);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err;
        }

        callback(err, result);
    });
};

gps_last.update_record = function(args, callback) {
    var sql = "update GPS_LastInfo set UpdateTime = GETDATE(), Lng = '" + args.lng + "', Lat = '" + args.lat + "' ";
    if (args.range >= 1000) {
        sql += ", OverRange = 0 ";
    } else {
        sql += ", OverRange = " + args.range;
    }

    if (args.curOil) {
        sql += ", CurOil = " + args.curOil;
    }
    sql += "  where VehicleID='%s';SELECT @@ROWCOUNT AS ret;";
    sql = util.format(sql, args.vehicleID);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err;
        }

        callback(err, result);
    });
};