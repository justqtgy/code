var db = require('./framework/db_gserver_synth');
var util = require('util');

function traffic(model){
 
};

module.exports = traffic
 

traffic.get_list = function(start_date, end_date, car_list, callback){
	var sql = "	select *, [车牌号码] as carnumber \
	            from   dbo.traffic \
				where createtime>='%s' and createtime<='%s' and vid in (%s) \
				order by vid, createtime ";
	sql = util.format(sql, start_date, end_date, car_list);
	console.log(sql);
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}
