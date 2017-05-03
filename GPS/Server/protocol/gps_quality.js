/**
 * 油品信息
 * 
 * @param {any} data 
 */
module.exports.add_quality_data = async function(data) {
    var item = {};
    if (data[0].indexOf('*DFTD_YP') >= 0 && data.length >= 7) {
        item.gprsid = data[1];
        item.c1 = data[2].replace('pF', '');
        item.c2 = data[3].replace('pF', '');
        item.empty = data[4].replace('pF', '');
        item.full = data[5].replace('pF', '');
        item.init = data[6].replace('pF', '');
        item.volume = data[7].replace('L#', '');

        try {
            let result = await gps_data.get_carlist(item.gprsid);
            let rows = result.recordsets;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.vehicleid = rows[0].VehicleID;

            result = await gps_data.add_quality(item);
            logger.info('Result = ', result);

        } catch (error) {
            return logger.error('Error = ', err);
        }
    }
}