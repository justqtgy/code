/**
 * 数据测试
 *
 * @param {any} data
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_test = require('./../models/gps_test');

module.exports.add_test_data = function(data) {
    if (data[0].indexOf('SSSA') >= 0 || data[0].indexOf('SSSD') >= 0 || data[0].indexOf('SSSS') >= 0 || data[0].indexOf('XXXA') >= 0 || data[0].indexOf('XXXD') >= 0) {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            addTestData
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
    item.gpsID = data[0].substring(0,10);
    item.info = data[0];
    item.addTime = now;
    return cb(null, item);
}

function getGPSInfo(args, cb) {
    gps_data.get_carlist(args.gpsID, function(error, rows) {
        if (error) {
            return cb(error)
        }

        if (rows.length === 0) {
            return cb('获取车辆信息失败：该车不存在' + args.gpsID);
        }

        args.vehicleID = rows[0].VehicleID;
        args.vehicleNo = rows[0].VehicleNo;

        cb(null, args)
    });
}

function addTestData(args, cb) {
    //写入数据库
    gps_test.add_test(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}
