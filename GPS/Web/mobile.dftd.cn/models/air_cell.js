var db = require('./framework/db_gserver_data');
var util = require('util');

function air_cell(model){
	 
};

module.exports = air_cell

air_cell.get_count = function(callback){
	db.execSQL('select count(*) as total from gps_aircell', function(err, result){
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

air_cell.get_list = function(pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gps_aircell) select * from t where rid between "+ start_id + " and " + end_id;
	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

air_cell.get_single = function(id,callback){
	db.execSQL('select * from gps_aircell where id = ?', id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}


air_cell.add = function(vehicleid, callback){
	var sql = "insert into gps_aircell(VehicleID,AddTime,NextTime) values('%s', GETDATE(), DATEADD(YEAR,2, GETDATE()))";
	sql = util.format(sql, vehicleid);

	console.log(sql);
		
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

air_cell.update = function(vehicleid, handletime, callback){
	var sql = "update gps_aircell set handletime ='%s' where vehicleid = '%s' and handletime is null";
    sql = util.format(sql, handletime, vehicleid)
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}


