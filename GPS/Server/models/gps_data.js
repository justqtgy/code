var sql = require('mssql');
var db = require('../models/mssql_helper');

function gps_data() {

}

/*
gps_data.get_carlist = function(gprsid) {
    return new Promise(function(resolve, reject) {
        var sqlText = "select *, CarNumber as VehicleNo from [gserver_synth].[dbo].[View_CarList] where GPRS='" + gprsid + "'";
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

gps_data.get_driver_vhc = function(vid) {
    return new Promise(function(resolve, reject) {
        var sqlText = "select * from gserver_data.dbo.driver_vhc where VehicleID='" + vid + "'";
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

gps_data.add_data = function(data, cb) {
    return new Promise(function(resolve, reject) {
        var _gpsID = data.gpsID,
            _vehicleID = data.vehicleID,
            _vehicleNo = data.vehicleNo,
            _version = data.version,
            _gpsTime = data.gpsTime,
            _location = data.location,
            _lng = data.lng,
            _lat = data.lat,
            _speed = data.speed,
            _direct = data.direct,
            _status = data.status,
            _temp1 = data.temp1.toString(),
            _temp2 = data.temp2.toString(),
            _temp3 = data.temp3.toString(),
            _temp4 = data.temp4.toString(),
            _oil1 = data.oil1.toString(),
            _oil2 = data.oil2.toString();

        var params = [
            { name: 'GPSID', type: sql.VarChar(20), value: _gpsID },
            { name: 'VehicleID', type: sql.VarChar(20), value: _vehicleID },
            { name: 'VehicleNo', type: sql.VarChar(20), value: _vehicleNo },
            { name: 'Version', type: sql.VarChar(20), value: _version },
            { name: 'GPSTime', type: sql.VarChar(20), value: _gpsTime },
            { name: 'Location', type: sql.VarChar(20), value: _location },
            { name: 'Lng', type: sql.Float, value: _lng },
            { name: 'Lat', type: sql.Float, value: _lat },
            { name: 'Speed', type: sql.Decimal(18, 2), value: _speed },
            { name: 'Direct', type: sql.Decimal(18, 2), value: _direct },
            { name: 'Status', type: sql.VarChar(20), value: _status },
            { name: 'Temp1', type: sql.VarChar(20), value: _temp1 },
            { name: 'Temp2', type: sql.VarChar(20), value: _temp2 },
            { name: 'Temp3', type: sql.VarChar(20), value: _temp3 },
            { name: 'Temp4', type: sql.VarChar(20), value: _temp4 },
            { name: 'Oil1', type: sql.VarChar(20), value: _oil1 },
            { name: 'Oil2', type: sql.VarChar(20), value: _oil2 }
        ];

        db.execSP("cp_gps_data_add", params, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
*/


gps_data.get_carlist = function(gprsid, callback) {

    var sqlText = "select *, CarNumber as VehicleNo from [gserver_synth].[dbo].[View_CarList] with(nolock) where GPRS='" + gprsid + "'";
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });

};

gps_data.get_driver_vhc = function(vid) {

    var sqlText = "select * from gserver_data.dbo.driver_vhc with(nolock) where VehicleID='" + vid + "'";
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });

}

gps_data.add_data = function(data, callback) {

    var _gpsID = data.gpsID,
        _vehicleID = data.vehicleID,
        _vehicleNo = data.vehicleNo,
        _version = data.version,
        _gpsTime = data.gpsTime,
        _location = data.location,
        _lng = data.lng,
        _lat = data.lat,
        _speed = data.speed,
        _direct = data.direct,
        _status = data.status,
        _temp1 = data.temp1.toString(),
        _temp2 = data.temp2.toString(),
        _temp3 = data.temp3.toString(),
        _temp4 = data.temp4.toString(),
        _oil1 = data.oil1.toString(),
        _oil2 = data.oil2.toString();

    var params = [
        { name: 'GPSID', type: sql.VarChar(20), value: _gpsID },
        { name: 'VehicleID', type: sql.VarChar(20), value: _vehicleID },
        { name: 'VehicleNo', type: sql.VarChar(20), value: _vehicleNo },
        { name: 'Version', type: sql.VarChar(20), value: _version },
        { name: 'GPSTime', type: sql.VarChar(20), value: _gpsTime },
        { name: 'Location', type: sql.VarChar(20), value: _location },
        { name: 'Lng', type: sql.Float, value: _lng },
        { name: 'Lat', type: sql.Float, value: _lat },
        { name: 'Speed', type: sql.Decimal(18, 2), value: _speed },
        { name: 'Direct', type: sql.Decimal(18, 2), value: _direct },
        { name: 'Status', type: sql.VarChar(20), value: _status },
        { name: 'Temp1', type: sql.VarChar(20), value: _temp1 },
        { name: 'Temp2', type: sql.VarChar(20), value: _temp2 },
        { name: 'Temp3', type: sql.VarChar(20), value: _temp3 },
        { name: 'Temp4', type: sql.VarChar(20), value: _temp4 },
        { name: 'Oil1', type: sql.VarChar(20), value: _oil1 },
        { name: 'Oil2', type: sql.VarChar(20), value: _oil2 }
    ];

    db.execSP("cp_gps_data_add", params, function(err, result) {
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