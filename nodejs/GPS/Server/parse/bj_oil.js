var date = require('date-utils');
var iconv = require('iconv-lite');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_oil = require('./../models/gps_oil');
var gps_last = require('./gps_last');

function revise(data){
    var arr=[];
    for( var i = 0; i < data[0].length/2; i++ ){
        arr.push( data[0].charAt(i*2)+ data[0].charAt(i*2+1) );
    }
    logger.info(arr);
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
    return data
}

//部标实时油量协议
module.exports.add_bj_real_oil_data = function(data) {
    if (data[0].substring(0,10) == '7e0900001e' && data[0].substr(data[0].length-2) == '7e') {
        var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
        var item = {};
        data=revise(data);
        item.gpsID = data.substring(10,22);
        item.oilStatus=1;
        item.curOil=parseInt(data.substring(46,50),16) / 10;
        //item.ACC =( parseInt(data.substring(50,58),16)&(1<<0) ) > 0 ? 1: 0;
        item.gpsStatus =( parseInt(data.substring(50,58),16)&(1<<1) ) > 0 ? 1: 0;
        item.A = ( parseInt(data.substring(50,58),16)&(1<<2) ) > 0 ? 1: 0;
        item.B = ( parseInt(data.substring(50,58),16)&(1<<3) ) > 0 ? 1: 0;
        if(item.A == 1){
            item.lat='-'+( parseInt(data.substring(58,66),16) * 0.000001 ).toFixed(6);
        }else{
            item.lat=( parseInt(data.substring(58,66),16) * 0.000001 ).toFixed(6);
        }
        if(item.B == 1){
            item.lng='-'+( parseInt(data.substring(66,74),16) * 0.000001 ).toFixed(6);
        }else{
            item.lng=( parseInt(data.substring(66,74),16) * 0.000001 ).toFixed(6);
        }
        time=data.substring(74,86);
        item.gpsTime='20'+time.substring(0,2)+'-'+time.substring(2,4)+'-'+time.substring(4,6)+' '+time.substring(6,8)+':'+time.substring(8,10)+':'+time.substring(10,12);
        item.addTime=now;

        gps_data.get_carlist(item.gpsID, function(error, rows) {
            if (error) {
                return logger.error('Error = ', error);
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在', item.gpsID);
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].VehicleNo;

            //写入数据库
            gps_oil.add_oilreal_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }

                logger.info('Result = ', result);
                //定位和轨迹
                gps_last.set_lastinfo(item);
            });
        });
    }
};

//部标加油协议

module.exports.add_bj_add_oil_data = function(data) {
    if (data[0].substring(0,10) == '7e09000026' && data[0].substr(data[0].length-2) == '7e') {
        var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
        var item = {};
        data=revise(data);
        item.gpsID = data.substring(10,22);
        item.addOil=parseInt(data.substring(54,58),16) / 10;
        item.preOil=parseInt(data.substring(58,62),16) / 10;
        item.curOil=parseInt(data.substring(62,66),16) / 10;
        item.ACC =( parseInt(data.substring(66,74),16)&(1<<0) ) > 0 ? 1: 0;
        item.gpsStatus =( parseInt(data.substring(66,74),16)&(1<<1) ) > 0 ? 1: 0;
        item.A =( parseInt(data.substring(66,74),16)&(1<<2) ) > 0 ? 1: 0;
        item.B =( parseInt(data.substring(66,74),16)&(1<<3) ) > 0 ? 1: 0;
        if(item.A == 1){
            item.lat='-'+( parseInt(data.substring(74,82),16) * 0.000001 ).toFixed(6);
        }else{
            item.lat=( parseInt(data.substring(74,82),16) * 0.000001 ).toFixed(6);
        }
        if(item.B == 1){
            item.lng='-'+( parseInt(data.substring(82,90),16) * 0.000001 ).toFixed(6);
        }else{
            item.lng=( parseInt(data.substring(82,90),16) * 0.000001 ).toFixed(6);
        }
        time=data.substring(90,102);
        item.gpsTime='20'+time.substring(0,2)+'-'+time.substring(2,4)+'-'+time.substring(4,6)+' '+time.substring(6,8)+':'+time.substring(8,10)+':'+time.substring(10,12);
        item.addTime=now;

        gps_data.get_carlist(item.gpsID, function(error, rows) {
            if (error) {
                return logger.error('Error = ', error);
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在', item.gpsID);
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].VehicleNo;

            //写入数据库
            gps_oil.add_oiladd_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }
                logger.info('Result = ', result);
                //定位和轨迹
                gps_last.set_lastinfo(item);
            });

        });

    }
};

//部标漏油协议

module.exports.add_bj_leak_oil_data = function(data) {
    if (data[0].substring(0,10) == '7e09000027' && data[0].substr(data[0].length-2) == '7e') {
        var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
        var item = {};
        data=revise(data);
        item.gpsID = data.substring(10,22);
        item.addOil=-parseInt(data.substring(56,60),16) / 10;
        item.preOil=parseInt(data.substring(60,64),16) / 10;
        item.curOil=parseInt(data.substring(64,68),16) / 10;
        item.ACC =( parseInt(data.substring(68,76),16)&(1<<0) ) > 0 ? 1: 0;
        item.gpsStatus =( parseInt(data.substring(68,76),16)&(1<<1) ) > 0 ? 1: 0;
        item.A =( parseInt(data.substring(68,76),16)&(1<<2) ) > 0 ? 1: 0;
        item.B =( parseInt(data.substring(68,76),16)&(1<<3) ) > 0 ? 1: 0;
        if(item.A == 1){
            item.lat='-'+( parseInt(data.substring(76,84),16) * 0.000001 ).toFixed(6);
        }else{
            item.lat=( parseInt(data.substring(76,84),16) * 0.000001 ).toFixed(6);
        }
        if(item.B == 1){
            item.lng='-'+( parseInt(data.substring(84,92),16) * 0.000001 ).toFixed(6);
        }else{
            item.lng=( parseInt(data.substring(84,92),16) * 0.000001 ).toFixed(6);
        }

        time=data.substring(92,114);
        item.gpsTime='20'+time.substring(0,2)+'-'+time.substring(2,4)+'-'+time.substring(4,6)+' '+time.substring(6,8)+':'+time.substring(8,10)+':'+time.substring(10,12);
        item.addTime=now;

        gps_data.get_carlist(item.gpsID, function(error, rows) {
            if (error) {
                return logger.error('Error = ', error);
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在', item.gpsID);
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].VehicleNo; //iconv.encode(rows[0].VehicleNo, 'gbk').toString('binary');

            //写入数据库
            gps_oil.add_oilleak_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }

                logger.info('Result = ', result);

                //定位和轨迹
                // if (item.gpsStatus == 1) {
                //     gps_last.set_lastinfo(item);
                // }
                gps_last.set_lastinfo(item);
            });
        });
    }
};


