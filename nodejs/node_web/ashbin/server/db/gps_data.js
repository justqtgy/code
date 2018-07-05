var sql = require('mssql');
var iconv = require('iconv-lite');
var db = require('../models/mssql_helper');

function gps_data() {

}

gps_data.add_data = function(args, callback) {
    var sqlText = `
        insert into gps_data(gps_id, sn, num, one_zl, one_rl, one_c1, one_c2, two_zl, two_rl, two_c1, two_c2
            , power, alarm, status, lng, lat, high, speed, direct, dist_id, distance, gps_time, add_time)
            values('%s', %s, %s, %s, %s, %s, %s, %s)
        ;SELECT @@IDENTITY as ID;`;
    sql = util.format(sqlText, data.gpsID,data.driverName,data.status,data.gpsID,data.driverName,data.gpsID,data.vehicleID,data.vehicleNo,data.driverName,data.status,data.keep,data.gpsTime,data.addTime);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
}

/*
gps_data.add_capacity = function(data) {
    return new Promise(function(resolve, reject) {
        var _vehicle_id = data.vehicle_id,
            _version = data.version,
            _gpsdate = data.gpsdate,
            _gpstime = data.gpstime,
            _location = data.Location,
            _lng = data.lng,
            _lat = data.lat,
            _speed = data.speed,
            _direct = data.direct,
            _Stutus = data.status,
            _temp = data.temp;

        var params = [
            { name: 'VehicleID', type: sql.VarChar(20), value: _vehicle_id },
            { name: 'Version', type: sql.VarChar(20), value: _version },
            { name: 'GPSTime', type: sql.DateTime, value: _gpstime },
            { name: 'Location', type: sql.VarChar(20), value: _location },
            { name: 'Lng', type: sql.Float, value: _lng },
            { name: 'Lat', type: sql.Float, value: _lat },
            { name: 'Speed', type: sql.Decimal(18, 2), value: _speed },
            { name: 'Direct', type: sql.Decimal(18, 2), value: _direct },
            { name: 'Status', type: sql.VarChar(20), value: _status },
            { name: 'Temp', type: sql.VarChar(20), value: _temp }
        ];

        db.execSP("cp_gps_capacity_add", params, function(err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}


gps_data.add_quality = function(data) {
    return new Promise(function(resolve, reject) {
        var _vehicle_id = data.vehicle_id,
            _c1 = data.c1,
            _c2 = data.c2,
            _empty = data.empty,
            _full = data.full,
            _init = data.init,
            _volume = data.volume;

        var params = [
            { name: 'VehicleID', type: sql.VarChar(20), value: _vehicle_id },
            { name: 'C1', type: sql.VarChar(20), value: _c1 },
            { name: 'C2', type: sql.VarChar(20), value: _c2 },
            { name: 'Empty', type: sql.Decimal(18, 2), value: _empty },
            { name: 'Full', type: sql.Decimal(18, 2), value: _full },
            { name: 'Init', type: sql.Decimal(18, 2), value: _init },
            { name: 'Volume', type: sql.Decimal(18, 2), value: _volume }
        ];

        db.execSP("cp_gps_quality_add", params, function(err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}
*/
// gps_data.add_alarm = function(data, cb) {
//     var sqlText = "INSERT INTO gps_alarm (vehicle_id, CarNumber, Mobile, GPRSID, AddTime, TypeID) " +
//         "VALUES(" + data.vehicle_id + "," +
//         "'" + data.carnumber + "'," +
//         "'" + data.mobile + "'," +
//         "'" + data.gprsid + "'," +
//         "'" + data.addtime + "'," +
//         "'" + data.typeid + "'" +
//         ");SELECT @@IDENTITY as ID;";
//     sql.connect(config).then(function(connection) {
//         new sql.Request(connection)
//             .query(sqlText)
//             .then(function(result) {
//                 cb(null, result);
//             }).catch(function(err) {
//                 cb(err, '');
//             });

//     }).catch(function(err) {
//         cb(err, 0);
//     });
// }


// gps_data.add_alarm = function(data) {
//     return new Promise(function(resolve, reject) {
//         var sqlText = "INSERT INTO gps_alarm (vehicle_id, CarNumber, Mobile, GPRSID, AddTime, TypeID) " +
//             "VALUES(" + data.vehicle_id + "," +
//             "'" + data.carnumber + "'," +
//             "'" + data.mobile + "'," +
//             "'" + data.gprsid + "'," +
//             "'" + data.addtime + "'," +
//             "'" + data.typeid + "'" +
//             ");SELECT @@IDENTITY as ID;";
//         db.execSQL(sqlText, function(err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }

//         })
//     });
// }

module.exports = gps_data;