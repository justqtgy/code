var util = require('util');
var group = require('./group');
var db = require('../models/mssql_helper');

function group_vehicle(model) {
    this.id = model.id;
    this.groupid = model.groupid;
    this.gpsid = model.gpsid;
    this.vehicleid = model.vehicleid;
    this.vehicleno = model.vehicleno;
}

module.exports = group_vehicle;

group_vehicle.get_groupvehicle = function(userid, callback) {
    var sql = " ;with t as (select GroupID  from  gserver_data.dbo.[GroupMember] where MemberID=" + userid +
        " union all select g.ID from gserver_data.dbo.[group] g inner join t on g.ParentID = t.GroupID)" +
        " SELECT t1.* FROM gserver_data.dbo.View_GroupVehicle t1 inner join (select distinct GroupID from t) as t2 on t1.GroupID = t2.GroupID " +
        " order by GroupID , [Level]";
    console.log(sql);
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
    var sql = ";with t as ( " +
        " select ID, ParentID, GroupName from gserver_data.dbo.[group] where id=" + params.group_id +
        " union all " +
        " select g.ID, g.ParentID, g.GroupName from gserver_data.dbo.[group] g inner join t on g.ParentID=t.ID)" +
        " SELECT t1.*, t.GroupName FROM gserver_data.dbo.GroupVehicle t1 inner join t on t1.GroupID=t.ID ";
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