var db = require('./framework/db_gserver_synth');
var util = require('util');

function vehicle_last(model){
 
};

module.exports = vehicle_last
 

vehicle_last.get_list = function(car_list, callback){

	var sql = "	select t1.vehicleid, t1.carnumber,  t2.distance, t2.oil, t3.online \
                from View_CarList t1 inner join vehicle_last t2 on t2.vhcid=t1.VehicleID \
					inner join VhcOnline t3 on t1.VehicleID=t3.vhcid \
                where t1.vehicleid in (%s)  and g_day>=convert(varchar(10), GETDATE(),112) ";
	sql = util.format(sql, car_list.toString());

	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}
