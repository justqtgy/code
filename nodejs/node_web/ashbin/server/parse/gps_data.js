// var date = require('date-utils');
var async = require('async');
var common = require('./../cores/common');
var dao = require('./../db/dao');

/**
 * 部标协议：
 * 7E090000420120000004910000FA2A444654445F4C4A540201800158003500003600028514000035000036002000000000000C00000159C18F06CC9FF3005B000000C5170622194144010400000064007E
 * @param {any} data 
 * @returns 
 */

module.exports.add_data = function(data) {
    
    var item = {};
    if (data.length <= 114) {
        return;
    }
    //data = data.replace('7d01', '7d').replace('7d02', '7e');
 
    item.gps_id = data.slice(10, 22);
    item.sn = parseInt(data.slice(22, 26), 16);
    item.num = parseInt(data.slice(46, 48), 16);
    item.one_zl = (0.1*parseInt(data.slice(48, 52), 16)).toFixed(2);
    item.one_rl = (0.01*parseInt(data.slice(52, 56), 16)).toFixed(2);
    item.one_c1 = (0.01*parseInt(data.slice(56, 62), 16)).toFixed(2);
    item.one_c2 = (0.01*parseInt(data.slice(62, 68), 16)).toFixed(2);
    item.two_zl = (0.1*parseInt(data.slice(68, 72), 16)).toFixed(2);
    item.two_rl = (0.01*parseInt(data.slice(72, 76), 16)).toFixed(2);
    item.two_c1 = (0.01*parseInt(data.slice(76, 82), 16)).toFixed(2);
    item.two_c2 = (0.01*parseInt(data.slice(82, 88), 16)).toFixed(2);
    item.power = parseInt(data.slice(88, 90), 16);
    item.alarm = parseInt(data.slice(90, 98),16).toString(2);
    item.alarm = common.PrefixInteger(item.alarm, 32);
    item.status = parseInt(data.slice(98, 106),16).toString(2);
    item.status = common.PrefixInteger(item.status, 32);
    var _lng = parseInt(data.slice(106, 114), 16);
    item.lng = (parseFloat(_lng) / 100000).toFixed(6);
    var _lat = parseInt(data.slice(114, 122), 16);
    item.lat = (parseFloat(_lat) / 100000).toFixed(6);
    item.high = parseInt(data.slice(122, 126), 16);
    var _speed = parseInt(data.slice(126, 130), 16);
    item.speed = parseFloat(_speed) / 10;
    item.direct = parseInt(data.slice(130, 134), 16);
    var _datetime = data.slice(134, 146);
    item.gps_time = '20' + _datetime.slice(0, 2) + "-" + _datetime.slice(2, 4) + "-" + _datetime.slice(4, 6) + " " +
        _datetime.slice(6, 8) + ":" + _datetime.slice(8, 10) + ":" + _datetime.slice(10, 12);
    item.dist_id = parseInt(data.slice(146, 150));
    item.distance = parseInt(data.slice(150, 158), 16);
    
    item.alarm_info = item.alarm.slice(0,2)|item.alarm.slice(0,2);

    async.waterfall([
        cb=>{
            dao.add_gps_data(item, function(err, result){
                item.result_id = 0
                if(result.length>0){
                    item.result_id = result[0].ret_id 
                }                    
                cb(null)
            });
        },
        cb=>{
            getLastInfo(item.gps_id, (err, info)=>{
                cb(null, info)
            })
        },
        (_info, cb)=>{
            //更新最后信息
            if(_info.id ==0 ){
                dao.add_gps_last(item)
            }else{
                dao.set_gps_last(item)
            }                
            //判断电量是否变化
            if(_info.power!=item.power){
                dao.add_gps_power(item)
            }
            //判断是否告警
            if (item.alarm_info>0) {
                dao.add_gps_alarm(item)
            }

            //判断是否垃圾桶是否有变化
            if(item.one_zl != _info.one_zl || item.one_rl != _info.one_rl
                    || item.one_c1 != _info.one_c1 || item.one_c2 != _info.one_c2
                    || item.two_zl != _info.two_zl || item.two_rl != _info.two_rl
                    || item.two_c1 != _info.two_c1 || item.two_c2 != _info.two_c2){
                dao.add_gps_capacity(item)
            }

            cb(null)
        }
    ], function(err) {
        if (err) {
            return logger.error('Error = ', err);
        }
        logger.info('Result = ', item.result_id);        
    });
    
}

function getLastInfo(gps_id, cb) {
    dao.get_gps_last(gps_id, function(error, result) {
        if (error) {
            return cb(error);
        }
 
        var lastInfo = {}
        lastInfo.id = 0;
        if (result.length > 0) {
            lastInfo.id = result[0].id;
            lastInfo.lng = result[0].lng;
            lastInfo.lat = result[0].lat;
            lastInfo.one_zl = result[0].one_zl.toFixed(2);
            lastInfo.one_rl = result[0].one_rl.toFixed(2);
            lastInfo.one_c1 = result[0].one_c1.toFixed(2);
            lastInfo.one_c2 = result[0].one_c2.toFixed(2);            
            lastInfo.two_zl = result[0].two_zl.toFixed(2);
            lastInfo.two_rl = result[0].two_rl.toFixed(2);
            lastInfo.two_c1 = result[0].two_c1.toFixed(2);
            lastInfo.two_c2 = result[0].two_c2.toFixed(2);
            lastInfo.power = result[0].power;
            lastInfo.distance = result[0].distance;
        }
        cb(null, lastInfo);
    });
}
