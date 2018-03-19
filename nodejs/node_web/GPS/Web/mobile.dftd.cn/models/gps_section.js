
/**
 * 区间数据
 */
var util = require('util');
var db = require('../models/mssql_helper');

function gps_section() {

}

module.exports = gps_section;

gps_section.get_count = function(params, callback) {
    var begintime = params.begintime.replace("T"," ");
    var endtime = params.endtime.replace("T"," ");
    var sql = " select count(*) as total from (SELECT b.VehicleID,VehicleNo,ISNULL(total, 0) as total,First_Time,First_Oil,Last_Time,Last_Oil FROM (SELECT VehicleID,sum(AddOil) as total FROM (SELECT * FROM GPS_Oil_Add x WHERE NOT EXISTS ( SELECT * FROM GPS_Oil_Add WHERE AddOil = x.AddOil and PreOil = x.PreOil and ID >x.ID )) y WHERE AddTime BETWEEN '%s' AND '%s' and VehicleID in (%s) group by VehicleID) a RIGHT JOIN (SELECT tt1.VehicleID,tt1.VehicleNO,tt1.AddTime as First_Time,tt1.CurOil as First_Oil,tt2.AddTime as Last_Time,tt2.CurOil as Last_Oil FROM (SELECT t1.VehicleID,t1.VehicleNO,t1.AddTime,t1.CurOil FROM GPS_Oil_Data t1 INNER JOIN (SELECT VehicleID,MIN(AddTime) AddTime FROM GPS_Oil_Data WHERE AddTime BETWEEN '%s' AND '%s' and VehicleID in (%s)  GROUP BY VehicleID) t2 ON t1.VehicleID=t2.VehicleID AND t1.AddTime=t2.AddTime) tt1 INNER JOIN (SELECT t1.VehicleID,t1.VehicleNO,t1.AddTime,t1.CurOil FROM GPS_Oil_Data t1 INNER JOIN (SELECT VehicleID,MAX(AddTime) AddTime FROM GPS_Oil_Data WHERE AddTime BETWEEN '%s' AND '%s' and VehicleID in (%s) GROUP BY VehicleID) t2 ON t1.VehicleID=t2.VehicleID AND t1.AddTime=t2.AddTime) tt2 ON tt1.VehicleID = tt2.VehicleID) b ON a.VehicleID = b.VehicleID) z";
    sql = util.format(sql,begintime, endtime, params.vehicleList,begintime, endtime, params.vehicleList,begintime, endtime, params.vehicleList);
    console.log(sql);
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

gps_section.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var begintime = params.begintime.replace("T"," ");
    var endtime = params.endtime.replace("T"," ");
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql =";with w as (select *, row_number() over(order by VehicleID desc) as rid from (SELECT b.VehicleID,VehicleNo,ISNULL(total, 0) as total,First_Time,First_Oil,Last_Time,Last_Oil FROM (SELECT VehicleID,sum(AddOil) as total FROM (SELECT * FROM GPS_Oil_Add x WHERE NOT EXISTS ( SELECT * FROM GPS_Oil_Add WHERE AddOil = x.AddOil and PreOil = x.PreOil and ID >x.ID )) y WHERE AddTime BETWEEN '%s' AND '%s' and VehicleID in (%s) group by VehicleID) a RIGHT JOIN (SELECT tt1.VehicleID,tt1.VehicleNO,tt1.AddTime as First_Time,tt1.CurOil as First_Oil,tt2.AddTime as Last_Time,tt2.CurOil as Last_Oil FROM (SELECT t1.VehicleID,t1.VehicleNO,t1.AddTime,t1.CurOil FROM GPS_Oil_Data t1 INNER JOIN (SELECT VehicleID,MIN(AddTime) AddTime FROM GPS_Oil_Data WHERE AddTime BETWEEN '%s' AND '%s' and VehicleID in (%s)  GROUP BY VehicleID) t2 ON t1.VehicleID=t2.VehicleID AND t1.AddTime=t2.AddTime) tt1 INNER JOIN (SELECT t1.VehicleID,t1.VehicleNO,t1.AddTime,t1.CurOil FROM GPS_Oil_Data t1 INNER JOIN (SELECT VehicleID,MAX(AddTime) AddTime FROM GPS_Oil_Data WHERE AddTime BETWEEN '%s' AND '%s' and VehicleID in (%s) GROUP BY VehicleID) t2 ON t1.VehicleID=t2.VehicleID AND t1.AddTime=t2.AddTime) tt2 ON tt1.VehicleID = tt2.VehicleID) b ON a.VehicleID = b.VehicleID) z ) " +
        "SELECT * from w where rid between %s and %s";
    sql = util.format(sql, begintime, endtime, params.vehicleList,begintime, endtime, params.vehicleList,begintime, endtime, params.vehicleList,start_id,end_id);
    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
}
