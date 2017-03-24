var db = require('./framework/db_gserver_data');

function gps_data(model){
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

module.exports = gps_data

gps_data.get_count = function(callback){
	db.execSQL('select count(*) as total from gps_data', function(err, result){
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

gps_data.get_list = function(pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gps_data) select * from t where rid between "+ start_id + " and " + end_id;
	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

gps_data.get_single = function(id,callback){
	db.execSQL('select * from gps_data where id = ?', id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}

