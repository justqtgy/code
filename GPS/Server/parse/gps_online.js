var date = require('date-utils');
var iconv = require('iconv-lite');
var async = require('async');
var common = require('./../cores/common');
var map_helper = require('./../cores/map_helper');
var gps_data = require('./../models/gps_data');
var gps_online = require('./../models/gps_online');

module.exports.set_online = function(data) {
    var now = new Date().toFormat('YYYY-MM-DD');
    var args = {
        createDate: now
    };
    args.gpsID = data[1];

    async.waterfall([
        async.apply(getGPSInfo, args),
        getOnline,
        setOnline
    ], function(err, result) {
        if (err) {
            return logger.error('Error = ', err);
        }
        logger.info('Result = ', result);
    });
};


function getGPSInfo(args, cb) {
    gps_data.get_carlist(args.gpsID, function(error, rows) {
        if (error) {
            return cb(error);
        }

        if (rows.length === 0) {
            return cb('获取车辆信息失败：该车不存在');
        }

        args.vehicleID = rows[0].VehicleID;
        args.vehicleNo = rows[0].VehicleNo; //iconv.encode(rows[0].VehicleNo, 'gbk').toString('binary'); 

        cb(null, args);
    });
}

function getOnline(args, cb) {
    gps_online.get_info(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        args.id = result.length ? result[0].ID : 0;
        args.detail = '';
        cb(null, args);
    });
}

function setOnline(args, cb) {
    if (args.id === 0) {
        gps_online.add_record(args, function(error, result) {
            if (error) {
                return cb(error);
            }
            cb(null, result);
        });
    } else {
        gps_online.update_record(args, function(error, result) {
            if (error) {
                return cb(error);
            }
            cb(null, result);
        });
    }
}