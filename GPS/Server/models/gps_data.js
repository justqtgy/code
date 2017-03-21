var sql = require('mssql');
var settings = require('../config/settings');


// var config = {
//     user: 'sa',
//     password: 'DSERVER@123',
//     server: '120.24.68.95', // You can use 'localhost\\instance' to connect to named instance
//     database: 'gserver_data',
//     options: {
//         encrypt: false // Use this if you're on Windows Azure
//     }
// }

var config = settings.dbconfig;

function gps_data() {
    // try {
    //     log4js.configure('log4js.json', { reloadSecs: 300 });
    //     var logger = log4js.getLogger('dateFileLog');
    // } catch (err) {
    //     console.log(err);
    // }
}

gps_data.get_carlist = function(gprsid, cb) {
    var sqlText = "select * from [gserver_synth].[dbo].[View_CarList] where GPRS='" + gprsid + "'";
    var pool = new sql.ConnectionPool(config, err => {
        if (err) {
            logger.error('error = ', err);
            pool.close();
            cb(err, '');
        }
        // Query
        pool.request() // or: new sql.Request(pool1)
            .query(sqlText, (err, result) => {
                if (err) {
                    logger.error('error = ', err);
                    pool.close();
                    cb(err, '');
                }
                cb(null, result);
            });
    });

    pool.on('error', err => {
        logger.error('error = ', err);
        pool.close();
        cb(err, '');
    });
};

gps_data.get_driver_vhc = function(vid, cb) {
    var sqlText = "select * from driver_vhc where VehicleID='" + vid + "'";
    sql.connect(config).then(function() {
        new sql.Request().query(sqlText).then(function(result) {
            cb(null, result)
        }).catch(function(err) {
            sql.close();
            logger.error('error = ' + err);
            cb(err, '')
        });

    }).catch(function(err) {
        sql.close();
        logger.error('error = ' + err);
        cb(err, '')
    });
}

gps_data.add_data = function(data, cb) {
    var _vehicleid = data.vehicleid,
        _version = data.version,
        _gpstime = data.gpstime,
        _location = data.location,
        _lng = data.lng,
        _lat = data.lat,
        _speed = data.speed,
        _direct = data.direct,
        _status = data.status,
        _temp = data.temp.toString();


    sql.connect(config).then(function() {
        new sql.Request()
            .input('VehicleID', sql.VarChar(20), _vehicleid)
            .input('Version', sql.VarChar(20), _version)
            .input('GPSTime', sql.VarChar(20), _gpstime)
            .input('Location', sql.VarChar(20), _location)
            .input('Lng', sql.VarChar(20), _lng)
            .input('Lat', sql.VarChar(20), _lat)
            .input('Speed', sql.VarChar(20), _speed)
            .input('Direct', sql.VarChar(20), _direct)
            .input('Status', sql.VarChar(20), _status)
            .input('Temp', sql.VarChar(20), _temp)
            .execute('cp_gps_data_add').then(function(err, recordsets, returnValue) {
                //console.dir(returnValue);
                cb(null, 1)
            }).catch(function(err) {
                //console.log(err);
                cb(err, 0)
            });

    }).catch(function(err) {
        //console.log(err);
        cb(err, 0)
    });
}

gps_data.add_capacity = function(data) {
    var _vehicleid = data.vehicleid,
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


    sql.connect(config).then(function() {
        new sql.Request()
            .input('VehicleID', sql.VarChar(20), _vehicleid)
            .input('Version', sql.VarChar(20), _version)
            .input('GPSTime', sql.DateTime, _gpstime)
            .input('Location', sql.VarChar(20), _location)
            .input('Lng', sql.Float, _lng)
            .input('Lat', sql.Float, _lat)
            .input('Speed', sql.Decimal(18, 2), _speed)
            .input('Direct', sql.Decimal(18, 2), _direct)
            .input('Status', sql.VarChar(20), _status)
            .input('Temp', sql.VarChar(20), _temp)
            .execute('cp_gps_data_add').then(function(err, recordsets, returnValue) {
                console.dir(recordsets);
            }).catch(function(err) {
                console.log(err);
            });

    }).catch(function(err) {
        console.log(err);
    });
}


gps_data.add_quality = function(data, cb) {
    var _vehicleid = data.vehicleid,
        _c1 = data.c1,
        _c2 = data.c2,
        _empty = data.empty,
        _full = data.full,
        _init = data.init,
        _volume = data.volume;

    sql.connect(config).then(function() {
        new sql.Request()
            .input('VehicleID', sql.VarChar(20), _vehicleid)
            .input('C1', sql.VarChar(20), _c1)
            .input('C2', sql.VarChar(20), _c2)
            .input('Empty', sql.Decimal(18, 2), _empty)
            .input('Full', sql.Decimal(18, 2), _full)
            .input('Init', sql.Decimal(18, 2), _init)
            .input('Volume', sql.Decimal(18, 2), _volume)
            .execute('cp_gps_quality_add').then(function(err, recordsets, returnValue) {
                cb(null, 1);
            }).catch(function(err) {
                cb(err, 0);
            });

    }).catch(function(err) {
        cb(err, 0);
    });
}

gps_data.add_alarm = function(data, cb) {
    var sqlText = "INSERT INTO gps_alarm (VehicleID, CarNumber, Mobile, GPRSID, AddTime, TypeID) " +
        "VALUES(" + data.vehicleid + "," +
        "'" + data.carnumber + "'," +
        "'" + data.mobile + "'," +
        "'" + data.gprsid + "'," +
        "'" + data.addtime + "'," +
        "'" + data.typeid + "'" +
        ");SELECT @@IDENTITY as ID;";
    sql.connect(config).then(function() {
        new sql.Request().query(sqlText).then(function(result) {
            cb(null, result)
        }).catch(function(err) {
            logger.error('error = ' + err);
            cb(err, '');
        });

    }).catch(function(err) {
        cb(err, 0);
    });
}

module.exports = gps_data;