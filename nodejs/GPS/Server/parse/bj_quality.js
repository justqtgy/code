/**
 * 部标协议
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_quality = require('./../models/gps_quality');

module.exports.add_bj_quality_data = function(data) {

    if(data[0].substring(0,10) == '7e09000013' && data[0].substr(data[0].length-2) == '7e') {
        async.waterfall([
            async.apply(parseParams, data),
            getGPSInfo,
            addBjQualityData
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
    var arr=[];
    for( var i = 0; i < data[0].length/2; i++ ){
        arr.push( data[0].charAt(i*2)+ data[0].charAt(i*2+1) );
    }
    logger.info(arr)
    for(var i=0;i<arr.length;i++){
        if( arr[i]=='7d'&&arr[i+1]=='01' ){
            arr[i]='7d';
            arr.splice(i+1,1);
        }
        if( arr[i]=='7d'&&arr[i+1]=='02' ){
            arr[i]='7e';
            arr.splice(i+1,1);
        }
    }
    data=arr.join('');

    logger.info(data);

    item.gpsID = data.substring(10,22);
    item.c1=(parseInt(data.substring(44,48),16) /100).toFixed(2);
    item.c2=(parseInt(data.substring(48,52),16) /100).toFixed(2);
    item.empty=(parseInt(data.substring(52,56),16) /100).toFixed(2);
    item.full=(parseInt(data.substring(56,60),16) /100).toFixed(2);
    item.init=(parseInt(data.substring(60,64),16) /100).toFixed(2);
    item.volume = 1;
    if(Number(item.c2) - Number(item.empty)>5){
        item.quality = Number(item.c1) - Number(item.init);
    } else if(item.quality==null){
        item.quality = 0
    }
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

function  addBjQualityData(args, cb) {
    //写入数据库
    gps_quality.add_data(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}



