var db = require('../models/mssql_helper');
var util = require('util');

function vehicle(model) {

}

module.exports = vehicle;


vehicle.get_grouplist = function(userid, user_type, callback) {
    var sql = " select groupid, groupname, vehicleid, carnumber,level from gserver_synth.dbo.View_Group_CarList ";
    if (user_type <= 0) {
        sql += " where groupid in (select groupid from gserver_synth.dbo.usergroup where userid = " + userid + ")";
    }
    sql += " order by GroupID , [Level]";

    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

vehicle.get_count = function(params, callback) {
    var sql = " select count(*) as total from gserver_data.dbo.vehicle ";
    if (params.vehicleNo) {
        sql += " where VehicleNo like '%" + params.vehicleNo + "%' ";
    }
    sql = util.format(sql);
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

vehicle.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by id desc) as rid  from gserver_data.dbo.vehicle ";
    if (params.vehicleNo) {
        sql += "where VehicleNo like '%" + params.vehicleNo + "%' ";
    }

    sql += ") select * from t where rid between %s and %s";
    sql = util.format(sql, start_id, end_id);
    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
};


vehicle.get_single = function(args, callback) {
    var sql = "select top 1 * from gserver_data.dbo.vehicle where ID='%s'";
    sql = util.format(sql, args.id);
    console.log(sql)
    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

vehicle.add = function(params, callback) {
    var sql = "insert into gserver_data.dbo.Vehicle(GPSID,VehicleNo,Mobile,Remark, IsDelete) values('%s','%s','%s','%s', 0)";
    sql = util.format(sql, params.gpsID, params.vehicleNo, params.mobile, params.remark);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

vehicle.update = function(params, callback) {
    var sql = "update gserver_data.dbo.Vehicle set GPSID='%s', VehicleNo='%s', Mobile='%s', Remark='%s' where id = '%s';update gserver_data.dbo.GroupVehicle set GPSID='%s',VehicleNo='%s' WHERE vehicleID='%s'";
    sql = util.format(sql, params.gpsID, params.vehicleNo, params.mobile, params.remark, params.id, params.gpsID,params.vehicleNo,params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

vehicle.delete = function(params, callback) {
    var sql = "delete from gserver_data.dbo.Vehicle where ID = '%s';delete from gserver_data.dbo.GroupVehicle where vehicleID = '%s'";
    sql = util.format(sql, params.id,params.id);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};