var date = require('date-utils');
var iconv = require('iconv-lite');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var map_helper = require('./../cores/map_helper');
var gps_data = require('./../models/gps_data');
var gps_traffic = require('./../models/gps_traffic');

module.exports.set_traffic = function(data) {
	//如果定位有效则更改经纬度
	if(data.gpsStatus != 1){
		return logger.error('Error = 经纬度无效:', data)
	}
	data.distance = data.distance || 0;
	data.curOil = data.curOil || 0;
	data.addOil = data.addOil || 0;
	data.traffic = util.format('{"time":"%s", "lng":"%s", "lat":"%s"}', data.time, data.lng, data.lat);

    async.waterfall([
        async.apply(getTraffic, data),
        setTraffic
    ], function(err, result) {
        if (err) {
            return logger.error('Error = ', err);
        }
        logger.info('Result = ', result);
    });
};

function getTraffic(args, cb) {
    gps_traffic.get_info(args, function(error, result) {
        if (error) {
            return cb(error);
        }

        args.trafficID = 0;
        if (result.length > 0) {
            args.trafficID = result[0].ID;
            args.traffic = ',' + args.traffic;
        }
        cb(null, args);
    });
}

function setTraffic(args, cb) {
    if (args.trafficID === 0) {
        gps_traffic.add_record(args, function(error, result) {
            if (error) {
                return cb(error);
            }
            cb(null, result);
        });
    } else {
        gps_traffic.update_record(args, function(error, result) {
            if (error) {
                return cb(error);
            }
            cb(null, result);
        });
    }
}