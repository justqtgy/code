var db = require('./framework/db_gserver_data');
var util = require('util');

function oil_ticket(model){
    this.id = model.id;//自增id
	this.vehicleid = model.vehicleid;//设备id
	this.driverid = model.driverid;//司机
	this.number = model.number;	 //加油量
	this.price = model.price;//单价
	this.amount = model.amount;  //金额
	this.station = model.station; //加油站
	this.fueltime = model.fueltime;//加油时间
	this.addtime = model.addtime; //时间
}
	 

module.exports = oil_ticket;
//--------------------------------------------------------------------------------------------------------------------------------

oil_ticket.get_count = function(callback){
	db.execSQL('select count(*) as total from oil_ticket', function(err, result){
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
//--------------------------------------------------------------------------------------------------------------------------------

oil_ticket.get_list = function(start_date, end_date, pageIndex, pageSize, callback){
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from oil_ticket) \
			   select * from t where rid between "+ start_id + " and " + end_id;

	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}

		callback(err, rows);
	});
}
//--------------------------------------------------------------------------------------------------------------------------------
/**
 * 查询最近三个月的自助加油记录
 */
oil_ticket.get_mylist = function(driverid,callback){
	var sql = "select * from oil_ticket where driverid = '%s' and fueltime>dateadd(month, -3, GETDATE()) order by fueltime desc ";
	sql = util.format(sql, driverid);

	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}

//--------------------------------------------------------------------------------------------------------------------------------
oil_ticket.add = function(params, callback){
	var sql = "insert into oil_ticket(VehicleID,DriverID,Number, Price,Amount,Station,FuelTime,AddTime, CarNumber) \
							   values('%s', '%s', %s, %s, %s, '%s', '%s', GETDATE(), '%s')";
	sql = util.format(sql, params.vehicleid, params.driverid, params.number, params.price, params.amount, params.station, (params.fueltime||new Date()), params.carnumber);

	console.log(sql);
		
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

//--------------------------------------------------------------------------------------------------------------------------------
oil_ticket.get_checkticket = function(start_date, end_date, car_list, callback){
    var sql = " ;with t as (\
					select vhcid, isnull(sum(oil_sys),0) as sum_1, isnull(sum(oil_self),0) as sum_2 \
					from view_oilticket \
					WHERE createdate>='"+start_date+"' and createdate<dateadd(day,1,'"+end_date+"') \
						 and vhcid in ("+car_list+") \
					group by vhcid \
				) \
				select  sum_1,  sum_2 from t ";

        //sql = util.format(sql, start_date, end_date);
	console.log(sql);
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

//--------------------------------------------------------------------------------------------------------------------------------
oil_ticket.get_ticket_detail = function(start_date, end_date, car_list, callback){
    // var sql = " select createdate, t1.vhcid, t2.carnumber , t3.online, oil_sys, oil_self,(oil_sys-oil_self) as oil_diff, \
	// 		 		   case when oil_sys=oil_self then 0 \
	// 						when oil_sys=0 and oil_self>0 then 1 \
	// 				  	 	when oil_sys>0 and oil_self=0 then 2 \
	// 						when oil_sys<>0 and oil_sys<oil_self then 3 \
	// 		 		   end type \
	// 			from gserver_data.dbo.view_oilticket t1 inner join gserver_synth.dbo.View_CarList t2 on t1.vhcid=t2.VehicleID \
	// 				inner join gserver_synth.dbo.vhconline t3 on t1.vhcid=t3.vhcid \
	// 			where createdate>='%s' and createdate<dateadd(day,1,'%s') and t1.vhcid in (%s) and t1.g_day=t3.g_day ";

	var sql = "	select convert(varchar(10),createdate, 120) as createdate, vehicleid as vhcid, carnumber, oil_sys, oil_self, oil_diff \
	            from   gserver_data.dbo.rpt_oil_ticket \
				where createdate>='%s' and createdate<dateadd(day,1,'%s') and vehicleid in (%s) \
				order by vhcid, createdate ";
		sql = util.format(sql, start_date, end_date, car_list);
		console.log(sql);
	db.execSQL(sql, function(err, result){
		if(err){
			throw err
		}
		callback(err, result);
	});
}

//--------------------------------------------------------------------------------------------------------------------------------
