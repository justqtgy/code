var date = require('date-utils');
var gps_data = require('./../models/gps_data');

/*
 *加油漏油协议
 *格式如下：*DFTD_ADD_LEAK_OIL,1000000888,115.5L,15.5L,131.0L# ,如(*DFTD_LYBJ,2000000100,13554766446#)
 */
module.exports.add_oil_data = async function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_ADD_LEAK_OIL') >= 0 && data.length >= 5) {
        item.gprsid = data[1];
        item.addOil = data[2];
        item.preOil = data[3];
        item.curOil = data[4];
        item.addtime = now;

        try {
            let result = await gps_data.get_carlist(item.gprsid);
            let rows = result.recordsets;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleno = rows[0].CarNumber;
            item.vehicleid = rows[0].VehicleID;

            //写入数据库


        } catch (error) {
            return logger.error('Error = ', err);
        }
    }
}