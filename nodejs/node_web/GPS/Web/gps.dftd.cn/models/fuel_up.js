var db = require('./framework/db_gserver_data');
var util = require('util');

function fuel_up(model){
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

module.exports = fuel_up

fuel_up.get_count = function(callback){
	db.execSQL('select count(*) as total from gps_fuelup', function(err, result){
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

fuel_up.get_list = function(pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gps_fuelup) select * from t where rid between "+ start_id + " and " + end_id;
	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

fuel_up.get_single = function(id,callback){
	db.execSQL('select * from gps_fuelup where id = ?', id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}


fuel_up.add = function(params, callback){
	var sql = "insert into gps_fuelup(VehicleID,DriverID,Number, Price,Amount,Station,FuelTime,AddTime) values('%s', '%s', %s, %s, %s, '%s', '%s', GETDATE())";
	sql = util.format(sql, params.vehicleid, params.driverid, params.number, params.price, params.amount, params.station, params.fueltime);

	console.log(sql);
		
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}


fuel_up.update = function(params, callback){
	db.execSQL('update gps_fuelup set ID=?, VehicleID=?, C1=?, C2=?, Empty=?, Full=?, Init=?, Volume=?, AddTime=? where id = ?', params, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

fuel_up.delete = function(id,callback){
	db.execSQL('delete from gps_fuelup where id = ?', id, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}


