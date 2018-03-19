/**
 * 油品信息
 * 
 * @param {any} data 
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_quality = require('./../models/gps_quality');

module.exports.add_quality_data = function(data) {
    if (data[0].indexOf('*DFTD_YP') >= 0 && data.length >= 7) {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            addQualitytData
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
    item.gpsID = data[1];
    item.c1 = data[2].replace('pF', '');
    item.c2 = data[3].replace('pF', '');
    item.empty = data[4].replace('pF', '');
    item.full = data[5].replace('pF', '');
    item.init = data[6].replace('pF', '');
    item.volume = data[7].replace('L#', '');
    item.quality = Number(item.c1) - Number(item.init);
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
        args.vehicleNo = rows[0].VehicleNo; //iconv.encode(rows[0].VehicleNo, 'gbk').toString('binary'); 

        cb(null, args)
    });
}

function addQualitytData(args, cb) {
    //写入数据库 
    gps_quality.add_data(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}