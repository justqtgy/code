var db = require('./framework/db_gserver_synth');
var util = require('util');

function daily_report(model){
 
};

module.exports = daily_report



daily_report.get_oilcost = function(start_date, end_date, car_list, callback){	
	var params = [
			{name:"begin_date",  value:start_date},
			{name:"end_date",  value:end_date},
			{name:"car_list",  value:car_list},
		];

 
	db.execSP("gserver_data.dbo.cp_oil_ticket_stat", params, function(err, recordsets, returnValue){
		if(err){
			throw err
		}
		callback(err, recordsets[0]);
	});
}


daily_report.get_oilused = function(start_date, end_date, car_list, callback){	
	var sql = "	;with t1 as ( \
	                select t1.vehicleid, sum(distancecot) as distancecot, sum(cotgas) as cotgas \
	                from View_CarList t1 inner join daily_report t2 on t1.vehicleid=t2.VehicleID \
	                where t1.vehicleid in (%s) and createtime>='%s' and createtime<dateadd(day,1,'%s') \
	                group by t1.vehicleid \
                ), t2 as ( \
					select vehicleid, isnull(sum(amount),0) as amount \
					from gserver_data.dbo.oil_ticket \
					where vehicleid in (%s) and fueltime>='%s' and fueltime<dateadd(day,1,'%s') \
					group by vehicleid \
				)\
                SELECT t.vehicleid, t.carnumber, distancecot, cotgas, isnull(amount,0) as amount \
                FROM  View_CarList t inner join t1 on t1.vehicleid=t.vehicleid \
					  left join t2 on t.vehicleid=t2.vehicleid\
              ";
	sql = util.format(sql, car_list, start_date, end_date,car_list, start_date, end_date);

	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}

daily_report.get_chart = function(start_date, end_date, car_list, callback){	
	var sql = "	select t1.vehicleid, sum(distancecot) as distancecot, sum(cotgas) as cotgas \
	            from View_CarList t1 inner join daily_report t2 on t1.vehicleid=t2.VehicleID \
	            where t2.vehicleid in (%s) and createtime>='%s' and createtime<dateadd(day,1,'%s') \
	            group by t1.vehicleid ";

	sql = util.format(sql, car_list, start_date, end_date);

	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}

daily_report.get_detail = function(start_date, end_date, car_number, callback){	
	/*var sql = "	select createtime, t0.vehicleid, t0.carnumber, isnull(t3.oil_sys, 0) as oil_sys, isnull(t3.oil_self,0) as oil_self, \
					   isnull(t3.oil_diff,0) as oil_diff, isnull(t3.oil_rest,0) as oil_rest, isnull(t3.amount,0) as amount, t1.leakoil, t2.online \
	            from   View_CarList t0 inner join daily_report t1 on t0.vehicleid=t1.vehicleid \
					inner join  vhcOnline t2 on t1.vehicleid=t2.vhcid and t1.static_date=t2.g_day \
					left join gserver_data.dbo.rpt_oil_ticket t3 on t1.vehicleid=t3.VehicleID and t1.static_date = t3.statdate\
	            where t1.vehicleid = '%s' and  createtime>'%s' and createtime<dateadd(day,1,'%s')";
	*/

	var sql = "	select createdate, vehicleid, carnumber, oil_sys, oil_self, oil_diff, oil_rest, amount \
	            from   gserver_data.dbo.rpt_oil_ticket \
	            where vehicleid = '%s' and  createdate>='%s' and createdate<dateadd(day,1,'%s') and oil_sys>15";

	sql = util.format(sql, car_number, start_date, end_date);

	console.log(sql);
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}


daily_report.create_report = function(dtime, callback){	
	var params = [
			{name:"date",  value:dtime},		 
		];

 
	db.execSP("gserver_data.dbo.job_oil_ticket", params, function(err, recordsets, returnValue){
		if(err){
			throw err
		}
		callback(err, recordsets[0]);
	});
}

