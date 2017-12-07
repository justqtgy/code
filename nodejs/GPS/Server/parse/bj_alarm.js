var date = require('date-utils');
var iconv = require('iconv-lite');
var sms = require('./../cores/sms_helper');
var gps_alarm = require('./../models/gps_alarm');
var gps_data = require('./../models/gps_data');


/*
 *部标漏油发送短信报警
 */

module.exports.add_alarm_data = function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('7e444654445f4c59424a') >= 0 ) {
        item.gpsID = data[0].substring(20,32);
        item.mobile = data[0].substring(33,44);
        item.addTime = now;

        gps_data.get_carlist(item.gpsID, function(error, result) {
            if (error) {
                logger.error('get_carlist error = ', error);
                return;
            }

            var rows = result;
            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在', item.gpsID);
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].VehicleNo;

            //发送短信
            send_alarm_msg(item);
            //延时一秒发送服务区短信
            setTimeout(function() {
                send_servicearea_msg(item);
            }, 1000);
        });
    }
};


var send_alarm_msg = function(data) {
    //写入数据库
    data.typeID = 1;

    gps_alarm.add_alarm(data, function(error, result) {
        if (error) {
            logger.error('send_alarm_msg = ', error);
            return;
        }
        logger.info('Result = ', result);

        logger.info('给司机发送报警短信...');
        var sender = {};
        sender.mobile = data.mobile;
        sender.content = data.vehicleNo + '在' + data.addTime + '出现漏油异常【鼎丰泰达】';
        logger.info(sender);
        sms.send_sms_request(sender);
    });
};

//给服务区发短信
var send_servicearea_msg = function(data) {
    console.log(data)
    //获取司机设置的服务区号码
    gps_data.get_driver_vhc(data.vehicleID, function(error, result) {
        if (error) {
            logger.error('send_servicearea_msg = ', error);
            return;
        }
        logger.info('司机设置的服务区信息 = ', result);
        if (result.length > 0 && result[0].SA_Tel) {
            //写入数据库
            var sa_tel = result[0].SA_Tel;
            data.typeID = 2;
            data.mobile = sa_tel;
            result = gps_alarm.add_alarm(data);
            logger.info('Result = ', JSON.stringify(result));

            logger.info('给服务区发送短信...');
            var sender = {};
            sender.mobile = sa_tel;
            sender.content = data.vehicleNo + '在' + data.addTime + '出现漏油异常【鼎丰泰达】';
            logger.info(sender);
            sms.send_sms_request(sender);
        }
    });
}