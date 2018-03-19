var db = require('./framework/db_gserver_data');
var util = require('util');

function gps_alarm(model){
	 
};

module.exports = gps_alarm

gps_alarm.get_count = function(params, callback){
    var sql = " select count(*) as total from gps_alarm where addtime >='%s' and addtime<dateadd(day, 1, '%s')";
    sql = util.format(sql, params.begintime, params.endtime);
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

gps_alarm.get_list = function(params, callback){
    var pageIndex = parseInt(params.pageindex);
    var pageSize = parseInt(params.pagesize);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;

	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid  from gps_alarm  where addtime >='%s' and addtime<dateadd(day, 1, '%s'))  " + 
               "select * from t where rid between %s and %s";
    sql = util.format(sql, params.begintime, params.endtime, start_id, end_id);
 
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}
