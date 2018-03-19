/**
 * 司机卡协议
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var driver_card = require('./../models/driver_card');

module.exports.add_driverCard_data = function(data) {
    if (data[0].indexOf('*HQ') >= 0 && data[2].indexOf('I2') >= 0 && data[6].indexOf('40') >=0) {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            addDriverCardData
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
    if(Number(data[3].substring(0,2))+8>=24){
        hours=Number(data[3].substring(0,2))+8-24
    }else{
        hours=Number(data[3].substring(0,2))+8
    }
    minutes=data[3].substring(2,4);
    seconds=data[3].substring(4,6);
    item.gpsTime = hours+':'+minutes+':'+seconds;
    item.status=data[7].substring(0,1) == 'A' ? 1 : 0;
    item.driverName=data[7].substring(1,11);
    item.keep=data[7].substring(35,41);
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

function addDriverCardData(args, cb) {
    //写入数据库
    driver_card.add_driverCard(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}
