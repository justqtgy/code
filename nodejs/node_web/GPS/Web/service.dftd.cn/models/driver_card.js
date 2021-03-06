/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */
var util = require('util');
var db = require('../models/mssql_helper');

function driver_card() {

}

module.exports = driver_card;


driver_card.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from driver_card where addtime >='%s' and addtime<dateadd(day, 1, '%s')   and vehicleid in (%s) and Status = 1";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }

        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }

        callback(err, total);
    });
};

driver_card.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";WITH ctea AS (SELECT * FROM Driver_Card WHERE Status = 1),cteb AS (SELECT * FROM Driver_Card WHERE Status = 0) select * from ( SELECT GPSID,VehicleNo ,driverName,AddTime AS StartTime,( SELECT TOP 1 AddTime FROM cteb WHERE ctea.GPSID = cteb.GPSID AND ctea.driverName =cteb.driverName AND cteb.AddTime>ctea.AddTime ORDER BY AddTime ) AS EndTime,row_number() over(order by addtime desc) as rid FROM ctea where addtime >='%s' and addtime<dateadd(day, 1, '%s')  and vehicleid in (%s) ) t where rid between '%s' and '%s'";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
}