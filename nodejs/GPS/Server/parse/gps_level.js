/**
 * 液位高度百分比
 * 
 * @param {any} data 
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_level = require('./../models/gps_level');

/**
 * 7E090000320120000004910000FF2A444654445F5959482B040000004200000000000C00000159C18F06CC9FF3005B000000C5170622194144010400000064XX7E
 */
module.exports.add_level_data = function(data) {
    if (data.indexOf('09000032') > 0) {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            addLevelData
        ], function(err, result) {
            if (err) {
                return logger.error('Error = ', err);
            }
            logger.info('Result = ', result);
        });
    }
};

function parseParams(data, cb) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    item.gpsID = data.slice(10, 22);
    item.level1 = (parseInt(data.slice(50, 54), 16) * 0.01) + '%';
    item.level2 = (parseInt(data.slice(54, 58), 16) * 0.01) + '%';
    item.position = data.slice(58, 64);
    item.status = parseInt(data.slice(64, 72), 16);
    var _lng = parseInt(data.slice(72, 80), 16);
    item.lng = parseFloat(_lng) / 100000;
    var _lat = parseInt(data.slice(80, 88), 16);
    item.lat = parseFloat(_lat) / 100000;
    item.high = parseInt(data.slice(88, 92), 16);
    var _speed = parseInt(data.slice(92, 96), 16);
    item.speed = parseFloat(_speed) / 10;
    item.direct = parseInt(data.slice(96, 100), 16);
    var _datetime = data.slice(100, 112);
    item.datetime = '20' + _datetime.slice(0, 2) + "-" + _datetime.slice(2, 4) + "-" + _datetime.slice(4, 6) + " " +
        _datetime.slice(6, 8) + ":" + _datetime.slice(8, 10) + ":" + _datetime.slice(10, 12);
    item.msgid = data.slice(112, 116);
    item.distance = parseInt(data.slice(116, 122));
    item.addTime = now;
    console.log(item);
    return cb(null, item);
}

function getGPSInfo(args, cb) {
    gps_data.get_carlist(args.gpsID, function(error, rows) {
        if (error) {
            return cb(error);
        }

        if (rows.length === 0) {
            return cb('获取车辆信息失败：该车不存在' + args.gpsID);
        }

        args.vehicleID = rows[0].VehicleID;
        args.vehicleNo = rows[0].VehicleNo;

        cb(null, args);
    });
}

function addLevelData(args, cb) {
    //写入数据库 
    gps_level.add_data(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}