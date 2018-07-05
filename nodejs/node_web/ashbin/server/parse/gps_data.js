var date = require('date-utils');
var common = require('./../cores/common');
var gps_data = require('./../db/gps_data');
var gps_last = require('./gps_last');

/**
 * 部标协议：
 * 7E090000420120000004910000FA2A444654445F4C4A540201800158003500003600028514000035000036002000000000000C00000159C18F06CC9FF3005B000000C5170622194144010400000064XX7E
 * @param {any} data 
 * @returns 
 */

module.exports.add_data = async function(data) {
    var item = {};
    if (data.length <= 114) {
        return;
    }

    //data = data.replace('7d01', '7d').replace('7d02', '7e');

    var start = data.slice(0, 2),
        end = data.slice(data.length - 2);

    if (start == '7e' && end == '7e') {
        item.gps_id = data.slice(10, 22);
        item.sn = parseInt(data.slice(22, 26), 16);
        item.num = parseInt(data.slice(46, 48), 16);
        item.weight1 = 0.1*parseInt(data.slice(48, 52), 16);
        item.volume1 = 0.01*parseInt(data.slice(52, 56), 16);
        item.capacity1_c1 = 0.01*parseInt(data.slice(56, 62), 16);
        item.capacity1_c2 = 0.01*parseInt(data.slice(62, 68), 16);
        item.weight2 = 0.1*parseInt(data.slice(68, 72), 16);
        item.volume2 = 0.01*parseInt(data.slice(72, 76), 16);
        item.capacity2_c1 = 0.01*parseInt(data.slice(76, 82), 16);
        item.capacity2_c2 = 0.01*parseInt(data.slice(82, 88), 16);
        item.power = parseInt(data.slice(88, 90), 16);
        item.alarm = parseInt(data.slice(90, 98),16).toString(2);
        item.status = parseInt(data.slice(98, 106),16).toString(2);
        var _lng = parseInt(data.slice(106, 114), 16);
        item.lng = parseFloat(_lng) / 100000;
        var _lat = parseInt(data.slice(114, 122), 16);
        item.lat = parseFloat(_lat) / 100000;
        item.high = parseInt(data.slice(122, 126), 16);
        var _speed = parseInt(data.slice(126, 130), 16);
        item.speed = parseFloat(_speed) / 10;
        item.direct = parseInt(data.slice(130, 134), 16);
        var _datetime = data.slice(134, 146);
        item.datetime = '20' + _datetime.slice(0, 2) + "-" + _datetime.slice(2, 4) + "-" + _datetime.slice(4, 6) + " " +
            _datetime.slice(6, 8) + ":" + _datetime.slice(8, 10) + ":" + _datetime.slice(10, 12);
        item.dist_id = parseInt(data.slice(146, 150));
        item.distance = parseInt(data.slice(150, 158), 16);
        
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
