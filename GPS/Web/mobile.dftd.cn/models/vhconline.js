var db = require('./framework/db_gserver_synth');
var util = require('util');

function vhconline(model){
	this.id = model.id;
	this.vehicleid = model.vehicleid;
	this.g_day = model.g_day;
	this.online = model.online;
	this.lastdaydistance = model.lastdaydistance;	 
};

module.exports = vhconline

vhconline.get_count = function(start_date, end_date, car_list, callback){
	var start_date = start_date.replace(/-/g,''),
		end_date = end_date.replace(/-/g,'');
    var sql = " SELECT COUNT(*) as total FROM VhcOnline t1 inner join View_CarList  t2 on t1.vhcid=t2.VehicleID "+
			  " WHERE g_day >='%s' and g_day <'%s' and t2.VehicleID in (%s)"
	sql = util.format(sql, start_date, end_date, car_list);
	db.execSQL(sql, function(err, result){
		if(err){
			console.log(err);
			throw err;
		}

		var total = 0;
		if(result.length>0){
			total = result[0].total;
		}

		callback(err, total);
	});
}

vhconline.get_list = function(start_date, end_date, car_list, pageIndex, pageSize, callback){
	var start_date = start_date.replace(/-/g,''),
		end_date = end_date.replace(/-/g,''),
	 	start_id = (pageIndex - 1) * pageSize + 1,
	 	end_id = pageIndex * pageSize;

	var sql = ";WITH t AS("+
			  "		SELECT ROW_NUMBER() OVER (ORDER BY id DESC) AS rid,t1.*, t2.GroupName, t2.CarNumber "+
			  "		FROM VhcOnline t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID "+
              "     WHERE g_day >='%s' and g_day <='%s' and t2.VehicleID in (%s) \
			  )"+
              " select * from t where rid between %s and %s";
	sql = util.format(sql, start_date, end_date, car_list, start_id, end_id);


	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

vhconline.get_last = function(carList, callback){
	var sql = "	SELECT t1.*, t2.GroupName, t2.CarNumber "+
			  "	FROM VhcOnline t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID "+
              " WHERE t2.vehicleid in (%s) and g_day>=convert(varchar(10), GETDATE(),112) ";	
	sql = util.format(sql, carList);
	
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

vhconline.get_single = function(id,callback){
	db.execSQL('select * from vhconline where id = ?', id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}
 