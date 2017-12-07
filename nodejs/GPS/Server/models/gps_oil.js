/**
 * 记录实时油量、加油、漏油数据
 */

var db = require('../models/mssql_helper');

function gps_oil() {

}
module.exports = gps_oil;

/*
gps_oil.add_oilreal_data = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil_Data (GPSID, VehicleID, VehicleNo, OilStatus, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
            "VALUES('" + data.gpsID + "'," +
            "'" + data.vehicleID + "'," +
            "'" + data.vehicleNo + "'," +
            "'" + data.oilStatus + "'," +
            "'" + data.curOil + "'," +
            "'" + data.gpsStatus + "'," +
            "'" + data.lng + "'," +
            "'" + data.lat + "'," +
            "'" + data.gpsTime + "'," +
            "'" + data.addTime + "'" +
            ");SELECT @@IDENTITY as ID;";
        console.log(sqlText);
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

gps_oil.add_oiladd_data = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil_Add (GPSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
            "VALUES('" + data.gpsID + "'," +
            "'" + data.vehicleID + "'," +
            "'" + data.vehicleNo + "'," +
            "'" + data.addOil + "'," +
            "'" + data.preOil + "'," +
            "'" + data.curOil + "'," +
            "'" + data.gpsStatus + "'," +
            "'" + data.lng + "'," +
            "'" + data.lat + "'," +
            "'" + data.gpsTime + "'," +
            "'" + data.addTime + "'" +
            ");SELECT @@IDENTITY as ID;";
        console.log(sqlText);
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


gps_oil.add_oilleak_data = function(data) {
    return new Promise(function(resolve, reject) {
        var sqlText = "INSERT INTO GPS_Oil_Leak (GPSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
            "VALUES('" + data.gpsID + "'," +
            "'" + data.vehicleID + "'," +
            "'" + data.vehicleNo + "'," +
            "'" + data.addOil + "'," +
            "'" + data.preOil + "'," +
            "'" + data.curOil + "'," +
            "'" + data.gpsStatus + "'," +
            "'" + data.lng + "'," +
            "'" + data.lat + "'," +
            "'" + data.gpsTime + "'," +
            "'" + data.addTime + "'" +
            ");SELECT @@IDENTITY as ID;";
        console.log(sqlText);
        db.execSQL(sqlText, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        })
    });
}
*/

gps_oil.add_oilreal_data = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Oil_Data (GPSID, VehicleID, VehicleNo, OilStatus, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.oilStatus + "'," +
        "'" + data.curOil + "'," +
        "'" + data.gpsStatus + "'," +
        "'" + data.lng + "'," +
        "'" + data.lat + "'," +
        "'" + data.gpsTime + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

gps_oil.add_oiladd_data = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Oil_Add (GPSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.addOil + "'," +
        "'" + data.preOil + "'," +
        "'" + data.curOil + "'," +
        "'" + data.gpsStatus + "'," +
        "'" + data.lng + "'," +
        "'" + data.lat + "'," +
        "'" + data.gpsTime + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);

    });

};

gps_oil.get_oiladd_record = function(data, callback) {
    var sqlText = "SELECT SUM(AddOil) as AddOil FROM GPS_Oil_Add WHERE GPSID = '" + data.gpsID + "' AND AddTime>='" + data.beginTime + "' and AddTime = '" + data.endTime + "'";
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};


gps_oil.add_oilleak_data = function(data, callback) {

    var sqlText = "INSERT INTO GPS_Oil_Leak (GPSID, VehicleID, VehicleNo, AddOil, PreOil, CurOil, GPSStatus, Lng, Lat, GPSTime, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.addOil + "'," +
        "'" + data.preOil + "'," +
        "'" + data.curOil + "'," +
        "'" + data.gpsStatus + "'," +
        "'" + data.lng + "'," +
        "'" + data.lat + "'," +
        "'" + data.gpsTime + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};
gps_oil.add_oilUrgentAdd_data = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Oil_Urgent_Add (GPSID, VehicleID, VehicleNo, UrgentAddOil, UrgentAddTime, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.urgentAddOil + "'," +
        "'" + data.urgentAddTime + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);

    });

};

gps_oil.add_oilUrgentLeak_data = function(data, callback) {
    var sqlText = "INSERT INTO GPS_Oil_Urgent_Leak (gpsID, VehicleID, VehicleNo, UrgentLeakOil, UrgentLeakTime, AddTime) " +
        "VALUES('" + data.gpsID + "'," +
        "'" + data.vehicleID + "'," +
        "'" + data.vehicleNo + "'," +
        "'" + data.urgentLeakOil + "'," +
        "'" + data.urgentLeakTime + "'," +
        "'" + data.addTime + "'" +
        ");SELECT @@IDENTITY as ID;";
        //     "VALUES(1,'2000000576',3,'粤BT4022',52.30,'2017-06-27 10:25:18.000')"
    console.log(sqlText);
    db.execSQL(sqlText, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);

    });

};

module.exports = gps_oil;