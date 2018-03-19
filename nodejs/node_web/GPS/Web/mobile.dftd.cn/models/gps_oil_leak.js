/**
 * 记录偷油漏油报警信息：typeid{1：发送给司机，2：发送给服务区}
 */
var util = require('util');
var db = require('../models/mssql_helper');

function gps_oil_leak() {

}

module.exports = gps_oil_leak;


gps_oil_leak.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from (SELECT * FROM GPS_Oil_Leak x WHERE NOT EXISTS ( SELECT * FROM GPS_Oil_Leak WHERE AddOil = x.AddOil and PreOil = x.PreOil and ID >x.ID )) y where addtime >='%s' and addtime<dateadd(day, 1, '%s') and vehicleid in (%s)";
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

gps_oil_leak.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid  from (SELECT * FROM GPS_Oil_Leak x WHERE NOT EXISTS ( SELECT * FROM GPS_Oil_Leak WHERE AddOil = x.AddOil and PreOil = x.PreOil and ID >x.ID )) y " +
        "where addtime >='%s' and addtime<dateadd(day, 1, '%s')  and vehicleid in (%s))" +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
};

//漏油报警记录，在首页显示
gps_oil_leak.get_mylist = function(userid, callback) {
    var sql = " ;with t as (select GroupID  from  gserver_data.dbo.[GroupMember] where MemberID=" + userid +
        " union all select g.ID from gserver_data.dbo.[group] g inner join t on g.ParentID = t.GroupID)" +
        " , t2 as (SELECT distinct GPSID FROM gserver_data.dbo.View_GroupVehicle t1 inner join (select distinct GroupID from t) as t2 on t1.GroupID = t2.GroupID) " +
        " select top 50 VehicleNo, AddOil, AddTime from t2 inner join gps_oil_leak t0 on t0.GPSID=t2.GPSID where AddTime>=DATEADD(DAY, -10, GETDATE())";
    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};