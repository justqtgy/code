/**
 * 部标协议
 */

var date = require('date-utils');
var async = require('async');
var util = require('util');
var common = require('./../cores/common');
var JT808 = require('./../models/JT808');

module.exports.add_JT808_data = function(data) {
    if (data[0].substring(0,10) == '7e02000028' && data[0].substr(data[0].length-2) == '7e') {
        async.waterfall([
            async.apply(parseParams, data),
			addJT808Data
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
    logger.info(data)
    GPSID = data.substring(10,22);
    if( GPSID.charAt(0)=='0' ){
        item.GPSID=data.substring(11,22);
    }else{
        item.GPSID=GPSID;
    }
    item.ACC =( parseInt(data.substring(34,42),16)&(1<<0) ) > 0 ? 1: 0;
    item.GPSStatus =( parseInt(data.substring(34,42),16)&(1<<1) ) > 0 ? 1: 0;
    item.A =( parseInt(data.substring(34,42),16)&(1<<2) ) > 0 ? 1: 0;
    item.B =( parseInt(data.substring(34,42),16)&(1<<3) ) > 0 ? 1: 0;
    if(item.A == 1){
        item.Lat='-'+( parseInt(data.substring(42,50),16) * 0.000001 ).toFixed(6);
    }else{
        item.Lat=( parseInt(data.substring(42,50),16) * 0.000001 ).toFixed(6);
    }
    if(item.B == 1){
        item.Lng='-'+( parseInt(data.substring(50,58),16) * 0.000001 ).toFixed(6);
    }else{
        item.Lng=( parseInt(data.substring(50,58),16) * 0.000001 ).toFixed(6);
    }
    item.Speed=( parseInt(data.substring(62,66),16)*0.1 ).toFixed(2);
    time=data.substring(70,82);
    item.GPSTime='20'+time.substring(0,2)+'-'+time.substring(2,4)+'-'+time.substring(4,6)+' '+time.substring(6,8)+':'+time.substring(8,10)+':'+time.substring(10,12);
    item.CurOil=(parseInt(data.substring(102,106),16)*0.01).toFixed(2);
    item.AddTime=now;
    return cb(null, item);
}

function addJT808Data(args, cb) {
    //写入数据库
    JT808.add_JT808(args, function(error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}