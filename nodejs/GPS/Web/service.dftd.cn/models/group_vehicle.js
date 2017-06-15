var util = require('util');
var db = require('./db');

function group_vehicle(model) {
    this.id = model.id;
    this.groupid = model.groupid;
    this.gpsid = model.gpsid;
    this.vehicleid = model.vehicleid;
    this.vehicleno = model.vehicleno;
}

module.exports = group_vehicle;

group_vehicle.get_count = function(params, callback) {
    var sql = "select count(*) as total from GroupVehicle";
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

group_vehicle.get_list = function(params, callback) {
    var iBeginID = (params.pageIndex - 1) * params.pageSize + 1;
    var iEndID = params.pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM GroupVehicle \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, iBeginID, iEndID);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_vehicle.get_single = function(id, callback) {
    var sql = "select * from GroupVehicle where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
};

group_vehicle.add = function(params, callback) {
    var sql = "insert into GroupVehicle(GroupID,GPSID,VehicleID,VehicleNo) values('%s','%s','%s','%s')";
    sql = util.format(sql, params.GroupID, params.GPSID, params.VehicleID, params.VehicleNo);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

group_vehicle.update = function(params, callback) {
    var sql = "update GroupVehicle set GroupID='%s', GPSID='%s', VehicleID='%s', VehicleNo='%s' where id = '%s'";
    sql = util.format(sql, params.GroupID, params.GPSID, params.VehicleID, params.VehicleNo, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

group_vehicle.delete = function(params, callback) {
    var sql = "delete from GroupVehicle where ID = '%s'";
    sql = util.format(sql, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};