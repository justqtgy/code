var date = require('date-utils');
var iconv = require('iconv-lite');
var async = require('async');
var common = require('./../cores/common');
var map_helper = require('./../cores/map_helper');
var gps_data = require('./../models/gps_data');
var gps_oil = require('./../models/gps_oil');
var gps_point = require('./../models/gps_point');

/*
 *A点触发数据协议
 *格式如下：*DFTD_START_A,2000000576,100.1L,A,094506,240116,2239.5530,N,11404.4116,E# 
 */
module.exports.add_startpoint_data = function(data) {
    if (data[0].indexOf('*DFTD_START_A') >= 0 && data.length >= 10) {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            addStartPointData
        ], function(err, result) {
            if (err) {
                return logger.error('Error = ', err);
            }
            logger.info('Result = ', result);
        });
    }
};

/*
 *B点结束数据
 *格式如下：*DFTD_END_B,2000000576,50.1L,A,094506,240116,2239.5530,N,11404.4116,E# 
 */
module.exports.add_endpoint_data = function(data) {
    if (data[0].indexOf('*DFTD_END_B') >= 0 && data.length >= 10) {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            getStartPointRecord,
            getOilAddRecord,
            addEndPointData
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
    item.curOil = parseFloat(data[2].replace('L', '')).toFixed(2);
    item.gpsStatus = data[3] == 'A' ? 1 : 0;
    item.gpsTime = common.format_time(data[5], data[4]);
    item.addTime = now;

    var lat = parseFloat(data[6]) * 0.01; //纬度
    var lng = parseFloat(data[8]) * 0.01; //经度
    item.lat = common.changeLocation(lat.toString());
    item.lng = common.changeLocation(lng.toString());

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

function getStartPointRecord(args, cb) {
    gps_point.get_startpoint_record(args, function(error, rows) {
        if (error) {
            return cb(error)
        }
        args.id = rows[0].ID;
        args.oilUsed = rows[0].CurOil1 - args.curOil; //油耗
        args.distance = map_helper.getDistance(rows[0].Lng1, rows[0].Lat1, args.lng, args.lat)
        args.startObject = rows[0];

        cb(null, args)
    })
}

function getOilAddRecord(args, cb) {
    if (args.oilUsed > 0) {
        cb(null, args)
    } else {
        var data = {
            gpsID: args.gpsID,
            beginTime: args.startObject.AddTime1,
            endTime: args.addTime,
        }
        gps_oil.get_oiladd_record(data, function(error, result) {
            if (error || (result && result.length == 0)) {
                return cb(null, args)
            }
            args.oilUsed += Number(result[0].AddOil);
            cb(null, args)
        });
    }
}

function addStartPointData(args, cb) {
    //写入数据库 
    gps_point.add_startpoint_data(args, function(error, result) {
        if (error) {
            return cb(error)
        }
        cb(null, result)
    });
}

function addEndPointData(args, cb) {
    //写入数据库 
    gps_point.add_endpoint_data(args, function(error, result) {
        if (error) {
            return cb(error)
        }
        cb(null, result)
    });
}