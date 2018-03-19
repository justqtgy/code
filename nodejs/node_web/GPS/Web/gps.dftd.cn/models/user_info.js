var db = require('./mssqldb');

function user_info(model){
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

module.exports = user_info

user_info.get_count = function(callback){
	db.execSQL('select count(*) as total from user_info', function(err, result){
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

user_info.get_list = function(pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from user_info) select * from t where rid between "+ start_id + " and " + end_id;
	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

user_info.get_single = function(id,callback){
	db.execSQL('select * from user_info where id = ?', id, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}

