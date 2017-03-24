var db = require('./framework/db_gserver_data');

function gps_quality(model){
	this.id = model.id;
	this.vehicleid = model.vehicleid;
	this.c1 = model.c1;
	this.c2 = model.c2;
	this.empty = model.empty;
	this.full = model.full;
	this.init = model.init;
	this.volume = model.volume;
	this.addtime = model.addtime;
};

module.exports = gps_quality

gps_quality.get_count = function(callback){
	db.execSQL('select count(*) as total from gps_quality', function(err, result){
		if(err){
			throw err
		}
		var total = 0;
		if(result.length>0){
			total = result[0].total;
		}
		callback(err, total);
	});
}

gps_quality.get_list = function(pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gps_quality) select * from t where rid between "+ start_id + " and " + end_id;
	db.execSQL(sql, function(err, rows, fileds){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}

gps_quality.get_single = function(id,callback){
	db.execSQL('select * from gps_quality where id = ?', id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}

gps_quality.add = function(params, callback){
	db.execSQL('insert into gps_quality(ID,VehicleID,C1,C2,Empty,Full,Init,Volume,AddTime) values(?,?,?,?,?,?,?,?,?)', params, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

gps_quality.update = function(params, callback){
	db.execSQL('update gps_quality set ID=?, VehicleID=?, C1=?, C2=?, Empty=?, Full=?, Init=?, Volume=?, AddTime=? where id = ?', params, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

gps_quality.delete = function(id,callback){
	db.execSQL('delete from gps_quality where id = ?', id, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

