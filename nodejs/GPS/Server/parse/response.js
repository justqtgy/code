var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var response = require('./../models/response');

module.exports.add_response_data = function(data) {
    async.waterfall([
        async.apply(parseParams, data),
        getGPSInfo,
        addResponseData
    ], function(err, result) {
        if (err) {
            return logger.error('Error = ', err);
        }
        logger.info('Result = ', result);
    });
};

function parseParams(data, cb) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    item.gpsID = data[0].substring(10,22);
    item.reply=data[0];
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

function addResponseData(args, cb) {
    //写入数据库
    response.add_response(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}
