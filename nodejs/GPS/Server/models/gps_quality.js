/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */
var sql = require('mssql');
var iconv = require('iconv-lite');
var db = require('../models/mssql_helper');
var util = require('util');

function gps_quality() {

}

// gps_quality.add_data_history = function(data, callback) {
//     var sqlText = "INSERT INTO GPS_Quality (GPSID, VehicleID, VehicleNo, C1, C2, [Empty],  [Full], [Init], [Volume], [Quality], AddTime) " +
//         "VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');SELECT @@IDENTITY as ID;";
//     sqlText = util.format(sqlText, data.gpsID, data.vehicleID, data.vehicleNo, data.c1, data.c2, data.empty, data.full, data.init, data.volume, data.quality, data.addTime);
//     db.execSQL(sqlText, function(err, result) {
//         if (err) {
//             return callback(err, '');
//         }

//         callback(err, result);
//     });
// };


gps_quality.add_data = function(data, callback) {
    var _gpsID = data.gpsID,
        _vehicleID = data.vehicleID,
        _vehicleNo = iconv.encode(data.vehicleNo, 'gbk').toString('binary'),
        _c1 = data.c1,
        _c2 = data.c2,
        _empty = data.empty,
        _full = data.full,
        _init = data.init,
        _volume = data.volume,
        _quality = data.quality;

    var params = [
        { name: 'GPSID', type: sql.VarChar(50), value: _gpsID },
        { name: 'VehicleID', type: sql.VarChar(20), value: _vehicleID },
        { name: 'VehicleNo', type: sql.VarChar(50), value: _vehicleNo },
        { name: 'C1', type: sql.VarChar(20), value: _c1 },
        { name: 'C2', type: sql.VarChar(20), value: _c2 },
        { name: 'Empty', type: sql.Decimal(18, 2), value: _empty },
        { name: 'Full', type: sql.Decimal(18, 2), value: _full },
        { name: 'Init', type: sql.Decimal(18, 2), value: _init },
        { name: 'Volume', type: sql.Decimal(18, 2), value: _volume },
        { name: 'Quality', type: sql.Decimal(18, 2), value: _quality }
    ];

    db.execSP("cp_gps_quality_add", params, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
};

module.exports = gps_quality;