var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var gps_data = require('../../models/gps_data');
var bin = require('../../../../framework/binjs');

var _fileBuffer = fs.readFileSync('./update/GPS.hex');
var len = Buffer.byteLength(_fileBuffer);
/**
 * 解析协议
 */
module.exports.parse = function(socket, data) {
    var _data = data.toString().replace('\r', '');
    var list = _data.split(',');

    if (list.length > 1) {
        if (list[0].indexOf('*HQ') >= 0) {
            add_base_data(list);
        }
        if (list[0].indexOf('*DFTD_YP') >= 0) {
            add_quality_data(list);
        }
        if (list[0].indexOf('*DFTD_LYBJ') >= 0) {
            add_alarm_data(list);
        }
        if (list[0].indexOf('update') >= 0) {
            update_clients(list);
        }
    } else {
        if (_data.substring(0, 2) == '59') {
            add_capacity_data(_data);
        } else {
            logger.info('server reponse: ', data);
            socket.write(data);
        }
    }
};

function update_clients(list) {
    var clients = list[1].split(',');
    if (clients.length === 1 && clients[0] == 'all') {
        clients.length = 0;
        for (var s in socketList) {
            clients.push(s);
        }
    }
    console.log(clients);
    clients.forEach(function(client) {
        var sockets = socketList[client];
        for (var i in sockets) {
            sockets[i].write('!start\r\n');
            var sender = send_update_file(len);
            while (true) {
                var _text = sender();
                //console.log(_text)
                if (!_text) {
                    sockets[i].write('ok!\r\n');
                    break;
                }
                //sock.write(_text);
                sockets[i].write(_text);
            }
        }
    }, this);
}

function send_update_file(value) {
    var i = 0;
    return function() {
        if (i > value) return "";
        var str = _fileBuffer.toString('utf8', i, i + 1000);
        i = i + 1000;
        return str;
    };
}


function add_base_data(data) {
    var item = {};
    if (data[0].indexOf('*HQ') >= 0) {
        item.gprsid = data[1];
        item.version = data[2];
        item.gpstime = bin.format_time(data[11], data[3]);
        item.location = data[4];
        item.lng = data[5];
        item.lat = data[7];
        item.speed = data[9];
        item.direct = data[10];
        item.status = data[12].replace('#', '');
        item.temp = 0;
        if (data.length > 12)
            item.temp = data[13].replace('T', '').replace('#', '');

        gps_data.get_carlist(item.gprsid, function(err, rows) {
            if (err) {
                logger.error('获取车辆信息失败：' + err);
                return;
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleid = rows[0].VehicleID;

            gps_data.add_data(item, function(err, result) {
                if (err) {
                    logger.error('Error = ' + err);
                }
                logger.info('Result = ' + result);
            });
        });
    }
}

function add_quality_data(data) {
    var item = {};
    if (data[0].indexOf('*DFTD_YP') >= 0) {
        item.gprsid = data[1];
        item.c1 = data[2].replace('pF', '');
        item.c2 = data[3].replace('pF', '');
        item.empty = data[4].replace('pF', '');
        item.full = data[5].replace('pF', '');
        item.init = data[6].replace('pF', '');
        item.volume = data[7].replace('L#', '');


        gps_data.get_carlist(item.gprsid, function(err, rows) {
            if (err) {
                logger.error('获取车辆信息失败：' + err);
                return;
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleid = rows[0].VehicleID;

            gps_data.add_quality(item, function(err, result) {
                if (err) {
                    logger.error('Error = ' + err);
                }
                logger.info('Result = ' + result);
            });
        });
    }
}


/*
格式如下：*DFTD_LYBJ,ID,phoneNumber# ,如(*DFTD_LYBJ,2000000100,13554766446#)
*/
function add_alarm_data(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_LYBJ') >= 0) {
        item.gprsid = data[1];
        item.mobile = data[2].replace('#', '');
        item.addtime = now;

        gps_data.get_carlist(item.gprsid, function(err, rows) {
            if (err) {
                logger.error('获取车辆信息失败：' + err);
                return;
            }

            if (rows.length === 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.carnumber = rows[0].CarNumber;
            item.vehicleid = rows[0].VehicleID;

            //发送短信
            send_alarm_msg(item);
            //延时一秒发送服务区短信
            setTimeout(function() {
                send_servicearea_msg(item);
            }, 1000);

        });
    }
}

function add_capacity_data(data) {
    /*
    var item = {};
    if (data.substr(0, 2) == '59') {
        var oil1 = data.substr(2, 4);
        item.oil1 = parseInt(oil1, 16);
        var oil2 = data.substr(6, 4);
        item.oil2 = parseInt(oil2, 16);
        item.gpstime = bin.format_time(data.substr(12, 6), data.substr(18, 6));
        item.lng = data.substr(24, 8);
        item.lat = data.substr(34, 8);
        item.speed = data.substr(44, 3);
        item.direct = data.substr(47, 3);
        item.status = data.substr(50, 8);
        item.temp = data.substr(52, 2);
    }
    */
}

function add_data(data) {
    var json = {};
    if (data.length <= 32) {
        return;
    }

    data = data.replace('7d01', '7d').replace('7d02', '7e');

    var start = data.slice(0, 2),
        end = data.slice(data.length - 2);

    if (start == '7e' && end == '7e') {
        json.deviceid = data.slice(10, 22);
        json.sn = parseInt(data.slice(22, 26), 16);
        json.alarm = parseInt(data.slice(26, 34), 16);
        json.status = parseInt(data.slice(34, 42), 16);
        var _lng = parseInt(data.slice(42, 50), 16);
        json.lng = parseFloat(_lng) / 100000;
        var _lat = parseInt(data.slice(50, 58), 16);
        json.lat = parseFloat(_lat) / 100000;
        json.high = parseInt(data.slice(58, 62), 16);
        var _speed = parseInt(data.slice(62, 66), 16);
        json.speed = parseFloat(_speed) / 10;
        json.direct = parseInt(data.slice(66, 70), 16);
        var _datetime = data.slice(70, 82);
        json.datetime = '20' + _datetime.slice(0, 2) + "-" + _datetime.slice(2, 4) + "-" + _datetime.slice(4, 6) + " " +
            _datetime.slice(6, 8) + ":" + _datetime.slice(8, 10) + ":" + _datetime.slice(10, 12);

    }
}