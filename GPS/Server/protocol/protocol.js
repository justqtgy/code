var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var date = require('date-utils')
var gps_data = require('./../models/gps_data');
var common = require('./../cores/common');

var online = require('./../models/stat_online');

var _fileBuffer = fs.readFileSync('./update/GPS.hex');
var len = Buffer.byteLength(_fileBuffer);

var gps_alarm = require('gps_alarm');
var gps_oil = require('gps_oil');
var gps_data = require('gps_data');
/**
 * 解析协议
 */
module.exports.parse = function(socket, data) {
    var _data = data.toString().replace('\r', '');
    var list = _data.split(',');

    if (list.length > 1) {
        if (list[0].indexOf('*HQ') >= 0) {
            gps_data.add_data_tianhe(list);
        }
        if (list[0].indexOf('*DFTD_YP') >= 0) {
            add_quality_data(list);
        }
        if (list[0].indexOf('*DFTD_LYBJ') >= 0) {
            gps_alarm.add_alarm_data(list);
        }
        if (list[0].indexOf('*DFTD_ADD_LEAK_OIL') >= 0) {
            gps_oil.add_oil_data(list);
        }
        // if (list[0].indexOf('update') >= 0) {
        //     update_clients(list);
        // }
    } else {
        if (_data.substring(0, 2) == '59') {
            add_capacity_data(_data);
        }

        if (_data.substring(0, 2) == '7E') {
            gps_data.add_data_bubiao(data);
        }
    }

    //setOnline(data);

};

function setOnline(data) {
    try {
        var now = new Date().toFormat('YYYY-MM-DD');
        data.createdate = now;
        online.get_info(data, function(err, result) {
            if (err) {
                return logger.error(err);
            }

            if (result.length == 0) {
                online.add_record(data, function(err, result) {

                })
            } else {
                // online.update_record(data, function(err, result) {

                // })
            }
        });
    } catch (error) {
        logger.error(error);
    }
}