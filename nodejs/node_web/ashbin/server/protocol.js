var gps_data = require('./parse/gps_data');
var util = require('util');


/**
 * 解析协议
 */

var GPS = [];

function revise1(data) {
    var arr = [];
    for (var i = 0; i < data.length / 2; i++) {
        arr.push('0x' + data.charAt(i * 2) + data.charAt(i * 2 + 1));
    }
    return arr
}

function revise2(data) {
    var arr = [];
    for (var i = 0; i < data.length / 2; i++) {
        arr.push(data.charAt(i * 2) + data.charAt(i * 2 + 1));
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '7d') {
            arr[i] = '7d';
            arr.splice(i + 1, 0, '01')
        }
        if (arr[i] == '7e') {
            arr[i] = '7d';
            arr.splice(i + 1, 0, '02')
        }
    }
    return arr
}

module.exports.parse = function(socket, data) {
    var _data = data.toString().replace('\r', '');
    var list = _data.split(',');
    var REPLY_MSG = '';
    var GPSID = '';

    if (_data.substring(0, 9) != 'socket.io') {
        if (GPS.indexOf(socket) < 0) {
            GPS.push(socket);
        }
    }

    if (_data.substring(0, 9) == 'socket.io') {

        logger.info(_data)

        if (_data.substring(19, 20) == '*' && _data.charAt(_data.length - 1) == "#") {

            GPSID = _data.match(/socket.io(\S*)\*/)[1];

            var str = _data.replace('socket.io' + GPSID, '');

            var sql = "select * from GPS_Remote where GPSID ='%s'";

            sql = util.format(sql, GPSID);

            db.execSQL(sql, function(err, result) {

                if (err) {
                    return callback(err, '');
                }

                Address = result[0].remoteAddress;

                Port = result[0].remotePort;

                for (var i = 0; i < GPS.length; i++) {

                    if (Address == GPS[i].remoteAddress && Port == GPS[i].remotePort) {
                        GPS[i].write(str)
                    }
                }
            });

        } else {

            GPSID = _data.substring(9, 21);

            var str = _data.replace('socket.io' + GPSID, '');

            var sql = "select * from GPS_Remote where GPSID ='%s'";

            sql = util.format(sql, GPSID);

            var num1 = parseInt(str.length / 2);

            if (num1 >= 0 && num1 <= 15) {
                num1 = '0' + num1.toString(16)
            } else {
                num1 = num1.toString(16)
            }

            var num2 = parseInt(str.length / 2) + 4;

            if (num2 >= 0 && num2 <= 15) {
                num2 = '000' + num2.toString(16);
            }
            if (num2 > 15 && num2 <= 255) {
                num2 = '00' + num2.toString(16);
            }
            if (num2 > 255 && num2 <= 4095) {
                num2 = '0' + num2.toString(16);
            }

            var _test = '8900' + num2 + GPSID + '0000' + 'f90141' + num1 + str;

            var test = revise1(_test);

            var temp = '0x00';

            for (var i = 0; i < test.length; i++) {
                temp = temp ^ test[i];
            }
            if (temp >= 0 && temp <= 15) {
                temp = '0' + temp.toString(16)
            } else {
                temp = temp.toString(16)
            }


            var buf = new Buffer(100);

            var _str = '8900' + num2 + GPSID + '0000' + 'f90141' + num1 + str + temp;
            var info = revise2(_str);
            info.splice(0, 0, "7e");
            info.splice(info.length, 0, "7e");
            console.log(info)
            console.log(info.join(","))

            for (var i = 0; i < info.length; i++) {
                buf[i] = '0x' + info[i];
            }

            db.execSQL(sql, function(err, result) {
                console.log(result);
                if (err) {
                    return callback(err, '');
                }
                Address = result[0].remoteAddress;

                Port = result[0].remotePort;

                for (var i = 0; i < GPS.length; i++) {

                    if (Address == GPS[i].remoteAddress && Port == GPS[i].remotePort) {
                        GPS[i].write(buf)
                        logger.info('buf' + buf)
                    }

                }
            });

        }
    }

    if (list.length > 1 && _data.substring(0, 9) != 'socket.io') {

        if (list[0].indexOf('*HQ') >= 0 && list[0].indexOf('I2') < 0) {
            gps_data.add_data_tianhe(list);
            var remote = list[1] + ',' + socket.remoteAddress + ',' + socket.remotePort;
            var arr = remote.split(',');
            gps_remote.add_remote_data(arr)
        }

        //司机卡协议
        if (list[0].indexOf('*HQ') >= 0 && list[2].indexOf('I2') >= 0 && list[6].indexOf('40') >= 0) {
            driver_card.add_driverCard_data(list);
        }

        if (list[0].indexOf('*DFTD_LYBJ') >= 0) {
            gps_alarm.add_alarm_data(list);
            REPLY_MSG = '*DFTD_LYBJ_OK#';
            GPSID = list[1];
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG + ',' + GPSID);
            }, 5000);
        }

        if (list[0].indexOf('*DFTD_OIL') >= 0) {
            gps_oil.add_realoil_data(list);
        }
        if (list[0].indexOf('*DFTD_ADD_OIL') >= 0) {
            gps_oil.add_addoil_data(list);

            REPLY_MSG = '*DFTD_ADD_OIL_OK#';
            GPSID = list[1];
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG + ',' + GPSID);
            }, 5000)
        }
        if (list[0].indexOf('*DFTD_LEAK_OIL') >= 0) {
            gps_oil.add_leakoil_data(list);

            REPLY_MSG = '*DFTD_LEAK_OIL_OK#';
            GPSID = list[1];
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG + ',' + GPSID);
            }, 5000);
        }
        if (list[0].indexOf('*DFTD_URGENT_ADD_OIL') >= 0) {
            gps_oil.add_oilUrgentAdd_data(list);
        }
        if (list[0].indexOf('*DFTD_URGENT_LEAK_OIL') >= 0) {
            gps_oil.add_oilUrgentLeak_data(list);
        }
        if (list[0].indexOf('*DFTD_START_A') >= 0) {
            gps_point.add_startpoint_data(list);

            REPLY_MSG = '*DFTD_START_A_OK#';
            var i = 0;
            var int = setInterval(function() {
                i++;
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG);
                if (i >= 100) {
                    i = 0;
                    clearInterval(int);
                }
            }, 5000);
        }
        if (list[0].indexOf('*DFTD_END_B') >= 0) {
            gps_point.add_endpoint_data(list);

            REPLY_MSG = '*DFTD_END_B_OK#';
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG);
            }, 5000)
        }

        if (list[0].indexOf('*DFTD_YP') >= 0) {
            gps_quality.add_quality_data(list);
        }

        // if (list[0].indexOf('update') >= 0) {
        //     update_clients(list);
        // }

        gps_online.set_online(list);

        if (list[0].indexOf('*DFTD_LJT') >= 0) {
            gps_rubbish.add_rubbish_data(list);
        }

        if (list[0].indexOf('*GET_SERVER_TIME') >= 0) {
            setTimeout(function() {
                REPLY_MSG = getCurrentTime();
                GPSID = list[1].replace('#', '');
                socket.write('*SERVER_TIME,' + REPLY_MSG + '#');
                logger.info('REPLY = ', 'SERVER_TIME,' + REPLY_MSG + ',' + GPSID);
            }, 5000)
        }

        if (list[0].indexOf('*GET_BJ_SERVER_TIME') >= 0) {
            setTimeout(function() {
                REPLY_MSG = getCurrentTime();
                GPSID = list[1].replace('#', '');
                socket.write('~BJ_SERVER_TIME,' + REPLY_MSG + '~');
                logger.info('REPLY = ', 'BJ_SERVER_TIME,' + REPLY_MSG + ',' + GPSID);
            }, 5000);
        }

    } else {
        _data = _data.toUpperCase();

        // if (_data.substring(0, 2) == '59') {
        //     add_capacity_data(_data);
        // }

        if (_data.substring(0, 2) == '7E' && _data.indexOf('2A444654445F595948') > 0) {
            gps_level.add_level_data(_data);
        }
    }
};

