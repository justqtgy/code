var gps_alarm = require('./parse/gps_alarm');
var gps_oil = require('./parse/gps_oil');
var gps_point = require('./parse/gps_point');
var gps_data = require('./parse/gps_data');
var gps_online = require('./parse/gps_online');

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

        if (list[0].indexOf('*DFTD_LYBJ') >= 0) {
            gps_alarm.add_alarm_data(list);
        }

        if (list[0].indexOf('*DFTD_OIL') >= 0) {
            gps_oil.add_realoil_data(list);
        }
        if (list[0].indexOf('*DFTD_ADD_OIL') >= 0) {
            socket.write('*DFTD_ADD_OIL_OK#');
            gps_oil.add_addoil_data(list);
        }
        if (list[0].indexOf('*DFTD_ADD_LEAK_OIL') >= 0) {
            socket.write('*DFTD_LEAK_OIL_OK#');
            gps_oil.add_leakoil_data(list);
        }
        if (list[0].indexOf('*DFTD_URGENT_ADD_OIL') >= 0) {
            gps_oil.add_urgentoil_data(list);
        }
        if (list[0].indexOf('*DFTD_START_A') >= 0) {
            socket.write('*DFTD_START_A_OK#');
            gps_point.add_startpoint_data(list);
        }
        if (list[0].indexOf('*DFTD_END_B') >= 0) {
            socket.write('*DFTD_END_B_OK#');
            gps_point.add_endpoint_data(list);
        }

        // if (list[0].indexOf('*DFTD_YP') >= 0) {
        //     add_quality_data(list);
        // }

        // if (list[0].indexOf('update') >= 0) {
        //     update_clients(list);
        // }

        gps_online.set_online(list);
    }

    /*else {
        if (_data.substring(0, 2) == '59') {
            add_capacity_data(_data);
        }

        if (_data.substring(0, 2) == '7E') {
            gps_data.add_data_bubiao(data);
        }
    }
    */

};