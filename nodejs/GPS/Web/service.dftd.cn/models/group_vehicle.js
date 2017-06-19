var util = require('util');
var db = require('../models/mssql_helper');

function group_vehicle(model) {
    this.id = model.id;
    this.groupid = model.groupid;
    this.gpsid = model.gpsid;
    this.vehicleid = model.vehicleid;
    this.vehicleno = model.vehicleno;
}

module.exports = group_vehicle;

group_vehicle.get_groupvehicle = function(userid, user_type, callback) {
    var sql = " select t1.* from gserver_data.dbo.View_GroupVehicle t1 ";
    if (!user_type) {
        sql += " inner join inner join gserver_data.[dbo].[GroupMember] t3 on t2.ID = t3.GroupID " +
            " where MemberID = " + userid;
    }
    sql += " order by GroupID , [Level]";

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_vehicle.get_list = function(params, callback) {
    // var pageIndex = parseInt(params.pageIndex);
    // var pageSize = parseInt(params.pageSize);
    // var start_id = (pageIndex - 1) * pageSize + 1;
    // var end_id = pageIndex * pageSize;
    var sql = "SELECT * FROM gserver_data.dbo.GroupVehicle WHERE GroupID = %s ";
    sql = util.format(sql, params.group_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_vehicle.get_except_list = function(params, callback) {
    var sql = "select [ID] as VehicleID,[GPSID],[VehicleNo] from gserver_data.[dbo].[Vehicle] " +
        "except " +
        "select VehicleID,[GPSID],[VehicleNo] from gserver_data.[dbo].[GroupVehicle] where GroupID = %s";

    sql = util.format(sql, params.group_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_vehicle.add = function(params, callback) {
    var sql = "insert into gserver_data.dbo.GroupVehicle(GroupID,GPSID,VehicleID,VehicleNo) " +
        "select %s, GPSID,ID as VehicleID,VehicleNo from  gserver_data.dbo.Vehicle " +
        "where id in (%s)";
    sql = util.format(sql, params.groupID, params.vehicleList);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

group_vehicle.delete = function(id, callback) {
    var sql = "delete from gserver_data.dbo.GroupVehicle where ID = '%s'";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};