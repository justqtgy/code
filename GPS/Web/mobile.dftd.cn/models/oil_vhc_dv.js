var db = require('./framework/db_gserver_synth');

function oil_vhc_dv(model){
	this.id = model.id;
	this.vehicleid = model.vehicleid;
	this.version = model.version;
	this.gpstime = model.gpstime;
	this.location = model.location;
	this.lng = model.lng;
	this.lat = model.lat;
	this.speed = model.speed;
	this.direct = model.direct;
	this.status = model.status;
	this.temp = model.temp;
	this.addtime = model.addtime;
};

module.exports = oil_vhc_dv

//加油对账
oil_vhc_dv.get_checksum = function(start_date, end_date, car_list, callback){
	var sql = " SELECT sum(oildv) as total FROM Oil_vhc_dv t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID "
		    + " WHERE t1.createtime>='" + start_date+ "' and	 t1.createtime<dateadd(day,1, '" + end_date + "') and t1.type =0 ";
	if(car_list && car_list.length>0){
		sql += "and t1.vhcid in ("+ car_list +")";
	}			
    
	db.execSQL(sql, function(err, rows){
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

oil_vhc_dv.get_chart = function(start_date, end_date, car_list, callback){
	var sql = " SELECT ltrim(rtrim(t2.CarNumber)) as Car_Number,sum(oildv) as sum_oildv FROM Oil_vhc_dv t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID "
		    + " WHERE t1.createtime>='" + start_date+ "' and	 t1.createtime<dateadd(day,1, '" + end_date + "') and t1.type =1 "		
			+ " 	and t2.VehicleID in (" + car_list + ") "
			+ " GROUP BY t2.CarNumber";
    
	db.execSQL(sql, function(err, rows){
		if(err){
			console.log(err);
			throw err
		}

		callback(err, rows);
	});
}

oil_vhc_dv.get_count = function(start_date, end_date, car_number, callback){
	var sql = "		SELECT count(*) as total "+
			  "		FROM Oil_vhc_dv t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID " +
              "		WHERE createtime>='"+start_date+"' and createtime<dateadd(day, 1, '"+end_date+"') and t1.type = 1 and t2.CarNumber = '"+ car_number+"'"

	db.execSQL(sql, function(err, result){
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

oil_vhc_dv.get_list = function(start_date, end_date, car_number, pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";WITH t AS( "+
			  "		SELECT ROW_NUMBER() OVER (ORDER BY id DESC) AS R_Number,t1.*, t2.GroupName, t2.CarNumber "+
			  "		FROM Oil_vhc_dv t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID " +
              "		WHERE createtime>='"+start_date+"' and createtime<dateadd(day, 1, '"+end_date+"') and t1.type = 1 and t2.CarNumber = '"+ car_number+"'"+
			  ")"+
			  "SELECT * FROM t WHERE R_Number BETWEEN "+ start_id + " and " + end_id;

	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

oil_vhc_dv.get_detail = function(start_date, end_date, car_list, callback){
	var sql = " SELECT t1.*, t2.CarNumber FROM Oil_vhc_dv t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID "
		    + " WHERE t1.createtime>='" + start_date+ "' and	 t1.createtime<dateadd(day,1, '" + end_date + "') and t1.type =1 "		
			+ " 	and t2.VehicleID in (" + car_list + ") "
			+ " ORDER BY t1.createtime";
    console.log(sql)
	db.execSQL(sql, function(err, rows){
		if(err){
			console.log(err);
			throw err
		}

		callback(err, rows);
	});
}