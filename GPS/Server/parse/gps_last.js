var date = require('date-utils');
var iconv = require('iconv-lite');
var async = require('async');
var common = require('./../cores/common');
var map_helper = require('./../cores/map_helper');
var gps_data = require('./../models/gps_data');
var gps_last = require('./../models/gps_last');
var gps_traffic = require('./gps_traffic');

module.exports.set_lastinfo = function(data) {
    var now = new Date().toFormat('YYYY-MM-DD');
    var time = new Date().toFormat('HH24:MI');
    data.createDate = now;
    data.time = time;
    async.waterfall([
        async.apply(getLastInfo, data),
        setLastInfo,
    ], function(err, result) {
        if (err) {
            return logger.error('Error = ', err);
        }
        logger.info('Result = ', result);

        if (data.distance < 1000) {
            logger.info('Tip = 距离太短不更新坐标：' + data.gpsID + ', ' + data.vehicleID + ', ' + data.vehicleNo + ', ' + data.distance);
        }
        console.log(data);
        //设置轨迹
        gps_traffic.set_traffic(data);
    });
};

function getLastInfo(args, cb) {
    gps_last.get_info(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        args.lastID = 0;
        if (result.length > 0) {
            args.lastID = result[0].ID;
            args.lng0 = result[0].Lng;
            args.lat0 = result[0].Lat;
            //args.curOil = result[0].CurOil;
            var distance = map_helper.getDistance(args.lng0, args.lat0, args.lng, args.lat);
            args.range = (Number(result[0].OverRange) + Number(distance)).toFixed(4);
        }
        cb(null, args);
    });
}

function setLastInfo(args, cb) {
    if (args.lastID === 0) {
        gps_last.add_record(args, function(error, result) {
            if (error) {
                return cb(error);
            }
            cb(null, result);
        });
    } else {
        gps_last.update_record(args, function(error, result) {
            if (error) {
                return cb(error);
            }
            cb(null, result);
        });
    }
}