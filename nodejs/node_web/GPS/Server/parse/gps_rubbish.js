/**
 * 垃圾桶
 *
 * @param {any} data
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_rubbish = require('./../models/gps_rubbish');

module.exports.add_rubbish_data = function(data) {
    if (data[0].indexOf('*DFTD_LJT') >= 0 && data.length >= 11) {
        async.waterfall([
            async.apply(parseParams, data),
            addRubbishData
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
    if(data[6]=='000000' && data[5]=='000000'){
        item.gpsTime='1995-01-01 00:00'
    }else{
        item.gpsTime = common.format_time(data[6], data[5]);
    }
    item.gpsID = data[1];
    item.oilStatus = data[2] == 'A' ? 1 : 0;
    item.content = parseFloat(data[3].replace('L', '')).toFixed(2);
    item.gpsStatus = data[4] == 'A' ? 1 : 0;

    item.addTime = now;
    var lat = parseFloat(data[7]) * 0.01; //纬度
    var lng = parseFloat(data[9]) * 0.01; //经度
    item.lat = common.changeLocation(lat.toString());
    item.lng = common.changeLocation(lng.toString());
    item.energy = data[11];
    item.weight = parseFloat(data[12] * 0.1).toFixed(1);
    item.C1 = parseFloat(data[13].replace('pF', '')).toFixed(2);
    item.C2 = parseFloat(data[14].replace('pF#', '')).toFixed(2);
    return cb(null, item);
}

function addRubbishData(args, cb) {
    //写入数据库
    gps_rubbish.add_rubbish(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}