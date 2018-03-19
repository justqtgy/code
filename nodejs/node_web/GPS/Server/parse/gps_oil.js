var date = require('date-utils');
var iconv = require('iconv-lite');
var common = require('./../cores/common');
var gps_data = require('./../models/gps_data');
var gps_oil = require('./../models/gps_oil');
var gps_last = require('./gps_last');
/*
 *实时油量协议
 *格式如下：*DFTD_OIL,2000000576,A,200.2L,A,094506,240116,2239.5530,N,11404.4116,E #
 */
/*
module.exports.add_realoil_data = async function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_OIL') >= 0 && data.length >= 5) {
        item.gpsID = data[1];
        item.oilStatus = data[2] == 'A' ? 1 : 0;
        item.curOil = data[3].replace('L', '');
        item.gpsStatus = data[4] == 'A' ? 1 : 0;
        item.gpsTime = common.format_time(data[6], data[5]);
        item.lat = parseFloat(data[7]) * 0.01; //纬度
        item.lng = parseFloat(data[9]) * 0.01; //经度
        item.addTime = now;

        try {
            let result = await gps_data.get_carlist(item.gpsID);
            let rows = result;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].CarNumber;

            //写入数据库 
            result = await gps_oil.add_oilreal_data(item);
            logger.info('Result = ', result);

        } catch (error) {
            return logger.error('Error = ', error);
        }
    }
}
*/
module.exports.add_realoil_data = function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_OIL') >= 0 && data.length >= 10) {
        item.gpsID = data[1];
        item.oilStatus = data[2] == 'A' ? 1 : 0;
        item.curOil = parseFloat(data[3].replace('L', '')).toFixed(2);
        item.gpsStatus = data[4] == 'A' ? 1 : 0;
        item.gpsTime = common.format_time(data[6], data[5]);
        item.addTime = now;
        var lat = parseFloat(data[7]) * 0.01; //纬度
        var lng = parseFloat(data[9]) * 0.01; //经度
        item.lat = common.changeLocation(lat.toString());
        item.lng = common.changeLocation(lng.toString());


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
            gps_oil.add_oilreal_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }

                logger.info('Result = ', result);
                //定位和轨迹
                //if (item.gpsStatus == 1) {
                    gps_last.set_lastinfo(item);
                //}
            });
        });
    }
};

/*
 *加油协议
 *格式如下：*DFTD_ADD_OIL,2000000576,115.5L,15.5L,131.0L,A,094506,240116,2239.5530,N,11404.4116,E #
 */
/*
module.exports.add_addoil_data = async function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_ADD_OIL') >= 0 && data.length >= 5) {
        item.gpsID = data[1];
        item.addOil = data[2].replace('L', '');
        item.preOil = data[3].replace('L', '');
        item.curOil = data[4].replace('L', '');
        item.gpsStatus = data[5] == 'A' ? 1 : 0;
        item.gpsTime = common.format_time(data[7], data[6]);
        item.lat = parseFloat(data[8]) * 0.01; //纬度
        item.lng = parseFloat(data[10]) * 0.01; //经度
        item.addTime = now;

        try {
            let result = await gps_data.get_carlist(item.gpsID);
            let rows = result;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleID = rows[0].VehicleID;
            item.vehicleNo = rows[0].CarNumber;
            console.log(item);
            //写入数据库 
            result = await gps_oil.add_oiladd_data(item);
            logger.info('Result = ', result);

        } catch (error) {
            return logger.error('Error = ', error);
        }
    }
}
*/

module.exports.add_addoil_data = function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_ADD_OIL') >= 0 && data.length >= 11) {
        item.gpsID = data[1];
        item.addOil = parseFloat(data[2].replace('L', '')).toFixed(2);
        item.preOil = parseFloat(data[3].replace('L', '')).toFixed(2);
        item.curOil = parseFloat(data[4].replace('L', '')).toFixed(2);
        item.gpsStatus = data[5] == 'A' ? 1 : 0;
        item.gpsTime = common.format_time(data[7], data[6]);
        item.addTime = now;

        var lat = parseFloat(data[8]) * 0.01; //纬度
        var lng = parseFloat(data[10]) * 0.01; //经度
        item.lat = common.changeLocation(lat.toString());
        item.lng = common.changeLocation(lng.toString());


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
                //if (item.gpsStatus == 1) {
                    gps_last.set_lastinfo(item);
                //}
            });

        });
    }
};

/*
 *漏油协议
 *格式如下：*DFTD_LEAK_OIL,3000000219,-115.5L,131.0L,15.5L,A,094506,240116,2239.5530,N,11404.4116,E # ,
 */
// module.exports.add_leakoil_data = async function(data) {
//     var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
//     var item = {};
//     if (data[0].indexOf('*DFTD_ADD_LEAK_OIL') >= 0 && data.length >= 5) {
//         item.gpsID = data[1];
//         item.addOil = data[2].replace('L', '');
//         item.preOil = data[3].replace('L', '');
//         item.curOil = data[4].replace('L', '');
//         item.gpsStatus = data[5] == 'A' ? 1 : 0;
//         item.gpsTime = common.format_time(data[7], data[6]);
//         item.lat = parseFloat(data[8]) * 0.01; //纬度
//         item.lng = parseFloat(data[10]) * 0.01; //经度
//         item.addTime = now;

//         try {
//             let result = await gps_data.get_carlist(item.gpsID);
//             let rows = result;
//             if (rows.length == 0) {
//                 logger.error('获取车辆信息失败：该车不存在');
//                 return;
//             }

//             item.vehicleID = rows[0].VehicleID;
//             item.vehicleNo = rows[0].CarNumber;
//             //写入数据库 
//             result = await gps_oil.add_oilleak_data(item);
//             logger.info('Result = ', result);


//         } catch (error) {
//             return logger.error('Error = ', error);
//         }
//     }
// }

module.exports.add_leakoil_data = function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_LEAK_OIL') >= 0 && data.length >= 11) {
        item.gpsID = data[1];
        item.addOil = parseFloat(data[2].replace('L', '')).toFixed(2);
        item.preOil = parseFloat(data[3].replace('L', '')).toFixed(2);
        item.curOil = parseFloat(data[4].replace('L', '')).toFixed(2);
        item.gpsStatus = data[5] == 'A' ? 1 : 0;
        item.gpsTime = common.format_time(data[7], data[6]);
        item.addTime = now;

        var lat = parseFloat(data[8]) * 0.01; //纬度
        var lng = parseFloat(data[10]) * 0.01; //经度
        item.lat = common.changeLocation(lat.toString());
        item.lng = common.changeLocation(lng.toString());

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
                
                gps_last.set_lastinfo(item);
                
            });
        });
    }
}

/*
 *漏油协议
 *格式如下：*DFTD_URGENT_ADD_OIL,1000000888,-115.5L,131.0L,15.5L, A,094506,240116, 2239.5530,N,11404.4116,E #,
 */
// module.exports.add_urgentoil_data = async function(data) {
//     var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
//     var item = {};
//     if (data[0].indexOf('*DFTD_URGENT_ADD_OIL') >= 0 && data.length >= 5) {
//         item.gpsID = data[1];
//         item.addOil = data[2];
//         item.preOil = data[3];
//         item.curOil = data[4];
//         item.addtime = now;

//         try {
//             let result = await gps_data.get_carlist(item.gpsID);
//             let rows = result;
//             if (rows.length == 0) {
//                 logger.error('获取车辆信息失败：该车不存在');
//                 return;
//             }

//             item.vehicleno = rows[0].CarNumber;
//             item.vehicleid = rows[0].VehicleID;

//             //写入数据库


//         } catch (error) {
//             return logger.error('Error = ', err);
//         }
//     }
// }
// 4.紧急加油
// 所谓紧急加油是指，车辆已经加油了，因为设备的原因没有发送加油数据，此时人为控制设备发送一条紧急加油数据给平台，紧急加油不需要平台握手信号
// *DFTD_URGENT_ADD_OIL,2000000560,25L ,20170518171000#
// DFTD_URGENT_ADD_OIL 紧急加油
// 25L 加油值
// 20170518171000#  北京时间 2017年5月18日17点10分0秒

module.exports.add_oilUrgentAdd_data = function(data) {
    var item = {};
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    if (data[0].indexOf('*DFTD_URGENT_ADD_OIL') >= 0 && data.length >= 3) {
        item.gpsID = data[1];
        item.urgentAddOil = parseFloat(data[2].replace('L', '')).toFixed(2);
        item.urgentAddTime = data[3].substring(0,4)+"-"+data[3].substring(4,6)+"-"+data[3].substring(6,8)+' '+data[3].substring(8,10)+":"+ data[3].substring(10,12) +":"+ data[3].substring(12,14);
        item.addTime = now;
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
            gps_oil.add_oilUrgentAdd_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }
                logger.info('Result = ', result);
            });

        });
    }
};

// 5.紧急漏油
// 紧急漏油不需要平台握手信号
// *DFTD_URGENT_ADD_OIL, 2000000560,-25L,20170518171000#
// -25L  漏油25升

module.exports.add_oilUrgentLeak_data = function(data) {
    var item = {};
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    if (data[0].indexOf('*DFTD_URGENT_LEAK_OIL') >= 0 && data.length >= 3) {
        item.gpsID = data[1];
        item.urgentLeakOil = parseFloat(data[2].replace('L', '')).toFixed(2);
        item.urgentLeakTime = data[3].substring(0,4)+"-"+data[3].substring(4,6)+"-"+data[3].substring(6,8)+' '+data[3].substring(8,10)+":"+ data[3].substring(10,12) +":"+ data[3].substring(12,14);
        item.addTime = now;
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
            gps_oil.add_oilUrgentLeak_data(item, function(error, result) {
                if (error) {
                    return logger.error('Error = ', error);
                }
                logger.info('Result = ', result);
            });

        });
    }
};