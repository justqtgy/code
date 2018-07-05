var util = require('util');
var db = require('./db');

function alarm(){

}

module.exports = alarm

alarm.get_count = function(params, callback){
	var sql = "select count(*) as total from gps_alarm";
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

alarm.get_pages = function(params, callback){
	var pageIndex = parseInt(params.pageIndex);
	var pageSize = parseInt(params.pageSize);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM gps_alarm \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
	sql = util.format(sql, iBeginID, iEndID);
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err);
		}
		callback(err, rows);
	});
};

alarm.get_single = function(id,callback){
	var sql = "select * from gps_alarm where id = %s";
	sql = util.format(sql, id);
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err)
		}
		callback(err, rows);
	});
};

 