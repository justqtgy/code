var db = require('./mssql_helper');
var util = require('util');

function gps_traffic() {

}

module.exports = gps_traffic;

gps_traffic.get_info = function(args, callback) {
    var sql = "select top 1 * from GPS_Traffic where CreateDate = '%s' and GPSID = '%s'";
    sql = util.format(sql, args.createDate, args.gpsID);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err;
        }

        callback(err, rows);
    });
};

gps_traffic.add_record = function(args, callback) {
    var sql = "INSERT INTO GPS_Traffic " +
        "SELECT TOP 1 '%s' ,[GPSID] ,[VehicleID] ,[VehicleNo] ,[EndDistance], [EndDistance]+%s, [EndOil], [EndOil] + %s , %s as AddOil, '%s' as Traffic, GETDATE() " +
        "FROM (SELECT TOP 1 [GPSID] ,[VehicleID] ,[VehicleNo], [EndDistance], [EndOil], 0 as Rid " +
        "      FROM [dbo].[GPS_Traffic] " +
        "      WHERE CreateDate < '%s' AND GPSID = '%s' ORDER BY CreateDate DESC " +
        "      UNION ALL " +
        "      SELECT '%s' as GPSID, '%s' AS VehicleID, '%s' as VehicleNo, 0 as EndDistance, 0 as EndOil,  1 as Rid" +
        "    ) T ORDER BY Rid " +
        "SELECT @@IDENTITY as ID;";
    sql = util.format(sql, args.createDate, args.distance, args.curOil, args.addOil, args.traffic, args.createDate, args.gpsID,
        args.gpsID, args.vehicleID, args.vehicleNo);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err;
        }

        callback(err, result);
    });
};

gps_traffic.update_record = function(args, callback) {
    var sql = "update GPS_Traffic set UpdateTime = GETDATE() ";
    if (args.distance > 0) {
        sql += " ,EndDistance = EndDistance + " + args.distance + ", Traffic = Traffic + '" + args.traffic + "' ";
    }
    if (args.curOil) {
        sql += " ,EndOil = " + args.curOil;
    }
    if (args.addOil > 0) {
        sql += " ,AddOil = AddOil + " + args.addOil;
    }
    sql += "  where ID=%s; select @@rowcount as ret;";
    sql = util.format(sql, args.trafficID);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err;
        }

        callback(err, result);
    });
};