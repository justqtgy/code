var util = require('util');
var db = require('./db');

function power(model) {

}

module.exports = power;



power.get_count = function(params, callback){
	var sql = `select count(*) as total from gps_power 
			where add_time>='%s' and add_time<dateadd(day, 1, '%s')`;
	sql = util.format(sql, params.begin_time, params.end_time);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		var total = 0;
		if(result.length>0){
			total = result[0].total;
		}
		callback(err, total);
	});
};

power.get_pages = function(params, callback){
	var pageIndex = parseInt(params.page);
	var pageSize = parseInt(params.size);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = `
		;WITH t AS( 
			SELECT ROW_NUMBER() OVER (ORDER BY t1.id DESC) AS R_Number,t1.*, t2.gps_name 
			FROM gps_power t1 inner join  gps_info t2 on t1.gps_id = t2.gps_id and t2.status=1
			where add_time>='%s' and add_time<dateadd(day, 1, '%s')
		) 
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s `;
	sql = util.format(sql, params.begin_time, params.end_time, start_id, end_id);
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err);
		}
		callback(err, rows);
	});
};

power.get_single = function(id,callback){
	var sql = "select * from gps_power where id = %s";
	sql = util.format(sql, id);
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err)
		}
		callback(err, rows);
	});
};
