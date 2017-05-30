var date = require('date-utils');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_last = require('./gps_last');
/*
格式如下：*HQ,2000000576,V1,155959,A,3451.0352,N,11909.9121,E,0000,292,200517,FFFFFBFF#,T0.0#
*/
/*
module.exports.add_data_tianhe = async function(data) {
    var item = {};
    if (data[0].indexOf('*HQ') >= 0 && data.length >= 13) {
        item.gpsID = data[1];
        item.version = data[2];
        item.gpsTime = common.format_time(data[11], data[3]);
        item.location = data[4];
        item.lat = parseFloat(data[5]) * 0.01; //纬度
        item.lng = parseFloat(data[7]) * 0.01; //经度 
        item.speed = data[9];
        item.direct = data[10];
        item.status = data[12].replace('#', '');
        item.temp1 = 0;
        if (data.length > 12)
            item.temp1 = data[13].replace('T', '').replace('#', '');
        item.temp2 = 0;
        item.temp3 = 0;
        item.temp4 = 0;
        item.oil1 = 0;
        item.oil2 = 0;

        try {
            let result = await gps_data.get_carlist(item.gpsID);
            let rows = result;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].VehicleNo;

            result = await gps_data.add_data(item);
            logger.info('Result = ', result);

        } catch (error) {
            return logger.error('Error = ', error);
        }
    }
}
*/

module.exports.add_data_tianhe = function(data) {
    var item = {};
    if (data[0].indexOf('*HQ') >= 0 && data.length >= 13) {
        item.gpsID = data[1];
        item.version = data[2];
        item.gpsTime = common.format_time(data[11], data[3]);
        item.location = data[4];
        item.lat = parseFloat(data[5]) * 0.01; //纬度
        item.lng = parseFloat(data[7]) * 0.01; //经度 
        item.speed = data[9];
        item.direct = data[10];
        item.status = data[12].replace('#', '');
        item.temp1 = 0;
        if (data.length > 12)
            item.temp1 = data[13].replace('T', '').replace('#', '');
        item.temp2 = 0;
        item.temp3 = 0;
        item.temp4 = 0;
        item.oil1 = 0;
        item.oil2 = 0;

        gps_data.get_carlist(item.gpsID, function(error, rows) {
            if (error) {
                return logger.error('Error = ', error);
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            //此处调用的存储过程，所以需要转换
            item.vehicleNo = rows[0].VehicleNo;

            gps_data.add_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }

                logger.info('Result = ', result);
            });
            //定位和轨迹
            gps_last.set_lastinfo(item);
        });
    }
};

/**
 * 部标协议：
 * 7E0200002C0134185891046EBC00000000000C00030157B95506CC00C4000200A101271601041103442B04000023205108012C039800000000A47E
 * @param {any} data 
 * @returns 
 */
/*
module.exports.add_data_bubiao = async function(data) {
    var item = {};
    if (data.length <= 114) {
        return;
    }

    data = data.replace('7d01', '7d').replace('7d02', '7e');

    var start = data.slice(0, 2),
        end = data.slice(data.length - 2);

    if (start == '7e' && end == '7e') {
        item.gps_id = data.slice(10, 22);
        item.sn = parseInt(data.slice(22, 26), 16);
        item.alarm = parseInt(data.slice(26, 34), 16);
        item.status = parseInt(data.slice(34, 42), 16);
        var _lng = parseInt(data.slice(42, 50), 16);
        item.lng = parseFloat(_lng) / 100000;
        var _lat = parseInt(data.slice(50, 58), 16);
        item.lat = parseFloat(_lat) / 100000;
        item.high = parseInt(data.slice(58, 62), 16);
        var _speed = parseInt(data.slice(62, 66), 16);
        item.speed = parseFloat(_speed) / 10;
        item.direct = parseInt(data.slice(66, 70), 16);
        var _datetime = data.slice(70, 82);
        item.datetime = '20' + _datetime.slice(0, 2) + "-" + _datetime.slice(2, 4) + "-" + _datetime.slice(4, 6) + " " +
            _datetime.slice(6, 8) + ":" + _datetime.slice(8, 10) + ":" + _datetime.slice(10, 12);
        var _oil = data.slice(82, 94);
        item.oil1 = parseInt(_oil.slice(4, 8), 16) * 0.01;
        item.oil2 = parseInt(_oil.slice(8, 12), 16) * 0.01;

        var _temp = data.slice(94, 114);
        item.temp1 = parseInt(_temp(4, 8), 16);
        item.temp2 = parseInt(_temp(8, 12), 16);
        item.temp3 = parseInt(_temp(12, 16), 16);
        item.temp4 = parseInt(_temp(16, 20), 16);

        try {
            let result = await gps_data.get_carlist(item.gps_id);
            let rows = result.recordsets;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicle_id = rows[0].VehicleID;
            item.vehicle_no = rows[0].VehicleNo;

            result = await gps_data.add_data(item);
            logger.info('Result = ', result);

        } catch (error) {
            return logger.error('Error = ', err);
        }
    }
}
*/