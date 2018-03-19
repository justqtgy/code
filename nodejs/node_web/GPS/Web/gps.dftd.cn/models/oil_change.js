var db = require('./framework/db_gserver_data');
var util = require('util');

function oil_change(model){
	this.id = model.id;//自增id
	this.vehicleid = model.vehicleid;//设备id
	this.driverid = model.driverid;//司机
	this.number = model.number;	 //加油量
	this.price = model.price;//单价
	this.amount = model.amount;  //金额
	this.gasstation = model.gasstation; //加油站
	this.fueltime = model.fueltime;//加油时间
	this.addtime = model.addtime; //时间
};

module.exports = oil_change

oil_change.get_count = function(callback){
	db.execSQL('select count(*) as total from gps_oilchange', function(err, result){
		if(err){
			console.log(err);
			throw err
		}

		var total = 0;
		if(result.length>0){
			total = result[0].total;
		}

		callback(err, total);
	});
}

oil_change.get_list = function(pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gps_oilchange) select * from t where rid between "+ start_id + " and " + end_id;
	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

oil_change.get_single = function(vehicleid,callback){
    var sql = "select * from gps_oilchange where vehicleid = '%s' and handletime is null";
    sql = util.format(sql, vehicleid);
	db.execSQL(sql, id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}


oil_change.add = function(params, callback){
	var sql = "insert into gps_oilchange(VehicleID,CurrentDistance,ChangeDistance, AddTime,UpdateTime) values('%s', '%s', %s, GETDATE(), GETDATE())";
	sql = util.format(sql, params.vehicleid, params.driverid, params.number, params.price, params.amount, params.station, params.fueltime);

	console.log(sql);
		
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}


oil_change.update = function(vehicleid, handletime, callback){
    var sql = "update gps_oilchange set handletime ='%s' where vehicleid = '%s' and handletime is null";
    sql = util.format(sql, handletime, vehicleid)
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}




